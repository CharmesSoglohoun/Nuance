import { Suspense } from "react";
import Link from "next/link";
import { FormulaireConnexion } from "./FormulaireConnexion";

export const metadata = { title: "Connexion · Nuance" };

export default function Connexion() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-6 pt-6 pb-10">
      <Link href="/" className="-ml-1.5 inline-flex h-11 w-fit items-center gap-1 text-[15px] font-semibold">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Accueil
      </Link>
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sauge-fonce">Connexion ou inscription</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight">Content de te voir</h1>
        <p className="text-[15px] leading-relaxed text-encre-douce">
          Ton compte garde ta palette, tes tenues et tes pièces favorites, sur tous tes appareils.
        </p>
      </header>
      <Suspense>
        <FormulaireConnexion />
      </Suspense>
    </main>
  );
}
