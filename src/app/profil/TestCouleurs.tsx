"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TEINTS, type TeintId } from "@/data/palettes";
import {
  BOUTIQUES,
  SILHOUETTES,
  STYLES,
  calculerSousTon,
  enregistrerProfil,
  type Genre,
  type ProfilStyle,
  type Reponse,
} from "@/lib/profil";

// Petite silhouette illustrée (reprise du design) : s = épaules, w = taille, h = hanches.
const corps = (s: number, w: number, h: number) =>
  `M${20 - s} 20 L${20 + s} 20 L${20 + w} 42 L${20 + h} 63 L${20 - h} 63 L${20 - w} 42 Z`;
const FORMES: Record<string, [number, number, number]> = {
  sablier: [11, 6, 11], triangle: [8, 7, 13], "triangle-inv": [13, 8, 8], rectangle: [10, 9, 10], ovale: [10, 13, 10], trapeze: [13, 10, 10],
};

const VEINES: { id: Reponse; nom: string; c1: string; c2: string }[] = [
  { id: "chaud", nom: "Vertes", c1: "#5E7A4A", c2: "#6F8A55" },
  { id: "froid", nom: "Bleues", c1: "#4F6D9A", c2: "#5C78A6" },
  { id: "neutre", nom: "Entre les deux", c1: "#5E7A4A", c2: "#4F6D9A" },
  { id: "inconnu", nom: "Je ne vois pas bien", c1: "rgba(255,255,255,0.25)", c2: "rgba(255,255,255,0.25)" },
];
const BIJOUX: { id: Reponse; nom: string; c1: string; c2: string }[] = [
  { id: "chaud", nom: "Doré", c1: "#C9A24B", c2: "#C9A24B" },
  { id: "froid", nom: "Argenté", c1: "#A9B0B8", c2: "#A9B0B8" },
  { id: "neutre", nom: "Les deux", c1: "#C9A24B", c2: "#A9B0B8" },
];
const BLANCS: { id: Reponse; nom: string; c1: string; c2: string }[] = [
  { id: "froid", nom: "Blanc pur", c1: "#FFFFFF", c2: "#FFFFFF" },
  { id: "chaud", nom: "Crème", c1: "#F3E6CF", c2: "#F3E6CF" },
  { id: "neutre", nom: "Les deux", c1: "#FFFFFF", c2: "#F3E6CF" },
];

const SOUS_TON_TEXTE = {
  chaud: { fond: "linear-gradient(135deg, #C9A24B, #C2603D)", texte: "Les tons dorés, terre et épicés réchauffent ton teint. L’or te va à merveille." },
  froid: { fond: "linear-gradient(135deg, #8C99A6, #6B3A5B)", texte: "Les tons bleutés, prune et framboise font ressortir ton éclat. L’argent te sublime." },
  neutre: { fond: "linear-gradient(135deg, #C9A24B, #8C99A6)", texte: "Tu as de la chance : tu peux jouer avec les tons chauds comme froids." },
};

const choisi = (oui: boolean) => (oui ? "border-terracotta bg-[#fbede6]" : "border-bordure bg-carte");

export function TestCouleurs() {
  const router = useRouter();
  const [etape, setEtape] = useState(1);
  const [genre, setGenre] = useState<Genre>("f");
  const [taille, setTaille] = useState(168);
  const [silhouette, setSilhouette] = useState("sablier");
  const [teint, setTeint] = useState<TeintId>("miel");
  const [veines, setVeines] = useState<Reponse>("neutre");
  const [bijou, setBijou] = useState<Reponse>("neutre");
  const [blanc, setBlanc] = useState<Reponse>("neutre");
  const [styles, setStyles] = useState<string[]>([]);
  const [boutiques, setBoutiques] = useState<string[]>([]);

  const reponses = { veines, bijou, blanc };
  const sousTon = calculerSousTon(reponses);
  const teintChoisi = TEINTS.find((t) => t.id === teint)!;
  const basculer = (liste: string[], id: string) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]);

  const terminer = () => {
    const profil: ProfilStyle = { genre, tailleCm: taille, silhouette, teint, reponses, sousTon, styles, boutiques };
    enregistrerProfil(profil);
    router.push("/ma-palette");
  };

  const suivant = () => {
    if (etape < 3) {
      setEtape(etape + 1);
      window.scrollTo({ top: 0 });
    } else {
      terminer();
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex flex-col gap-3 px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          {etape === 1 ? (
            <Link href="/" aria-label="Retour à l’accueil" className="-ml-2.5 flex h-11 w-11 items-center justify-center">
              <Chevron />
            </Link>
          ) : (
            <button type="button" onClick={() => setEtape(etape - 1)} aria-label="Étape précédente" className="-ml-2.5 flex h-11 w-11 items-center justify-center">
              <Chevron />
            </button>
          )}
          <p className="text-[13px] font-semibold text-sauge-fonce">Étape {etape} sur 3</p>
          <span className="w-9" />
        </div>
        <div aria-hidden="true" className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1 rounded ${n <= etape ? "bg-terracotta" : "bg-bordure"}`} />
          ))}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-5 pt-2 pb-6">
        {etape === 1 && (
          <>
            <Intro titre="Parlons de ta silhouette" texte="Chaque silhouette est belle. On s’en sert seulement pour équilibrer les proportions de tes tenues." />
            <Section titre="Je m’habille plutôt au rayon">
              <div className="grid grid-cols-2 gap-3">
                {(["h", "f"] as Genre[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={genre === g}
                    onClick={() => {
                      setGenre(g);
                      setSilhouette(g === "h" ? "trapeze" : "sablier");
                    }}
                    className={`flex h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 text-[17px] font-semibold ${choisi(genre === g)}`}
                  >
                    <svg width="30" height="40" viewBox="0 0 40 80" aria-hidden="true">
                      <circle cx="20" cy="9" r="7" fill="#C2603D" />
                      <path d={g === "h" ? "M7 20 L33 20 L30 42 L29 63 L11 63 L10 42 Z" : "M10 20 L30 20 L25 40 L33 63 L7 63 L15 40 Z"} fill="#C2603D" />
                    </svg>
                    {g === "h" ? "Homme" : "Femme"}
                  </button>
                ))}
              </div>
            </Section>
            <section className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="taille" className="text-[15px] font-semibold">Ta taille</label>
                <p className="font-serif text-2xl font-semibold">{taille} cm</p>
              </div>
              <input
                id="taille"
                type="range"
                min={140}
                max={210}
                value={taille}
                onChange={(e) => setTaille(Number(e.target.value))}
                className="h-11 w-full accent-terracotta"
              />
              <div className="flex justify-between text-xs text-[#6b5a4e]"><span>140 cm</span><span>210 cm</span></div>
            </section>
            <Section titre="La silhouette qui te ressemble le plus">
              <div className="flex flex-col gap-2">
                {SILHOUETTES[genre].map((s) => {
                  const [ep, ta, ha] = FORMES[s.id];
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={silhouette === s.id}
                      onClick={() => setSilhouette(s.id)}
                      className={`flex min-h-16 items-center gap-3.5 rounded-2xl border-2 px-3.5 py-2 text-left ${choisi(silhouette === s.id)}`}
                    >
                      <svg width="26" height="52" viewBox="0 0 40 80" aria-hidden="true" className="shrink-0">
                        <circle cx="20" cy="9" r="6.5" fill="#56664C" />
                        <path d={corps(ep, ta, ha)} fill="#7A8B6F" />
                        <rect x="14" y="62" width="4.5" height="16" rx="2" fill="#56664C" />
                        <rect x="21.5" y="62" width="4.5" height="16" rx="2" fill="#56664C" />
                      </svg>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold">{s.nom}</span>
                        <span className="text-[13px] leading-snug text-encre-douce">{s.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Section>
          </>
        )}

        {etape === 2 && (
          <>
            <Intro titre="Ton teint, ta lumière" texte="Toutes les nuances sont belles. On cherche juste la tienne, à la lumière du jour." />
            <Section titre="Choisis la nuance la plus proche de ta peau">
              <div className="grid grid-cols-4 gap-x-2 gap-y-2.5">
                {TEINTS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={teint === t.id}
                    onClick={() => setTeint(t.id)}
                    className="flex flex-col items-center gap-1.5 py-1"
                  >
                    <span
                      className="h-14 w-14 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${t.clair} 0%, ${t.hex} 55%, ${t.hex} 100%)`,
                        boxShadow: `0 0 0 3px #FAF6F0, 0 0 0 ${teint === t.id ? "6px" : "3px"} #A84E2E, 0 4px 10px rgba(43,29,20,0.12)`,
                      }}
                    />
                    <span className={`text-xs ${teint === t.id ? "font-bold" : "font-medium"}`}>{t.nom}</span>
                  </button>
                ))}
              </div>
            </Section>
            <Question numero={1} titre="Tes veines au poignet paraissent plutôt vertes, bleues, ou entre les deux ?">
              <div className="grid grid-cols-2 gap-2">
                {VEINES.map((v) => (
                  <ChoixIllustre key={v.id} actif={veines === v.id} onClick={() => setVeines(v.id)} nom={v.nom}>
                    <svg width="56" height="40" viewBox="0 0 56 40" aria-hidden="true">
                      <rect x="2" y="6" width="52" height="28" rx="14" fill={teintChoisi.hex} />
                      <path d="M8 16 Q20 12 30 18 T50 16" stroke={v.c1} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                      <path d="M10 25 Q22 22 32 26 T48 24" stroke={v.c2} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    </svg>
                  </ChoixIllustre>
                ))}
              </div>
              {veines === "inconnu" && (
                <p className="text-[13px] leading-snug text-[#3f4a38]">
                  Aucun souci : sur beaucoup de peaux, surtout foncées, les veines se voient peu. Les deux questions suivantes suffisent pour trouver ton sous-ton.
                </p>
              )}
            </Question>
            <Question numero={2} titre="Tu te trouves mieux avec un bijou doré ou argenté ?">
              <div className="grid grid-cols-3 gap-2">
                {BIJOUX.map((b) => (
                  <ChoixIllustre key={b.id} actif={bijou === b.id} onClick={() => setBijou(b.id)} nom={b.nom}>
                    <svg width="56" height="40" viewBox="0 0 56 40" aria-hidden="true">
                      <circle cx={b.c1 === b.c2 ? 28 : 20} cy="20" r="12" fill="none" stroke={b.c1} strokeWidth="5" />
                      <circle cx={b.c1 === b.c2 ? 28 : 36} cy="20" r="12" fill="none" stroke={b.c2} strokeWidth="5" />
                    </svg>
                  </ChoixIllustre>
                ))}
              </div>
            </Question>
            <Question numero={3} titre="Près de ton visage, le blanc pur ou le blanc cassé (crème) te va mieux ?">
              <div className="grid grid-cols-3 gap-2">
                {BLANCS.map((w) => (
                  <ChoixIllustre key={w.id} actif={blanc === w.id} onClick={() => setBlanc(w.id)} nom={w.nom}>
                    <svg width="56" height="40" viewBox="0 0 56 40" aria-hidden="true">
                      <rect x="4" y="6" width="22" height="28" rx="6" fill={w.c1} stroke="#D8CCBE" />
                      <rect x="30" y="6" width="22" height="28" rx="6" fill={w.c2} stroke="#D8CCBE" />
                    </svg>
                  </ChoixIllustre>
                ))}
              </div>
            </Question>
            <section aria-live="polite" className="flex items-center gap-3.5 rounded-2xl bg-[#eef1ea] p-4">
              <span aria-hidden="true" className="h-12 w-12 shrink-0 rounded-full shadow-[inset_0_0_0_3px_rgba(255,255,255,0.6)]" style={{ background: SOUS_TON_TEXTE[sousTon].fond }} />
              <div className="flex flex-col gap-1">
                <p className="text-base font-bold">Ton sous-ton : {sousTon}</p>
                <p className="text-[13px] leading-snug text-[#3f4a38]">{SOUS_TON_TEXTE[sousTon].texte}</p>
              </div>
            </section>
          </>
        )}

        {etape === 3 && (
          <>
            <Intro titre="Ce qui te plaît" texte="Choisis autant de styles que tu veux. On les mélangera dans tes tenues." />
            <Section titre="Tes styles">
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={styles.includes(s.id)}
                    onClick={() => setStyles(basculer(styles, s.id))}
                    className={`flex flex-col overflow-hidden rounded-2xl border-2 bg-carte text-left ${i === 4 ? "col-span-2" : ""} ${styles.includes(s.id) ? "border-terracotta" : "border-bordure"}`}
                  >
                    <VisuelStyle id={s.id} />
                    <span className="flex flex-col gap-0.5 px-3 py-2.5">
                      <span className="text-[15px] font-semibold">{styles.includes(s.id) ? "✓ " : ""}{s.nom}</span>
                      <span className="text-xs leading-snug text-encre-douce">{s.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Section>
            <Section titre="Où tu aimes trouver tes vêtements">
              <div className="flex flex-wrap gap-2">
                {BOUTIQUES.map((b) => {
                  const actif = boutiques.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => setBoutiques(basculer(boutiques, b.id))}
                      className={`h-11 rounded-full border-2 px-4 text-sm font-semibold ${actif ? "border-sauge-fonce bg-sauge-fonce text-white" : "border-bordure bg-carte"}`}
                    >
                      {actif ? "✓ " : ""}{b.nom}
                    </button>
                  );
                })}
              </div>
            </Section>
          </>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-[#eadfd2] bg-creme px-5 pt-3 pb-6">
        <button
          type="button"
          onClick={suivant}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-terracotta text-[17px] font-semibold text-white transition hover:bg-[#8a3d22]"
        >
          {etape < 3 ? "Continuer" : "Voir ma palette"}
        </button>
      </footer>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function Intro({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-serif text-[28px] font-semibold leading-tight">{titre}</h1>
      <p className="text-[15px] leading-relaxed text-encre-douce">{texte}</p>
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-semibold">{titre}</h2>
      {children}
    </section>
  );
}

function Question({ numero, titre, children }: { numero: number; titre: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5 rounded-2xl bg-carte p-4 shadow-[0_4px_14px_rgba(43,29,20,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-sauge-fonce">Mini-test du sous-ton · {numero}/3</p>
      <h2 className="text-base font-semibold leading-snug">{titre}</h2>
      {children}
    </section>
  );
}

function ChoixIllustre({ actif, onClick, nom, children }: { actif: boolean; onClick: () => void; nom: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 px-1 py-2.5 text-[13px] font-semibold ${choisi(actif)}`}
    >
      {children}
      {nom}
    </button>
  );
}

function VisuelStyle({ id }: { id: string }) {
  const commun = { width: "100%", height: 80, preserveAspectRatio: "none" as const, "aria-hidden": true };
  switch (id) {
    case "classique":
      return (
        <svg viewBox="0 0 160 80" {...commun}>
          <rect width="160" height="80" fill="#22324D" /><rect width="56" height="80" fill="#C19A6B" /><rect x="56" width="12" height="80" fill="#F3E6CF" /><rect x="104" y="18" width="40" height="44" rx="4" fill="#F3E6CF" />
        </svg>
      );
    case "chic-decontracte":
      return (
        <svg viewBox="0 0 160 80" {...commun}>
          <rect width="160" height="80" fill="#F3E6CF" /><circle cx="48" cy="40" r="30" fill="#7A8B6F" /><rect x="90" y="14" width="52" height="52" rx="12" fill="#C19A6B" />
        </svg>
      );
    case "streetwear":
      return (
        <svg viewBox="0 0 160 80" {...commun}>
          <rect width="160" height="80" fill="#2A2B2F" /><path d="M0 60 L60 10 L90 10 L30 80 L0 80 Z" fill="#C2603D" /><rect x="100" y="24" width="44" height="32" rx="16" fill="#C9CBCF" />
        </svg>
      );
    case "minimaliste":
      return (
        <svg viewBox="0 0 160 80" {...commun}>
          <rect width="160" height="80" fill="#F2F0EC" /><rect x="24" y="20" width="40" height="40" fill="#2B1D14" /><rect x="80" y="20" width="56" height="40" fill="#C9CBCF" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 340 80" {...commun}>
          <rect width="340" height="80" fill="#1F5C6B" />
          {[
            [40, "#D4A235", "#C2603D", "#F3E6CF"],
            [120, "#C2603D", "#F3E6CF", "#1F5C6B"],
            [200, "#D4A235", "#2F5D45", "#F3E6CF"],
            [280, "#C2603D", "#D4A235", "#1F5C6B"],
          ].map(([x, a, b, d]) => (
            <g key={x as number}>
              <circle cx={x as number} cy="40" r="30" fill={a as string} /><circle cx={x as number} cy="40" r="18" fill={b as string} /><circle cx={x as number} cy="40" r="7" fill={d as string} />
            </g>
          ))}
        </svg>
      );
  }
}
