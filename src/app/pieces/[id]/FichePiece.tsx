"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CATEGORIES, SAISONS, rechercheCourte, type Piece } from "@/data/catalogue";
import { boutiquesPour, TYPES_BOUTIQUE } from "@/data/boutiques";
import { STYLES, lireProfil, type ProfilStyle } from "@/lib/profil";
import { couleursPour } from "@/lib/couleursPiece";
import { IllustrationPiece } from "@/components/IllustrationPiece";
import { basculerPieceAimee, estPieceAimee, lirePiecesAimees } from "@/lib/favoris";

const abonner = () => () => {};
const profilBrut = () => {
  const p = lireProfil();
  return p ? JSON.stringify(p) : "";
};

// Profil par défaut si le test n'a pas encore été fait : palette neutre moyenne.
const PROFIL_PAR_DEFAUT: ProfilStyle = {
  genre: "f", tailleCm: 170, silhouette: "rectangle", teint: "miel",
  reponses: { veines: "neutre", bijou: "neutre", blanc: "neutre" }, sousTon: "neutre", styles: [], boutiques: [],
};

export function FichePiece({ piece }: { piece: Piece }) {
  const brut = useSyncExternalStore(abonner, profilBrut, () => null);
  const profil = useMemo<ProfilStyle>(() => (brut ? JSON.parse(brut) : PROFIL_PAR_DEFAUT), [brut]);
  const couleurs = couleursPour(piece, profil);
  const [indiceChoisi, setIndice] = useState<number | null>(null);
  const [copie, setCopie] = useState(false);
  const [version, setVersion] = useState(0); // relit les favoris après un clic sur le cœur
  const aimee = brut !== null && version >= 0 && estPieceAimee(piece.id);
  // Si la pièce a été aimée dans une couleur, la fiche s'ouvre sur cette couleur.
  const couleurAimee = brut !== null ? lirePiecesAimees().find((p) => p.pieceId === piece.id)?.couleur : undefined;
  const indiceAime = couleurs.findIndex((c) => c.nom === couleurAimee);
  const indice = indiceChoisi ?? (indiceAime >= 0 ? indiceAime : 0);
  const couleur = couleurs[Math.min(indice, couleurs.length - 1)];
  const motsCles = `${piece.motsCles} ${couleur.nom.toLowerCase()}`;
  const boutiques = boutiquesPour(piece.categorie, piece.genre, profil.boutiques).slice(0, 4);
  const nomsStyles = piece.styles.map((s) => STYLES.find((x) => x.id === s)?.nom).filter(Boolean).join(", ");

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(motsCles);
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    } catch {
      setCopie(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/pieces" className="-ml-1.5 inline-flex h-11 w-fit items-center gap-1 text-[15px] font-semibold">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          Les pièces
        </Link>
        <button
          type="button"
          aria-pressed={aimee}
          aria-label={aimee ? "Retirer de mes pièces" : "Ajouter à mes pièces"}
          onClick={() => {
            basculerPieceAimee(piece.id, couleur);
            setVersion(version + 1);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-carte text-terracotta shadow-[0_2px_8px_rgba(43,29,20,0.12)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={aimee ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </div>

      <figure role="img" aria-label={`Illustration : ${piece.nom}, coloris ${couleur.nom}`} className="m-0 flex h-60 shrink-0 items-center justify-center rounded-3xl bg-sable">
        <IllustrationPiece piece={piece} couleur={couleur.hex} taille={200} />
      </figure>

      <header className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b5a4e]">{CATEGORIES[piece.categorie]}</p>
        <h1 className="font-serif text-[26px] font-semibold leading-tight">{piece.nom}</h1>
        <p className="text-[15px] text-encre-douce">{couleur.nom} · {piece.matiere.toLowerCase()}</p>
      </header>

      <dl className="grid grid-cols-2 gap-2.5">
        <Info titre="Matière" valeur={piece.matiere} />
        <Info titre="Coupe" valeur={piece.coupe} />
        <Info titre="Saisons" valeur={piece.saisons.map((s) => SAISONS[s]).join(", ")} />
        <Info titre="Styles" valeur={nomsStyles} />
      </dl>

      <section aria-labelledby="couleurs" className="flex flex-col gap-2.5">
        <h2 id="couleurs" className="text-[15px] font-semibold">{brut ? "Dans ta palette" : "Quelques couleurs (fais le test pour voir les tiennes)"}</h2>
        <div className="flex flex-wrap gap-1.5">
          {couleurs.map((c, k) => (
            <button
              key={c.nom}
              type="button"
              aria-label={c.nom}
              aria-pressed={k === indice}
              onClick={() => setIndice(k)}
              className="h-12 w-12 rounded-full"
              style={{ background: c.hex, boxShadow: `0 0 0 3px #FAF6F0, 0 0 0 ${k === indice ? "6px #2B1D14" : "4px rgba(43,29,20,0.15)"}` }}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="reference" className="flex flex-col gap-3 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.07)]">
        <h2 id="reference" className="font-serif text-xl font-semibold">La référence</h2>
        <dl className="flex flex-col gap-2.5 text-sm">
          <Ligne titre="Type et coupe" valeur={`${piece.nom} · ${piece.coupe.toLowerCase()}`} />
          <Ligne titre="Matière conseillée" valeur={piece.matiere} />
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-semibold text-[#6b5a4e]">Couleur</dt>
            <dd className="flex items-center gap-2">
              <span aria-hidden="true" className="h-[18px] w-[18px] rounded-full shadow-[inset_0_0_0_1px_rgba(43,29,20,0.15)]" style={{ background: couleur.hex }} />
              {couleur.nom}
            </dd>
          </div>
          <Ligne titre="Rayon en magasin" valeur={piece.rayon} />
          <div className="flex flex-col gap-1.5">
            <dt className="text-xs font-semibold text-[#6b5a4e]">Mots-clés à taper</dt>
            <dd className="flex items-center gap-2 rounded-xl bg-[#f6efe6] py-2 pr-2 pl-3">
              <span className="flex-1 font-mono text-[13px] leading-snug">{motsCles}</span>
              <button type="button" onClick={copier} className="h-11 shrink-0 rounded-[10px] bg-encre px-3.5 text-[13px] font-semibold text-creme">
                {copie ? "Copié" : "Copier"}
              </button>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="ou" className="flex flex-col gap-2.5">
        <h2 id="ou" className="font-serif text-xl font-semibold">Où la trouver</h2>
        <p className="text-[13px] leading-snug text-encre-douce">
          Chaque bouton ouvre la recherche de la boutique pour ce type de pièce. Tu vois ses vrais résultats du moment : choisis ensuite la couleur sur leur site, ou copie les mots-clés ci-dessus.
        </p>
        {boutiques.map((b) => (
          <article key={b.id} className="flex items-center justify-between gap-3 rounded-2xl bg-carte p-3.5 shadow-[0_4px_14px_rgba(43,29,20,0.07)]">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-bold">{b.nom}</h3>
              <p className="text-[13px] text-encre-douce">{TYPES_BOUTIQUE[b.type]}{b.enMagasinRennes ? " · aussi en magasin à Rennes" : " · en ligne"}</p>
            </div>
            <a
              href={b.recherche(b.avecCouleur ? `${rechercheCourte(piece)} ${couleur.nom.toLowerCase()}` : rechercheCourte(piece))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 shrink-0 items-center rounded-xl border-[1.5px] border-terracotta px-3.5 text-sm font-semibold text-terracotta"
            >
              Chercher
              <span className="sr-only"> chez {b.nom} (nouvel onglet)</span>
            </a>
          </article>
        ))}
      </section>
    </>
  );
}

function Info({ titre, valeur }: { titre: string; valeur: string }) {
  return (
    <div className="rounded-xl bg-carte px-3 py-2.5">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#6b5a4e]">{titre}</dt>
      <dd className="mt-1 text-sm">{valeur}</dd>
    </div>
  );
}

function Ligne({ titre, valeur }: { titre: string; valeur: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold text-[#6b5a4e]">{titre}</dt>
      <dd>{valeur}</dd>
    </div>
  );
}
