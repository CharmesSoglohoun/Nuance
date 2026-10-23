import Link from "next/link";
import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/data/legal";

export function PageLegale({ titre, miseAJour, children }: { titre: string; miseAJour: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pt-4 pb-12">
      <Link href="/moi" className="-ml-1.5 inline-flex h-11 w-fit items-center gap-1 text-[15px] font-semibold">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        Profil
      </Link>
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-semibold leading-tight">{titre}</h1>
        <p className="text-xs text-[#6b5a4e]">Mise à jour : {miseAJour}</p>
      </header>
      <div className="flex flex-col gap-5 text-[15px] leading-relaxed [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-2">
        {children}
      </div>
    </main>
  );
}

export function Contact() {
  return CONTACT_EMAIL ? (
    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-terracotta underline">{CONTACT_EMAIL}</a>
  ) : (
    <span>l’adresse de contact indiquée dans l’application (en cours de mise en place)</span>
  );
}
