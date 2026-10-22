// Boutiques de référence : on ouvre leur propre page de recherche avec les bons mots-clés.
// Aucun code article n'est inventé : la personne voit les vrais résultats du moment.
// « verifie » = le lien de recherche a été testé et affiche bien des résultats (date en commentaire).

import type { Categorie } from "./catalogue";

export type TypeBoutique = "grand-public" | "createurs" | "seconde-main" | "sport";

export type Boutique = {
  id: string;
  nom: string;
  type: TypeBoutique;
  recherche: (motsCles: string) => string;
  categories: Categorie[];
  genres: ("h" | "f" | "mixte")[];
  enMagasinRennes: boolean; // l'enseigne a au moins un magasin à Rennes ou autour
  avecCouleur: boolean; // ajouter la couleur à la recherche (seulement si la boutique gère bien les recherches longues)
  verifie: boolean;
};

const q = (s: string) => encodeURIComponent(s);
const TOUT: Categorie[] = ["haut", "robe", "bas", "chaussures", "piece-en-plus"];

export const BOUTIQUES: Boutique[] = [
  // Vérifié le 2026-10-22 : page de résultats avec les pièces recherchées
  { id: "spartoo", nom: "Spartoo", type: "grand-public", recherche: (m) => `https://www.spartoo.com/search.php?search=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: false, avecCouleur: false, verifie: true },
  { id: "vinted", nom: "Vinted", type: "seconde-main", recherche: (m) => `https://www.vinted.fr/catalog?search_text=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: false, avecCouleur: true, verifie: true },

  // Vérifiés à la main par Charmes sur son téléphone le 2026-10-22 (ces sites bloquent les tests automatiques)
  { id: "zara", nom: "Zara", type: "grand-public", recherche: (m) => `https://www.zara.com/fr/fr/search?searchTerm=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: true, avecCouleur: false, verifie: true },
  { id: "hm", nom: "H&M", type: "grand-public", recherche: (m) => `https://www2.hm.com/fr_fr/search-results.html?q=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: true, avecCouleur: false, verifie: true },
  { id: "celio", nom: "Celio", type: "grand-public", recherche: (m) => `https://www.celio.com/fr-fr/search?q=${q(m)}`, categories: TOUT, genres: ["h", "mixte"], enMagasinRennes: true, avecCouleur: false, verifie: true },
  { id: "zalando", nom: "Zalando", type: "grand-public", recherche: (m) => `https://www.zalando.fr/catalogue/?q=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: false, avecCouleur: false, verifie: true },
  { id: "decathlon", nom: "Decathlon", type: "sport", recherche: (m) => `https://www.decathlon.fr/search?Ntt=${q(m)}`, categories: ["haut", "bas", "chaussures", "piece-en-plus"], genres: ["h", "f", "mixte"], enMagasinRennes: true, avecCouleur: false, verifie: true },
  { id: "etsy", nom: "Etsy (créateurs)", type: "createurs", recherche: (m) => `https://www.etsy.com/fr/search?q=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: false, avecCouleur: false, verifie: true },

  // Kiabi : lien de recherche en échec au test manuel (à corriger). Uniqlo : pas encore testé.
  { id: "kiabi", nom: "Kiabi", type: "grand-public", recherche: (m) => `https://www.kiabi.com/search?q=${q(m)}`, categories: TOUT, genres: ["h", "f", "mixte"], enMagasinRennes: true, avecCouleur: false, verifie: false },
  { id: "uniqlo", nom: "Uniqlo", type: "grand-public", recherche: (m) => `https://www.uniqlo.com/fr/fr/search?q=${q(m)}`, categories: ["haut", "robe", "bas", "piece-en-plus"], genres: ["h", "f", "mixte"], enMagasinRennes: false, avecCouleur: false, verifie: false },
];

export const TYPES_BOUTIQUE: Record<TypeBoutique, string> = {
  "grand-public": "Enseigne grand public",
  createurs: "Créateurs",
  "seconde-main": "Seconde main",
  sport: "Sport",
};

// Boutiques à proposer pour une pièce : vérifiées, adaptées au genre et à la catégorie,
// en mettant d'abord les types de boutiques préférés de la personne.
export function boutiquesPour(categorie: Categorie, genre: "h" | "f" | "mixte", preferences: string[] = []): Boutique[] {
  return BOUTIQUES.filter((b) => b.verifie && b.categories.includes(categorie) && b.genres.includes(genre))
    .sort((a, b) => Number(preferences.includes(b.type)) - Number(preferences.includes(a.type)));
}
