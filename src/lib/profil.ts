import type { SousTon, TeintId } from "@/data/palettes";

export type Genre = "h" | "f";
export type Reponse = "chaud" | "froid" | "neutre" | "inconnu";

export type ProfilStyle = {
  genre: Genre;
  tailleCm: number;
  silhouette: string;
  teint: TeintId;
  reponses: { veines: Reponse; bijou: Reponse; blanc: Reponse };
  sousTon: SousTon;
  styles: string[];
  boutiques: string[];
};

export const SILHOUETTES: Record<Genre, { id: string; nom: string; desc: string }[]> = {
  f: [
    { id: "sablier", nom: "Sablier", desc: "Épaules et hanches alignées, taille marquée." },
    { id: "triangle", nom: "Triangle", desc: "Hanches un peu plus larges que les épaules." },
    { id: "triangle-inv", nom: "Triangle inversé", desc: "Épaules un peu plus larges que les hanches." },
    { id: "rectangle", nom: "Rectangle", desc: "Épaules, taille et hanches dans le même axe." },
    { id: "ovale", nom: "Ovale", desc: "Silhouette tout en rondeur au centre." },
  ],
  h: [
    { id: "trapeze", nom: "Trapèze", desc: "Épaules larges, taille un peu plus fine." },
    { id: "rectangle", nom: "Rectangle", desc: "Épaules, taille et hanches dans le même axe." },
    { id: "triangle-inv", nom: "Triangle inversé", desc: "Épaules très affirmées, hanches étroites." },
    { id: "triangle", nom: "Triangle", desc: "Hanches un peu plus larges que les épaules." },
    { id: "ovale", nom: "Ovale", desc: "Silhouette tout en rondeur au centre." },
  ],
};

export const STYLES = [
  { id: "classique", nom: "Classique", desc: "Lignes nettes, intemporel." },
  { id: "chic-decontracte", nom: "Chic décontracté", desc: "Soigné, sans effort." },
  { id: "streetwear", nom: "Streetwear", desc: "Ample, graphique, urbain." },
  { id: "minimaliste", nom: "Minimaliste", desc: "Peu de pièces, bien choisies." },
  { id: "afro-moderne", nom: "Afro-moderne", desc: "Wax, motifs graphiques et couleurs franches, pour tout le monde." },
];

export const BOUTIQUES = [
  { id: "grand-public", nom: "Enseignes grand public" },
  { id: "createurs", nom: "Boutiques de créateurs" },
  { id: "seconde-main", nom: "Seconde main" },
  { id: "sport", nom: "Magasins de sport" },
];

// Chaque réponse compte +1 (chaud), -1 (froid) ou 0 (neutre / je ne sais pas).
// « Je ne vois pas bien » n'influence pas le résultat : les autres questions décident.
export function calculerSousTon(r: ProfilStyle["reponses"]): SousTon {
  const valeur = (x: Reponse) => (x === "chaud" ? 1 : x === "froid" ? -1 : 0);
  const score = valeur(r.veines) + valeur(r.bijou) + valeur(r.blanc);
  if (score > 0) return "chaud";
  if (score < 0) return "froid";
  return "neutre";
}

// Le profil est gardé dans le téléphone (localStorage), même sans compte.
const CLE = "nuance:profil";

export function lireProfil(): ProfilStyle | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    return brut ? (JSON.parse(brut) as ProfilStyle) : null;
  } catch {
    return null;
  }
}

export function enregistrerProfil(p: ProfilStyle) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(p));
  } catch {
    // Navigation privée ou stockage plein : le résultat s'affiche quand même.
  }
}

// Correspondance avec la table « profiles » de Supabase.
export function versLigneSupabase(userId: string, p: ProfilStyle) {
  return {
    id: userId,
    genre: p.genre,
    taille_cm: p.tailleCm,
    silhouette: p.silhouette,
    teint: p.teint,
    sous_ton: p.sousTon,
    styles: p.styles,
    boutiques: p.boutiques,
  };
}
