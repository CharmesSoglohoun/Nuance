"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CATEGORIES, PIECES, SAISONS, type Categorie, type Saison } from "@/data/catalogue";
import { IllustrationPiece } from "@/components/IllustrationPiece";
import { couleursPour, saisonActuelle } from "@/lib/couleursPiece";
import { lireProfil, type ProfilStyle } from "@/lib/profil";

const abonner = () => () => {};
const profilBrut = () => {
  const p = lireProfil();
  return p ? JSON.stringify(p) : "";
};

const FILTRES_CATEGORIE: (Categorie | "toutes")[] = ["toutes", "haut", "robe", "bas", "chaussures", "piece-en-plus"];

export function ListePieces() {
  const brut = useSyncExternalStore(abonner, profilBrut, () => null);
  const profil = useMemo<ProfilStyle | null>(() => (brut ? JSON.parse(brut) : null), [brut]);
  const [saisonChoisie, setSaison] = useState<Saison | null>(null);
  const [categorie, setCategorie] = useState<Categorie | "toutes">("toutes");

  if (brut === null) return <p className="text-[15px] text-encre-douce">Chargement…</p>;
  // La date du jour n'est lue que dans le navigateur du visiteur, jamais pendant la compilation.
  const saison = saisonChoisie ?? saisonActuelle();
  if (!profil) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-semibold leading-tight">Tes pièces t’attendent</h1>
        <p className="text-[15px] leading-relaxed text-encre-douce">Fais d’abord le test de couleurs : on te montrera les pièces de la saison dans tes couleurs.</p>
        <Link href="/profil" className="flex h-14 items-center justify-center rounded-2xl bg-terracotta text-[17px] font-semibold text-white">Faire le test</Link>
      </section>
    );
  }

  const pieces = PIECES.filter(
    (p) =>
      (p.genre === profil.genre || p.genre === "mixte") &&
      p.saisons.includes(saison) &&
      (categorie === "toutes" || p.categorie === categorie),
  )
    // Les styles choisis au test passent en premier.
    .sort((a, b) => score(b, profil) - score(a, profil));

  const categoriesDispo = FILTRES_CATEGORIE.filter((c) => c !== "robe" || profil.genre === "f");

  return (
    <>
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sauge-fonce">Le catalogue</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight">Tes pièces de saison</h1>
        <p className="text-[15px] leading-relaxed text-encre-douce">Chaque pièce est proposée dans les couleurs de ta palette, avec sa référence pour la trouver.</p>
      </header>

      <nav aria-label="Saison" className="grid grid-cols-3 gap-1 rounded-2xl bg-[#f0e6da] p-1">
        {(Object.keys(SAISONS) as Saison[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={saison === s}
            onClick={() => setSaison(s)}
            className={`h-11 rounded-xl text-sm font-semibold ${saison === s ? "bg-encre text-creme" : ""}`}
          >
            {SAISONS[s]}
          </button>
        ))}
      </nav>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {categoriesDispo.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={categorie === c}
            onClick={() => setCategorie(c)}
            className={`h-10 shrink-0 rounded-full border-2 px-4 text-sm font-semibold ${categorie === c ? "border-sauge-fonce bg-sauge-fonce text-white" : "border-bordure bg-carte"}`}
          >
            {c === "toutes" ? "Tout" : CATEGORIES[c]}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-[#6b5a4e]">{pieces.length} pièce{pieces.length > 1 ? "s" : ""}</p>

      <ul className="grid grid-cols-2 gap-3">
        {pieces.map((p) => {
          const couleur = couleursPour(p, profil)[0];
          return (
            <li key={p.id}>
              <Link href={`/pieces/${p.id}`} className="flex h-full flex-col gap-2 rounded-2xl bg-carte p-3 shadow-[0_4px_14px_rgba(43,29,20,0.07)]">
                <span className="flex items-center justify-center rounded-xl bg-sable py-2">
                  <IllustrationPiece piece={p} couleur={couleur.hex} taille={96} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b5a4e]">{CATEGORIES[p.categorie]}</span>
                <span className="text-[14px] font-semibold leading-snug">{p.nom}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function score(piece: (typeof PIECES)[number], profil: ProfilStyle) {
  return piece.styles.filter((s) => profil.styles.includes(s)).length;
}
