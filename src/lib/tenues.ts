// Moteur de tenues de Charmes : des règles simples, sans IA payante.
// Une tenue = haut (ou robe) + bas (sauf robe) + chaussures + pièce en plus (selon la saison).
// Règles de couleur (cahier des charges, section 7) :
//  - une base neutre + une seule couleur d'accent ;
//  - l'accent se porte en haut (près du visage), tiré des couleurs phares de la palette ;
//  - bas et chaussures en neutres ou en couleurs « loin du visage » ;
//  - deux pièces voisines n'ont jamais la même couleur (sauf ton sur ton volontaire en neutre).

import { PIECES, estNeutre, type Categorie, type Piece, type Saison } from "@/data/catalogue";
import { TEINTS, type Couleur } from "@/data/palettes";
import type { Look } from "@/components/Mannequin2D";
import { couleursPour } from "./couleursPiece";
import type { ProfilStyle } from "./profil";

export type Slot = "haut" | "bas" | "chaussures" | "plus";
export type ElementTenue = { slot: Slot; piece: Piece; couleur: Couleur };
export type Tenue = { saison: Saison; elements: ElementTenue[] };

export const LIBELLES_SLOT: Record<Slot, string> = { haut: "Haut", bas: "Bas", chaussures: "Chaussures", plus: "Pièce en plus" };

// Générateur pseudo-aléatoire reproductible : même graine = même tenue.
function aleatoire(graine: number) {
  let s = (graine * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}
const choisir = <T,>(liste: T[], r: () => number): T => liste[Math.floor(r() * liste.length)];

function candidats(profil: ProfilStyle, saison: Saison, categories: Categorie[], style?: string) {
  const base = PIECES.filter(
    (p) => (p.genre === profil.genre || p.genre === "mixte") && p.saisons.includes(saison) && categories.includes(p.categorie),
  );
  // On garde de préférence les pièces du style dominant de la tenue.
  const duStyle = style ? base.filter((p) => p.styles.includes(style as Piece["styles"][number])) : [];
  return duStyle.length ? duStyle : base;
}

// Pièce en plus : obligatoire en hiver (manteau), fréquente en automne, rare en été.
function veutPieceEnPlus(saison: Saison, r: () => number) {
  if (saison === "hiver") return true;
  if (saison === "automne") return r() < 0.85;
  return r() < 0.35;
}

export function genererTenue(profil: ProfilStyle, saison: Saison, graine: number, verrous: Partial<Record<Slot, ElementTenue>> = {}): Tenue {
  // La saison entre dans la graine : chaque saison a ses propres propositions.
  const r = aleatoire(graine + 1 + { ete: 0, automne: 1000, hiver: 2000 }[saison]);
  const styles = profil.styles.length ? profil.styles : ["chic-decontracte", "minimaliste", "classique"];
  const style = choisir(styles, r);

  // 1. Haut ou robe (une femme a environ une chance sur quatre d'avoir une robe)
  const categoriesHaut: Categorie[] = profil.genre === "f" && r() < 0.25 ? ["robe"] : ["haut"];
  const haut = verrous.haut ?? avecCouleur("haut", choisir(candidats(profil, saison, categoriesHaut, style), r), profil, r, "accent");

  const elements: ElementTenue[] = [haut];
  const prises = new Set([haut.couleur.nom]);

  // 2. Bas (sauf avec une robe)
  if (haut.piece.categorie !== "robe") {
    const bas = verrous.bas ?? avecCouleur("bas", choisir(candidats(profil, saison, ["bas"], style), r), profil, r, "neutre", prises);
    elements.push(bas);
    prises.add(bas.couleur.nom);
  }

  // 3. Chaussures
  const chaussures = verrous.chaussures ?? avecCouleur("chaussures", choisir(candidats(profil, saison, ["chaussures"], style), r), profil, r, "neutre", prises);
  elements.push(chaussures);
  prises.add(chaussures.couleur.nom);

  // 4. Pièce en plus : en hiver, un manteau ou une doudoune en priorité
  if (verrous.plus || veutPieceEnPlus(saison, r)) {
    let liste = candidats(profil, saison, ["piece-en-plus"], style);
    if (saison === "hiver") {
      // En hiver, le manteau passe avant le style : on le cherche aussi hors du style dominant.
      const estChaud = (p: Piece) => /manteau|doudoune/.test(p.id);
      const chauds = liste.filter(estChaud);
      liste = chauds.length ? chauds : candidats(profil, saison, ["piece-en-plus"]).filter(estChaud);
    }
    // Si le haut est déjà une couleur d'accent, la pièce en plus reste neutre (une seule couleur forte).
    const mode = estNeutre(haut.couleur.nom) ? "accent" : "neutre";
    elements.push(verrous.plus ?? avecCouleur("plus", choisir(liste, r), profil, r, mode, prises));
  }

  return { saison, elements };
}

function avecCouleur(slot: Slot, piece: Piece, profil: ProfilStyle, r: () => number, mode: "accent" | "neutre", eviter = new Set<string>()): ElementTenue {
  const toutes = couleursPour(piece, profil);
  const couleurs = toutes.filter((c) => !eviter.has(c.nom));
  const neutres = couleurs.filter((c) => estNeutre(c.nom));
  const accents = couleurs.filter((c) => !estNeutre(c.nom));
  // Plus de neutre libre ? On préfère un neutre déjà porté (ton sur ton) à une deuxième couleur forte.
  const neutresDejaPortes = toutes.filter((c) => estNeutre(c.nom));
  const liste =
    mode === "accent"
      ? accents.length ? accents : couleurs
      : neutres.length ? neutres : neutresDejaPortes.length ? neutresDejaPortes : couleurs;
  return { slot, piece, couleur: choisir(liste.length ? liste : toutes, r) };
}

// Remplace une seule pièce de la tenue, en gardant les autres.
export function changerPiece(tenue: Tenue, slot: Slot, profil: ProfilStyle, graine: number): Tenue {
  const verrous: Partial<Record<Slot, ElementTenue>> = {};
  tenue.elements.forEach((e) => {
    if (e.slot !== slot) verrous[e.slot] = e;
  });
  const actuel = tenue.elements.find((e) => e.slot === slot);
  // On réessaie quelques graines pour obtenir vraiment une autre pièce ou une autre couleur.
  for (let essai = 0; essai < 12; essai++) {
    const nouvelle = genererTenue(profil, tenue.saison, graine + essai * 97, verrous);
    const remplacant = nouvelle.elements.find((e) => e.slot === slot);
    if (remplacant && (remplacant.piece.id !== actuel?.piece.id || remplacant.couleur.nom !== actuel?.couleur.nom)) return nouvelle;
  }
  return tenue;
}

// Traduit la tenue pour le mannequin.
export function lookPour(tenue: Tenue, profil: ProfilStyle): Look {
  const teint = TEINTS.find((t) => t.id === profil.teint)!;
  const fonce = ["cacao", "ebene", "cannelle", "caramel"].includes(profil.teint);
  const look: Look = {
    g: profil.genre,
    skin: teint.hex,
    hair: fonce ? "#1E140E" : "#6B4228",
    hairStyle: profil.genre === "f" ? "chignon" : "court",
    outer: "none",
    scarf: "none",
    hat: "none",
  };
  for (const { piece, couleur } of tenue.elements) {
    if (piece.categorie === "haut" || piece.categorie === "robe") {
      look.top = couleur.hex;
      look.sleeve = /tshirt|polo|top|wax|blouse/.test(piece.id) && tenue.saison === "ete" ? "court" : "long";
      look.col = /col-roule/.test(piece.id) ? "roule" : "";
      if (piece.categorie === "robe") {
        look.bottom = couleur.hex;
        look.bottomType = "jupe";
      }
    } else if (piece.categorie === "bas") {
      look.bottom = couleur.hex;
      look.bottomType = /jupe/.test(piece.id) ? "jupe" : /short/.test(piece.id) ? "short" : "pantalon";
    } else if (piece.categorie === "chaussures") {
      look.shoes = couleur.hex;
    } else if (/echarpe|foulard/.test(piece.id)) {
      look.scarf = couleur.hex;
    } else if (/bonnet/.test(piece.id)) {
      look.hat = couleur.hex;
    } else {
      look.outer = couleur.hex;
      look.outerLen = /manteau|trench/.test(piece.id) ? "long" : "court";
    }
  }
  return look;
}
