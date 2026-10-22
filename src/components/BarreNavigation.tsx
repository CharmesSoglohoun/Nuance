"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Barre du bas, reprise du design : Studio, Ma palette, Favoris, Profil.
const ONGLETS = [
  { href: "/studio", nom: "Studio", actifSur: ["/studio", "/pieces"], icone: <path d="M10 6a2 2 0 1 1 2 2v2M12 10l-9 7h18z" /> },
  {
    href: "/ma-palette",
    nom: "Ma palette",
    actifSur: ["/ma-palette"],
    icone: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-2 0-1.3-1-1.6-1-2.8 0-1.2 1-2.2 2.2-2.2H17a4 4 0 0 0 4-4c0-3.9-4-7-9-7z" />
        <circle cx="7.5" cy="11" r="1.2" />
        <circle cx="10" cy="7" r="1.2" />
        <circle cx="15" cy="7.5" r="1.2" />
      </>
    ),
  },
  { href: "/favoris", nom: "Favoris", actifSur: ["/favoris"], icone: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" /> },
  {
    href: "/moi",
    nom: "Profil",
    actifSur: ["/moi"],
    icone: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </>
    ),
  },
];

export function BarreNavigation() {
  const chemin = usePathname();
  return (
    <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-20 border-t border-[#eadfd2] bg-carte pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid h-[70px] max-w-md grid-cols-4 px-1">
        {ONGLETS.map((o) => {
          const actif = o.actifSur.some((p) => chemin.startsWith(p));
          return (
            <Link
              key={o.href}
              href={o.href}
              aria-current={actif ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${actif ? "font-bold text-terracotta" : "font-medium text-[#6b5a4e]"}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {o.icone}
              </svg>
              {o.nom}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
