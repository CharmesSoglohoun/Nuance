import Link from "next/link";
import { Mannequin2D, type Look } from "@/components/Mannequin2D";

// Les quatre profils de l'accueil : hommes et femmes, peaux noires et blanches.
const ACCUEIL: { look: Look; label: string }[] = [
  {
    label: "Homme à la peau noire",
    look: { g: "h", skin: "#6B3E24", hair: "#1E140E", hairStyle: "court", top: "#7A8B6F", sleeve: "long", bottom: "#E9DCC4", bottomType: "pantalon", shoes: "#A87A4E" },
  },
  {
    label: "Femme à la peau claire",
    look: { g: "f", skin: "#F1D3BC", hair: "#6B4228", hairStyle: "chignon", top: "#D9A5B3", sleeve: "court", bottom: "#4F6D8A", bottomType: "jupe", shoes: "#8B7B72" },
  },
  {
    label: "Femme à la peau noire",
    look: { g: "f", skin: "#4A2A18", hair: "#1A120D", hairStyle: "afro", top: "#D4A235", sleeve: "long", bottom: "#C2603D", bottomType: "pantalon", shoes: "#3E2618" },
  },
  {
    label: "Homme à la peau claire",
    look: { g: "h", skin: "#EBC4A4", hair: "#8A5A32", hairStyle: "raie", top: "#22324D", sleeve: "long", bottom: "#6B7A3A", bottomType: "pantalon", shoes: "#EFE9DF" },
  },
];

export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-6 pt-14 pb-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sauge-fonce">Ton conseil en style</p>
        <h1 className="font-serif text-6xl font-semibold leading-none tracking-tight">Charmes</h1>
        <p className="max-w-[300px] text-[17px] leading-relaxed text-encre-douce">
          Les couleurs qui te vont, la tenue de la saison, et où la trouver.
        </p>
      </header>

      <figure
        role="img"
        aria-label={`Quatre silhouettes stylisées : ${ACCUEIL.map((a) => a.label.toLowerCase()).join(", ")}, chacun dans une tenue aux couleurs harmonieuses`}
        className="relative flex min-h-[300px] flex-1 items-end justify-center overflow-hidden rounded-3xl bg-sable px-1.5 pb-5"
      >
        <svg aria-hidden="true" viewBox="0 0 342 360" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <circle cx="70" cy="90" r="64" fill="#C9A24B" opacity="0.28" />
          <circle cx="270" cy="70" r="80" fill="#C2603D" opacity="0.16" />
          <circle cx="200" cy="150" r="46" fill="#7A8B6F" opacity="0.2" />
          <rect x="0" y="300" width="342" height="60" fill="#E8D8C4" />
        </svg>
        <div className="relative flex items-end justify-center">
          {ACCUEIL.map((a) => (
            <Mannequin2D key={a.label} look={a.look} width={84} height={176} />
          ))}
        </div>
      </figure>

      <nav className="flex flex-col gap-2">
        <Link
          href="/profil"
          className="flex h-14 items-center justify-center rounded-2xl bg-terracotta text-[17px] font-semibold text-white shadow-[0_8px_20px_rgba(168,78,46,0.25)] transition hover:bg-[#8a3d22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
        >
          Découvrir mes couleurs
        </Link>
        <Link href="/connexion" className="flex h-12 items-center justify-center text-[15px] font-medium text-encre">
          J’ai déjà un compte
        </Link>
      </nav>
    </main>
  );
}
