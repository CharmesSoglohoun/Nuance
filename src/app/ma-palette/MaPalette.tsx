"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { TEINTS, ideePour, paletteFor } from "@/data/palettes";
import { lireProfil, versLigneSupabase, type ProfilStyle } from "@/lib/profil";
import { createClient } from "@/lib/supabase/client";

// Lecture du profil gardé dans le téléphone, sans décalage entre serveur et navigateur.
const abonner = () => () => {};
const profilBrut = () => {
  const p = lireProfil();
  return p ? JSON.stringify(p) : "";
};

type Sauvegarde = "verification" | "invite" | "enregistre" | "erreur";

export function MaPalette() {
  const brut = useSyncExternalStore(abonner, profilBrut, () => null);
  const profil = useMemo<ProfilStyle | null>(() => (brut ? JSON.parse(brut) : null), [brut]);
  const [indice, setIndice] = useState(0);
  const [sauvegarde, setSauvegarde] = useState<Sauvegarde>("verification");

  // Si la personne est connectée, on enregistre son profil dans son compte (RLS : seulement sa ligne).
  useEffect(() => {
    if (!profil) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setSauvegarde("invite");
        return;
      }
      const { error } = await supabase.from("profiles").upsert(versLigneSupabase(data.user.id, profil));
      setSauvegarde(error ? "erreur" : "enregistre");
    });
  }, [profil]);

  if (brut === null) return <p className="text-[15px] text-encre-douce">Chargement de ta palette…</p>;

  if (!profil) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-semibold leading-tight">Ta palette t’attend</h1>
        <p className="text-[15px] leading-relaxed text-encre-douce">
          Fais le test de couleurs (moins de 2 minutes) pour découvrir les couleurs qui te mettent en valeur.
        </p>
        <Link href="/profil" className="flex h-14 items-center justify-center rounded-2xl bg-terracotta text-[17px] font-semibold text-white">
          Faire le test
        </Link>
      </section>
    );
  }

  const palette = paletteFor(profil.teint, profil.sousTon);
  const teint = TEINTS.find((t) => t.id === profil.teint)!;
  const choix = palette.phares[Math.min(indice, palette.phares.length - 1)];

  return (
    <>
      <header className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sauge-fonce">Ma palette</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight">{palette.nom}</h1>
        <div className="flex flex-wrap gap-1.5">
          <Etiquette>Sous-ton {profil.sousTon}</Etiquette>
          <Etiquette>
            <span aria-hidden="true" className="h-3 w-3 rounded-full shadow-[inset_0_0_0_1px_rgba(43,29,20,0.2)]" style={{ background: teint.hex }} />
            Teint {teint.nom.toLowerCase()}
          </Etiquette>
          <Etiquette>{palette.contraste}</Etiquette>
        </div>
      </header>

      <section aria-labelledby="phares" className="flex flex-col gap-3.5 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
        <div className="flex items-baseline justify-between">
          <h2 id="phares" className="text-base font-semibold">Tes 12 couleurs phares</h2>
          <p className="text-xs text-[#6b5a4e]">Touche une couleur</p>
        </div>
        <div className="grid grid-cols-4 gap-x-1.5 gap-y-3">
          {palette.phares.map((c, k) => (
            <button key={c.nom} type="button" aria-pressed={k === indice} onClick={() => setIndice(k)} className="flex flex-col items-center gap-1.5 py-0.5">
              <span
                className="h-12 w-12 rounded-full"
                style={{ background: c.hex, boxShadow: `0 0 0 3px #FFFDF9, 0 0 0 ${k === indice ? "5px #2B1D14" : "3px rgba(43,29,20,0.15)"}` }}
              />
              <span className={`text-center text-[11px] leading-tight ${k === indice ? "font-bold" : "font-medium"}`}>{c.nom}</span>
            </button>
          ))}
        </div>
        <div aria-live="polite" className="flex items-center gap-3 rounded-xl bg-[#f6efe6] px-3 py-2.5">
          <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(43,29,20,0.15)]" style={{ background: choix.hex }} />
          <p className="text-[13px] leading-snug">
            <strong>{choix.nom}</strong> · {ideePour(choix.nom)}
          </p>
        </div>
      </section>

      <section aria-labelledby="loin" className="flex flex-col gap-3 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
        <h2 id="loin" className="text-base font-semibold">À porter loin du visage</h2>
        <div className="grid grid-cols-5 gap-1.5">
          {palette.loin.map((c) => (
            <div key={c.nom} className="flex flex-col items-center gap-1.5">
              <span aria-hidden="true" className="h-10 w-10 rounded-full shadow-[inset_0_0_0_1px_rgba(43,29,20,0.15)]" style={{ background: c.hex }} />
              <span className="text-center text-[11px] leading-tight">{c.nom}</span>
            </div>
          ))}
        </div>
        <p className="text-[13px] leading-relaxed text-encre-douce">
          Tu peux tout à fait les porter : elles brillent en pantalon, en chaussures ou en sac, un peu à distance de ton visage.
        </p>
      </section>

      <section className="flex flex-col gap-2 rounded-2xl bg-[#eef1ea] p-4">
        <h2 className="font-serif text-xl font-semibold">Pourquoi ces couleurs ?</h2>
        <p className="text-sm leading-relaxed text-[#33402d]">{palette.pourquoi}</p>
      </section>

      <EtatSauvegarde etat={sauvegarde} />

      <div className="flex flex-col gap-2">
        <Link href="/profil" className="flex h-12 items-center justify-center rounded-2xl border-2 border-terracotta font-semibold text-terracotta">
          Refaire le test de couleurs
        </Link>
        <p className="text-center text-xs text-[#6b5a4e]">Les tenues de la saison arrivent dans la prochaine version.</p>
      </div>
    </>
  );
}

function Etiquette({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#f3e3d8] px-3 text-[13px] font-medium">{children}</span>;
}

function EtatSauvegarde({ etat }: { etat: Sauvegarde }) {
  if (etat === "enregistre") {
    return <p className="rounded-xl bg-[#eef1ea] p-3 text-sm text-[#33402d]">✓ Ta palette est enregistrée dans ton compte.</p>;
  }
  if (etat === "invite") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border-2 border-dashed border-bordure p-4">
        <p className="text-sm leading-relaxed text-encre-douce">Crée ton compte pour retrouver ta palette sur tous tes appareils.</p>
        <Link href="/connexion" className="text-[15px] font-semibold text-terracotta underline">
          Créer mon compte gratuitement
        </Link>
      </div>
    );
  }
  if (etat === "erreur") {
    return <p className="rounded-xl bg-[#fbede6] p-3 text-sm text-[#8a3d22]">Ta palette n’a pas pu être enregistrée dans ton compte. Elle reste gardée sur ce téléphone.</p>;
  }
  return null;
}
