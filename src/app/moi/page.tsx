import { Suspense } from "react";
import Link from "next/link";
import { BarreNavigation } from "@/components/BarreNavigation";
import { createClient } from "@/lib/supabase/server";
import { seDeconnecter } from "../connexion/actions";
import { ProfilReglages } from "./ProfilReglages";

export const metadata = { title: "Profil et réglages · Charmes" };

export default function PageProfil() {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pt-6 pb-28">
        <h1 className="font-serif text-3xl font-semibold">Profil</h1>
        <Suspense fallback={<p className="text-[15px] text-encre-douce">Chargement de ton compte…</p>}>
          <Compte />
        </Suspense>
        <ProfilReglages />
      </main>
      <BarreNavigation />
    </>
  );
}

// Lit la session : doit rester derrière <Suspense> (règle de Next.js avec Cache Components).
async function Compte() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  if (!data?.claims) {
    return (
      <section className="flex flex-col gap-2 rounded-2xl border-2 border-dashed border-bordure p-4">
        <p className="text-sm leading-relaxed text-encre-douce">
          Tu utilises Charmes sans compte : ton profil et tes favoris sont gardés sur ce téléphone uniquement.
        </p>
        <Link href="/connexion" className="text-[15px] font-semibold text-terracotta underline">
          Me connecter ou créer mon compte
        </Link>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-3 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta font-serif text-xl font-semibold text-white">
        {email?.[0]?.toUpperCase() ?? "N"}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-xs text-[#6b5a4e]">Connecté avec</p>
        <p className="truncate text-[15px] font-semibold">{email}</p>
      </div>
      <form action={seDeconnecter}>
        <button type="submit" className="h-11 rounded-xl border-2 border-terracotta px-3 text-sm font-semibold text-terracotta">
          Déconnexion
        </button>
      </form>
    </section>
  );
}
