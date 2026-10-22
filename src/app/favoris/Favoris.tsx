"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { PIECES, SAISONS, type Saison } from "@/data/catalogue";
import { Mannequin2D } from "@/components/Mannequin2D";
import { IllustrationPiece } from "@/components/IllustrationPiece";
import { lookPour, type Slot, type Tenue } from "@/lib/tenues";
import {
  basculerPieceAimee,
  lirePiecesAimees,
  lireTenuesAimees,
  retirerTenue,
  synchroniser,
  type TenueAimee,
} from "@/lib/favoris";
import { lireProfil, type ProfilStyle } from "@/lib/profil";

const abonner = () => () => {};
const profilBrut = () => {
  const p = lireProfil();
  return p ? JSON.stringify(p) : "";
};

const SLOT_DE: Record<string, Slot> = { haut: "haut", robe: "haut", bas: "bas", chaussures: "chaussures", "piece-en-plus": "plus" };

// Reconstruit une tenue complète (pour le mannequin) à partir de ce qui a été enregistré.
function versTenue(t: TenueAimee): Tenue | null {
  const elements = t.pieces
    .map((p) => {
      const piece = PIECES.find((x) => x.id === p.pieceId);
      return piece ? { slot: SLOT_DE[piece.categorie], piece, couleur: { nom: p.couleur, hex: p.hex } } : null;
    })
    .filter((e) => e !== null);
  return elements.length ? { saison: t.saison, elements } : null;
}

export function Favoris() {
  const brut = useSyncExternalStore(abonner, profilBrut, () => null);
  const profil = useMemo<ProfilStyle | null>(() => (brut ? JSON.parse(brut) : null), [brut]);
  const [onglet, setOnglet] = useState<"tenues" | "pieces">("tenues");
  const [filtre, setFiltre] = useState<Saison | "toutes">("toutes");
  const [version, setVersion] = useState(0); // relit les favoris après un changement
  const [source, setSource] = useState<"compte" | "telephone" | null>(null);

  useEffect(() => {
    synchroniser().then((s) => {
      setSource(s);
      setVersion((v) => v + 1);
    });
  }, []);

  if (brut === null) return <p className="text-[15px] text-encre-douce">Chargement de tes favoris…</p>;

  const tenues = version >= 0 ? lireTenuesAimees().filter((t) => filtre === "toutes" || t.saison === filtre) : [];
  const pieces = version >= 0 ? lirePiecesAimees() : [];

  return (
    <>
      <header className="flex flex-col gap-1.5">
        <h1 className="font-serif text-3xl font-semibold">Favoris</h1>
        {source === "compte" && <p className="text-[13px] text-sauge-fonce">✓ Enregistrés dans ton compte</p>}
        {source === "telephone" && (
          <p className="text-[13px] text-encre-douce">
            Gardés sur ce téléphone. <Link href="/connexion" className="font-semibold text-terracotta underline">Connecte-toi</Link> pour les retrouver partout.
          </p>
        )}
      </header>

      <div role="tablist" aria-label="Type de favoris" className="flex border-b border-bordure">
        {(["tenues", "pieces"] as const).map((o) => (
          <button
            key={o}
            role="tab"
            type="button"
            aria-selected={onglet === o}
            onClick={() => setOnglet(o)}
            className={`h-12 flex-1 border-b-[3px] text-[15px] font-semibold ${onglet === o ? "border-terracotta text-encre" : "border-transparent text-[#6b5a4e]"}`}
          >
            {o === "tenues" ? "Mes tenues" : "Mes pièces"}
          </button>
        ))}
      </div>

      {onglet === "tenues" && (
        <>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
            {(["toutes", "ete", "automne", "hiver"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filtre === f}
                onClick={() => setFiltre(f)}
                className={`h-10 shrink-0 rounded-full border-2 px-4 text-sm font-semibold ${filtre === f ? "border-encre bg-encre text-creme" : "border-bordure bg-carte"}`}
              >
                {f === "toutes" ? "Toutes" : SAISONS[f]}
              </button>
            ))}
          </div>
          {tenues.length === 0 ? (
            <Vide texte="Touche le cœur dans le Studio pour garder une tenue. Elle t’attendra ici, rangée par saison." lien="/studio" bouton="Aller au Studio" />
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {tenues.map((t) => {
                const tenue = versTenue(t);
                if (!tenue || !profil) return null;
                return (
                  <li key={t.id} className="flex flex-col gap-2 rounded-2xl bg-carte p-3 shadow-[0_4px_14px_rgba(43,29,20,0.07)]">
                    <div className="flex justify-center rounded-xl bg-sable py-2">
                      <Mannequin2D look={lookPour(tenue, profil)} width={70} height={147} />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b5a4e]">{SAISONS[t.saison]}</p>
                    <ul className="flex flex-col gap-1">
                      {tenue.elements.map((e) => (
                        <li key={e.piece.id} className="flex items-center gap-1.5 text-xs leading-tight">
                          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(43,29,20,0.15)]" style={{ background: e.couleur.hex }} />
                          <Link href={`/pieces/${e.piece.id}`} className="underline-offset-2 hover:underline">{e.piece.nom}</Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => {
                        retirerTenue(t.id);
                        setVersion(version + 1);
                      }}
                      className="mt-auto h-10 rounded-xl border border-bordure text-[13px] font-semibold"
                    >
                      Retirer
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {onglet === "pieces" &&
        (pieces.length === 0 ? (
          <Vide texte="Touche le cœur sur une pièce qui te plaît : tu retrouveras ici sa référence pour la chercher plus tard." lien="/pieces" bouton="Voir les pièces" />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {pieces.map((p) => {
              const piece = PIECES.find((x) => x.id === p.pieceId);
              if (!piece) return null;
              return (
                <li key={p.pieceId} className="flex items-center gap-3 rounded-2xl bg-carte p-3 shadow-[0_4px_14px_rgba(43,29,20,0.07)]">
                  <span className="flex shrink-0 items-center justify-center rounded-xl bg-sable p-1">
                    <IllustrationPiece piece={piece} couleur={p.hex} taille={56} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Link href={`/pieces/${piece.id}`} className="text-sm font-semibold leading-snug underline-offset-2 hover:underline">{piece.nom}</Link>
                    <p className="text-xs text-encre-douce">Couleur : {p.couleur}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Retirer ${piece.nom} des favoris`}
                    onClick={() => {
                      basculerPieceAimee(p.pieceId, { nom: p.couleur, hex: p.hex });
                      setVersion(version + 1);
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-terracotta"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
    </>
  );
}

function Vide({ texte, lien, bouton }: { texte: string; lien: string; bouton: string }) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-bordure px-6 py-10 text-center">
      <h2 className="font-serif text-xl font-semibold">Ta garde-robe commence ici</h2>
      <p className="text-sm leading-relaxed text-encre-douce">{texte}</p>
      <Link href={lien} className="mt-1 flex h-12 items-center rounded-2xl bg-terracotta px-5 font-semibold text-white">{bouton}</Link>
    </section>
  );
}
