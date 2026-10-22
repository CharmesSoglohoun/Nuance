import Link from "next/link";

// Écran provisoire pour les parcours qui ne sont pas encore codés.
export function BientotDisponible({ titre, texte }: { titre: string; texte: string }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sauge-fonce">Bientôt disponible</p>
      <h1 className="font-serif text-4xl font-semibold leading-tight">{titre}</h1>
      <p className="text-[15px] leading-relaxed text-encre-douce">{texte}</p>
      <Link
        href="/"
        className="mt-2 flex h-12 items-center justify-center rounded-2xl border-2 border-terracotta font-semibold text-terracotta"
      >
        Revenir à l’accueil
      </Link>
    </main>
  );
}
