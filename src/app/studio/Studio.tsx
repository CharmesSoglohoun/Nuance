"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { SAISONS, type Saison } from "@/data/catalogue";
import { paletteFor } from "@/data/palettes";
import dynamic from "next/dynamic";
import { Mannequin2D } from "@/components/Mannequin2D";

// La 3D ne se charge que dans le navigateur ; en attendant, un espace vide de la même taille.
const Mannequin3D = dynamic(() => import("@/components/Mannequin3D").then((m) => m.Mannequin3D), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-encre-douce">Chargement du mannequin 3D…</div>,
});
import { LIBELLES_SLOT, changerPiece, genererTenue, lookPour, type Slot, type Tenue } from "@/lib/tenues";
import { basculerTenueAimee, estAimee, synchroniser } from "@/lib/favoris";
import { saisonActuelle } from "@/lib/couleursPiece";
import { lireProfil, type ProfilStyle } from "@/lib/profil";

const abonner = () => () => {};
const profilBrut = () => {
  const p = lireProfil();
  return p ? JSON.stringify(p) : "";
};

const AMBIANCE: Record<Saison, { fond: string; titre: string; texte: string }> = {
  ete: { fond: "#F7EBD3", titre: "Lin et couleurs claires", texte: "Des matières légères, une seule couche, des couleurs lumineuses." },
  automne: { fond: "#EEDFCF", titre: "Tons terre et deux couches", texte: "Une couche par-dessus, des matières plus épaisses, des couleurs chaudes et profondes." },
  hiver: { fond: "#E4E2E6", titre: "Couleurs profondes et trois couches", texte: "Un manteau, de la maille, et des couleurs denses qui réchauffent la tenue." },
};

export function Studio() {
  const brut = useSyncExternalStore(abonner, profilBrut, () => null);
  const profil = useMemo<ProfilStyle | null>(() => (brut ? JSON.parse(brut) : null), [brut]);
  const [saisonChoisie, setSaison] = useState<Saison | null>(null);
  const [graine, setGraine] = useState(1);
  const [tenueModifiee, setTenueModifiee] = useState<Tenue | null>(null);
  const [aimeeMaj, setAimeeMaj] = useState(0); // force le rafraîchissement du cœur
  const [changements, setChangements] = useState(0); // fait varier la pièce proposée à chaque « Changer »

  // Récupère les tenues aimées sur d'autres appareils (si la personne est connectée).
  useEffect(() => {
    synchroniser().then(() => setAimeeMaj((n) => n + 1));
  }, []);

  if (brut === null) return <p className="text-[15px] text-encre-douce">Chargement du Studio…</p>;
  if (!profil) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-semibold leading-tight">Ton Studio t’attend</h1>
        <p className="text-[15px] leading-relaxed text-encre-douce">Fais d’abord le test de couleurs : on composera ensuite tes tenues de saison.</p>
        <Link href="/profil" className="flex h-14 items-center justify-center rounded-2xl bg-terracotta text-[17px] font-semibold text-white">Faire le test</Link>
      </section>
    );
  }

  // La date du jour n'est lue que dans le navigateur (jamais pendant la compilation).
  const saison = saisonChoisie ?? saisonActuelle();
  const tenue = tenueModifiee && tenueModifiee.saison === saison ? tenueModifiee : genererTenue(profil, saison, graine);
  const aimee = aimeeMaj >= 0 && estAimee(tenue);
  const palette = paletteFor(profil.teint, profil.sousTon);
  const ambiance = AMBIANCE[saison];

  const autreProposition = () => {
    setTenueModifiee(null);
    setGraine(graine + 1);
  };
  const changer = (slot: Slot) => {
    setChangements(changements + 1);
    setTenueModifiee(changerPiece(tenue, slot, profil, graine * 31 + changements * 7 + 3));
  };
  const aimer = () => {
    basculerTenueAimee(tenue);
    setAimeeMaj(aimeeMaj + 1);
  };
  const choisirSaison = (s: Saison) => {
    setSaison(s);
    setTenueModifiee(null);
  };

  return (
    <>
      <header className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-semibold">Studio</h1>
        <Link href="/ma-palette" className="rounded-full bg-[#f0e6da] px-3.5 py-2 text-[13px] font-semibold">Palette {palette.nom}</Link>
      </header>

      <nav aria-label="Saison" className="grid grid-cols-3 gap-1 rounded-2xl bg-[#f0e6da] p-1">
        {(Object.keys(SAISONS) as Saison[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={saison === s}
            onClick={() => choisirSaison(s)}
            className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold ${saison === s ? "bg-encre text-creme" : ""}`}
          >
            {SAISONS[s]}
            {s === saisonActuelle() && <span aria-label="saison actuelle" className="h-1.5 w-1.5 rounded-full bg-or" />}
          </button>
        ))}
      </nav>

      <section aria-label="Ta tenue sur ton mannequin" className="relative flex h-[372px] shrink-0 items-center justify-center overflow-hidden rounded-3xl" style={{ background: ambiance.fond }}>
        <svg aria-hidden="true" viewBox="0 0 350 372" className="absolute inset-0 h-full w-full">
          <ellipse cx="175" cy="340" rx="140" ry="22" fill="rgba(43,29,20,0.06)" />
        </svg>
        <button
          type="button"
          onClick={aimer}
          aria-pressed={aimee}
          aria-label={aimee ? "Retirer des tenues aimées" : "J’aime cette tenue"}
          className="absolute top-2.5 right-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-carte text-terracotta shadow-[0_2px_8px_rgba(43,29,20,0.12)]"
        >
          <Coeur plein={aimee} />
        </button>
        <div className="absolute inset-0">
          <Mannequin3D
            look={lookPour(tenue, profil)}
            silhouette={profil.silhouette}
            tailleCm={profil.tailleCm}
            hauteur={372}
            repli={
              <div className="flex h-full items-center justify-center">
                <Mannequin2D look={lookPour(tenue, profil)} width={152} height={320} />
              </div>
            }
          />
        </div>
        <p className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[rgba(255,253,249,0.92)] px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap shadow-[0_2px_8px_rgba(43,29,20,0.12)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
          360° · Fais glisser pour tourner
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={aimer}
          aria-pressed={aimee}
          className={`flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-terracotta text-[15px] font-semibold ${aimee ? "bg-terracotta text-white" : "text-terracotta"}`}
        >
          <Coeur plein={aimee} petit />
          {aimee ? "Aimée" : "J’aime"}
        </button>
        <button type="button" onClick={autreProposition} className="flex h-12 items-center justify-center rounded-2xl bg-encre text-[15px] font-semibold text-creme">
          Autre proposition
        </button>
      </div>

      <div className="flex flex-col gap-1 rounded-2xl bg-[#eef1ea] px-3.5 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#3f4a38]">{ambiance.titre}</p>
        <p className="text-sm leading-snug">{ambiance.texte}</p>
      </div>

      <h2 className="mt-1 font-serif text-[22px] font-semibold">La tenue</h2>
      <ul className="grid grid-cols-2 gap-2.5">
        {tenue.elements.map((e) => (
          <li key={e.slot} className="flex flex-col gap-2 rounded-2xl bg-carte p-3 shadow-[0_4px_14px_rgba(43,29,20,0.07)]">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-7 w-7 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(43,29,20,0.15)]" style={{ background: e.couleur.hex }} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b5a4e]">{e.piece.categorie === "robe" ? "Robe" : LIBELLES_SLOT[e.slot]}</span>
            </div>
            <Link href={`/pieces/${e.piece.id}`} className="text-sm font-semibold leading-snug underline-offset-2 hover:underline">
              {e.piece.nom}
            </Link>
            <p className="text-xs text-encre-douce">Couleur : {e.couleur.nom}</p>
            <button type="button" onClick={() => changer(e.slot)} className="mt-auto h-10 rounded-xl border border-bordure text-[13px] font-semibold">
              Changer cette pièce
            </button>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs text-[#6b5a4e]">Touche le nom d’une pièce pour voir où la trouver.</p>
    </>
  );
}

function Coeur({ plein, petit = false }: { plein: boolean; petit?: boolean }) {
  const t = petit ? 18 : 22;
  return (
    <svg width={t} height={t} viewBox="0 0 24 24" fill={plein ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
