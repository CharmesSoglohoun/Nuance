import { PRES_DU_VISAGE, estNeutre, type Piece, type Saison } from "@/data/catalogue";
import { paletteFor, type Couleur } from "@/data/palettes";
import type { ProfilStyle } from "./profil";

// Couleurs proposées pour une pièce, tirées de la palette de la personne.
// Près du visage : les 12 couleurs phares. Loin du visage : les neutres de la palette + les couleurs « loin du visage ».
export function couleursPour(piece: Piece, profil: ProfilStyle): Couleur[] {
  const palette = paletteFor(profil.teint, profil.sousTon);
  if (PRES_DU_VISAGE.includes(piece.categorie)) return palette.phares;
  const vus = new Set<string>();
  return [...palette.phares.filter((c) => estNeutre(c.nom)), ...palette.loin].filter((c) => !vus.has(c.nom) && vus.add(c.nom));
}

// Saison en cours d'après la date (hémisphère nord).
export function saisonActuelle(date = new Date()): Saison {
  const mois = date.getMonth() + 1;
  if (mois >= 4 && mois <= 8) return "ete";
  if (mois >= 9 && mois <= 11) return "automne";
  return "hiver";
}
