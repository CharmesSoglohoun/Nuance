"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TEINTS, paletteFor } from "@/data/palettes";
import { BOUTIQUES, SILHOUETTES, STYLES, lireProfil, type ProfilStyle } from "@/lib/profil";
import { lirePiecesAimees, lireTenuesAimees } from "@/lib/favoris";
import { createClient } from "@/lib/supabase/client";

const abonner = () => () => {};
const profilBrut = () => {
  const p = lireProfil();
  return p ? JSON.stringify(p) : "";
};

// Toutes les clés que Charmes garde sur le téléphone.
const CLES_LOCALES = ["nuance:profil", "nuance:tenues-aimees", "nuance:pieces-aimees"];

export function ProfilReglages() {
  const brut = useSyncExternalStore(abonner, profilBrut, () => null);
  const profil = useMemo<ProfilStyle | null>(() => (brut ? JSON.parse(brut) : null), [brut]);
  const router = useRouter();
  const [confirmer, setConfirmer] = useState(false);
  const [etat, setEtat] = useState<"repos" | "export" | "suppression" | "erreur">("repos");

  const telecharger = async () => {
    setEtat("export");
    const supabase = createClient();
    const { data: u } = await supabase.auth.getUser();
    let compte = null;
    if (u.user) {
      const [profilDb, tenues, pieces] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("outfits").select("*"),
        supabase.from("favorite_products").select("*"),
      ]);
      compte = { email: u.user.email, cree_le: u.user.created_at, profil: profilDb.data, tenues_aimees: tenues.data, pieces_aimees: pieces.data };
    }
    const donnees = {
      application: "Charmes",
      exporte_le: new Date().toISOString(),
      sur_ce_telephone: { profil: lireProfil(), tenues_aimees: lireTenuesAimees(), pieces_aimees: lirePiecesAimees() },
      dans_mon_compte: compte,
    };
    const blob = new Blob([JSON.stringify(donnees, null, 2)], { type: "application/json" });
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(blob);
    lien.download = `charmes-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
    lien.click();
    URL.revokeObjectURL(lien.href);
    setEtat("repos");
  };

  const supprimer = async () => {
    setEtat("suppression");
    const supabase = createClient();
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      // Efface le compte et, par cascade, le profil, les favoris et les tenues (fonction SQL 0003).
      const { error } = await supabase.rpc("supprimer_mon_compte");
      if (error) {
        setEtat("erreur");
        return;
      }
      await supabase.auth.signOut();
    }
    CLES_LOCALES.forEach((c) => {
      try {
        window.localStorage.removeItem(c);
      } catch {
        // rien à effacer
      }
    });
    // Retour à l'accueil, puis rechargement des données côté serveur (la session n'existe plus).
    router.replace("/");
    router.refresh();
  };

  if (brut === null) return null;

  const palette = profil ? paletteFor(profil.teint, profil.sousTon) : null;
  const teint = profil ? TEINTS.find((t) => t.id === profil.teint) : null;
  const lignes = profil
    ? [
        { label: "Genre", valeur: profil.genre === "h" ? "Homme" : "Femme" },
        { label: "Taille", valeur: `${profil.tailleCm} cm` },
        { label: "Silhouette", valeur: SILHOUETTES[profil.genre].find((s) => s.id === profil.silhouette)?.nom ?? "—" },
        { label: "Teint", valeur: teint?.nom ?? "—", pastille: teint?.hex },
        { label: "Sous-ton", valeur: profil.sousTon.charAt(0).toUpperCase() + profil.sousTon.slice(1) },
        { label: "Palette", valeur: palette?.nom ?? "—" },
        { label: "Styles", valeur: profil.styles.map((s) => STYLES.find((x) => x.id === s)?.nom).filter(Boolean).join(", ") || "Aucun choisi" },
        { label: "Boutiques préférées", valeur: profil.boutiques.map((b) => BOUTIQUES.find((x) => x.id === b)?.nom).filter(Boolean).join(", ") || "Aucune choisie" },
      ]
    : [];

  return (
    <>
      <section aria-labelledby="profil-style" className="flex flex-col gap-3 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
        <h2 id="profil-style" className="text-base font-semibold">Mon profil de style</h2>
        {profil ? (
          <dl className="flex flex-col divide-y divide-[#eadfd2]">
            {lignes.map((l) => (
              <div key={l.label} className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-sm text-[#6b5a4e]">{l.label}</dt>
                <dd className="flex items-center gap-2 text-right text-sm font-semibold">
                  {l.pastille && <span aria-hidden="true" className="h-4 w-4 rounded-full" style={{ background: l.pastille }} />}
                  {l.valeur}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-encre-douce">Tu n’as pas encore fait le test de couleurs.</p>
        )}
        <Link href="/profil" className="flex h-12 items-center justify-center rounded-2xl bg-terracotta font-semibold text-white">
          {profil ? "Refaire le test de couleurs" : "Faire le test de couleurs"}
        </Link>
        {profil && <p className="text-xs text-[#6b5a4e]">Pour modifier une réponse, refais le test : il prend moins de 2 minutes.</p>}
      </section>

      <section aria-labelledby="confidentialite" className="flex flex-col gap-2.5 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
        <h2 id="confidentialite" className="text-base font-semibold">Confidentialité</h2>
        <p className="text-[13px] leading-relaxed text-encre-douce">
          Charmes ne garde que ce qui sert à te conseiller : ton profil de style et tes favoris. Pas de photo, pas de publicité, pas de revente.
        </p>
        <button type="button" onClick={telecharger} disabled={etat === "export"} className="h-12 rounded-xl border-2 border-bordure text-[15px] font-semibold disabled:opacity-60">
          {etat === "export" ? "Préparation de tes données…" : "Télécharger mes données"}
        </button>

        {!confirmer ? (
          <button type="button" onClick={() => setConfirmer(true)} className="h-12 rounded-xl border-2 border-[#b3261e] text-[15px] font-semibold text-[#b3261e]">
            Supprimer mon compte et mes données
          </button>
        ) : (
          <div role="alertdialog" aria-labelledby="titre-suppr" className="flex flex-col gap-2.5 rounded-xl bg-[#fbede6] p-3.5">
            <p id="titre-suppr" className="text-sm font-semibold text-[#7a1d17]">Tout effacer pour de bon ?</p>
            <p className="text-[13px] leading-relaxed text-[#7a1d17]">
              Ton compte (s’il existe), ton profil, ta palette, tes tenues et tes pièces favorites seront effacés, sur ce téléphone et dans ton compte. Cette action est définitive.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmer(false)} className="h-11 rounded-xl border-2 border-bordure bg-carte text-sm font-semibold">
                Annuler
              </button>
              <button type="button" onClick={supprimer} disabled={etat === "suppression"} className="h-11 rounded-xl bg-[#b3261e] text-sm font-semibold text-white disabled:opacity-60">
                {etat === "suppression" ? "Suppression…" : "Oui, tout effacer"}
              </button>
            </div>
            {etat === "erreur" && (
              <p role="alert" className="text-[13px] text-[#7a1d17]">La suppression n’a pas fonctionné. Réessaie dans un instant.</p>
            )}
          </div>
        )}

        <nav aria-label="Informations légales" className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[13px]">
          <Link href="/confidentialite" className="font-semibold text-terracotta underline">Politique de confidentialité</Link>
          <Link href="/mentions-legales" className="font-semibold text-terracotta underline">Mentions légales</Link>
        </nav>
      </section>
    </>
  );
}
