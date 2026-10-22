import { BarreNavigation } from "@/components/BarreNavigation";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { seDeconnecter } from "../connexion/actions";

export const metadata = { title: "Mon espace · Nuance" };

export default function MonEspace() {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-6 pt-10 pb-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sauge-fonce">Mon espace</p>
        <Suspense fallback={<p className="text-[15px] text-encre-douce">Chargement de ton espace…</p>}>
          <Espace />
        </Suspense>
      </main>
      <BarreNavigation />
    </>
  );
}

// Lit la session : doit rester derrière <Suspense> (règle de Next.js avec Cache Components).
async function Espace() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  if (!data?.claims) redirect("/connexion");

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-semibold leading-tight">Bienvenue !</h1>
        <p className="text-[15px] leading-relaxed text-encre-douce">
          Tu es connecté avec <strong className="text-encre">{email}</strong>.
        </p>
      </header>
      <section className="flex flex-col gap-2 rounded-2xl bg-carte p-5 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
        <h2 className="text-[16px] font-semibold">Mes couleurs</h2>
        <p className="text-[14px] leading-relaxed text-encre-douce">
          Ta palette est enregistrée dans ton compte dès que tu fais le test en étant connecté. Bientôt ici : tes tenues et tes pièces favorites.
        </p>
        <Link href="/ma-palette" className="mt-1 text-[15px] font-semibold text-terracotta underline">
          Voir ma palette
        </Link>
        <Link href="/profil" className="text-[15px] font-semibold text-terracotta underline">
          Faire ou refaire le test de couleurs
        </Link>
      </section>
      <form action={seDeconnecter}>
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-2xl border-2 border-terracotta font-semibold text-terracotta"
        >
          Me déconnecter
        </button>
      </form>
    </>
  );
}
