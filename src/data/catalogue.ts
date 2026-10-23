// Catalogue de Charmes : des « pièces types » précises, sans prix ni code article inventé.
// La couleur n'est pas figée : elle vient de la palette de la personne.
//  - pièces portées près du visage (hauts, robes, pièces en plus) → couleurs phares de la palette ;
//  - pièces portées loin du visage (bas, chaussures) → neutres de la palette + couleurs « loin du visage ».

export type Categorie = "haut" | "robe" | "bas" | "chaussures" | "piece-en-plus";
export type Saison = "ete" | "automne" | "hiver";
export type StyleId = "classique" | "chic-decontracte" | "streetwear" | "minimaliste" | "afro-moderne";

export type Piece = {
  id: string;
  nom: string;
  categorie: Categorie;
  genre: "h" | "f" | "mixte";
  saisons: Saison[];
  styles: StyleId[];
  matiere: string;
  coupe: string;
  rayon: string;
  motsCles: string; // sans la couleur, ajoutée selon la palette
};

export const CATEGORIES: Record<Categorie, string> = {
  haut: "Haut",
  robe: "Robe",
  bas: "Bas",
  chaussures: "Chaussures",
  "piece-en-plus": "Pièce en plus",
};

export const SAISONS: Record<Saison, string> = { ete: "Printemps-été", automne: "Automne", hiver: "Hiver" };

// Couleurs qui se portent bien loin du visage, quelle que soit la palette.
export const PRES_DU_VISAGE: Categorie[] = ["haut", "robe", "piece-en-plus"];

const p = (piece: Piece) => piece;

export const PIECES: Piece[] = [
  // ======================= HOMME : hauts =======================
  p({ id: "h-tshirt-col-rond", nom: "T-shirt col rond en coton épais", categorie: "haut", genre: "h", saisons: ["ete", "automne"], styles: ["minimaliste", "streetwear", "chic-decontracte"], matiere: "Coton épais (180 g/m² ou plus)", coupe: "Droite, épaules ajustées", rayon: "Homme > T-shirts", motsCles: "t-shirt homme col rond coton épais" }),
  p({ id: "h-chemise-lin", nom: "Chemise en lin, col officier", categorie: "haut", genre: "h", saisons: ["ete"], styles: ["chic-decontracte", "minimaliste"], matiere: "Lin", coupe: "Droite, manches longues à retrousser", rayon: "Homme > Chemises > Lin", motsCles: "chemise lin homme col officier" }),
  p({ id: "h-polo-pique", nom: "Polo en maille piquée", categorie: "haut", genre: "h", saisons: ["ete"], styles: ["classique", "chic-decontracte"], matiere: "Coton piqué", coupe: "Ajustée", rayon: "Homme > Polos", motsCles: "polo homme maille piquée coton" }),
  p({ id: "h-chemise-oxford", nom: "Chemise Oxford, col boutonné", categorie: "haut", genre: "h", saisons: ["ete", "automne"], styles: ["classique", "chic-decontracte"], matiere: "Coton Oxford", coupe: "Ajustée", rayon: "Homme > Chemises", motsCles: "chemise oxford homme col boutonné" }),
  p({ id: "h-chemise-flanelle", nom: "Chemise en flanelle", categorie: "haut", genre: "h", saisons: ["automne", "hiver"], styles: ["chic-decontracte", "streetwear"], matiere: "Flanelle de coton", coupe: "Droite", rayon: "Homme > Chemises", motsCles: "chemise flanelle homme" }),
  p({ id: "h-pull-merinos", nom: "Pull col rond en laine mérinos", categorie: "haut", genre: "h", saisons: ["automne", "hiver"], styles: ["classique", "minimaliste", "chic-decontracte"], matiere: "Laine mérinos", coupe: "Ajustée, maille fine", rayon: "Homme > Pulls", motsCles: "pull homme col rond laine mérinos" }),
  p({ id: "h-col-roule", nom: "Pull col roulé en maille", categorie: "haut", genre: "h", saisons: ["hiver"], styles: ["classique", "minimaliste"], matiere: "Laine ou laine mélangée", coupe: "Ajustée", rayon: "Homme > Pulls > Cols roulés", motsCles: "pull col roulé homme laine" }),
  p({ id: "h-sweat-capuche", nom: "Sweat à capuche en molleton", categorie: "haut", genre: "h", saisons: ["automne", "hiver"], styles: ["streetwear"], matiere: "Molleton de coton", coupe: "Ample", rayon: "Homme > Sweats", motsCles: "sweat capuche homme molleton coton" }),
  p({ id: "h-chemise-wax", nom: "Chemise à motifs wax", categorie: "haut", genre: "h", saisons: ["ete"], styles: ["afro-moderne"], matiere: "Coton imprimé wax", coupe: "Droite, manches courtes", rayon: "Homme > Chemises > Imprimées", motsCles: "chemise homme wax imprimé africain" }),
  p({ id: "h-tshirt-oversize", nom: "T-shirt oversize imprimé", categorie: "haut", genre: "h", saisons: ["ete", "automne"], styles: ["streetwear"], matiere: "Coton", coupe: "Oversize, épaules tombantes", rayon: "Homme > T-shirts", motsCles: "t-shirt oversize homme" }),

  // ======================= HOMME : bas =======================
  p({ id: "h-chino", nom: "Chino coupe droite, taille mi-haute", categorie: "bas", genre: "h", saisons: ["ete", "automne"], styles: ["classique", "chic-decontracte"], matiere: "Coton sergé, un peu de stretch", coupe: "Droite, taille mi-haute", rayon: "Homme > Pantalons > Chinos", motsCles: "chino homme coupe droite" }),
  p({ id: "h-jean-droit", nom: "Jean droit en denim brut", categorie: "bas", genre: "h", saisons: ["ete", "automne", "hiver"], styles: ["classique", "minimaliste", "chic-decontracte"], matiere: "Denim brut", coupe: "Droite", rayon: "Homme > Jeans > Coupe droite", motsCles: "jean homme coupe droite brut" }),
  p({ id: "h-short-chino", nom: "Short chino", categorie: "bas", genre: "h", saisons: ["ete"], styles: ["chic-decontracte", "classique"], matiere: "Coton sergé", coupe: "Au-dessus du genou", rayon: "Homme > Shorts", motsCles: "short chino homme" }),
  p({ id: "h-velours", nom: "Pantalon en velours côtelé", categorie: "bas", genre: "h", saisons: ["automne", "hiver"], styles: ["chic-decontracte", "classique"], matiere: "Velours côtelé", coupe: "Droite", rayon: "Homme > Pantalons", motsCles: "pantalon velours côtelé homme" }),
  p({ id: "h-cargo", nom: "Pantalon cargo", categorie: "bas", genre: "h", saisons: ["automne", "ete"], styles: ["streetwear"], matiere: "Toile de coton", coupe: "Ample, poches latérales", rayon: "Homme > Pantalons > Cargo", motsCles: "pantalon cargo homme" }),
  p({ id: "h-pantalon-laine", nom: "Pantalon de costume en laine", categorie: "bas", genre: "h", saisons: ["hiver", "automne"], styles: ["classique", "minimaliste"], matiere: "Laine", coupe: "Fuselée, à pinces", rayon: "Homme > Pantalons > Habillés", motsCles: "pantalon homme laine habillé" }),

  // ======================= HOMME : chaussures =======================
  p({ id: "h-baskets-cuir", nom: "Baskets basses en cuir", categorie: "chaussures", genre: "h", saisons: ["ete", "automne"], styles: ["minimaliste", "chic-decontracte", "streetwear"], matiere: "Cuir lisse", coupe: "Basse, semelle fine", rayon: "Homme > Chaussures > Baskets", motsCles: "baskets basses cuir homme" }),
  p({ id: "h-chelsea", nom: "Bottines chelsea en daim", categorie: "chaussures", genre: "h", saisons: ["automne", "hiver"], styles: ["chic-decontracte", "classique"], matiere: "Daim", coupe: "Tige élastiquée", rayon: "Homme > Chaussures > Boots", motsCles: "bottines chelsea daim homme" }),
  p({ id: "h-derbies", nom: "Derbies en cuir grainé", categorie: "chaussures", genre: "h", saisons: ["automne", "hiver"], styles: ["classique"], matiere: "Cuir grainé", coupe: "Lacets, bout rond", rayon: "Homme > Chaussures de ville", motsCles: "derbies cuir homme" }),
  p({ id: "h-espadrilles", nom: "Espadrilles en toile", categorie: "chaussures", genre: "h", saisons: ["ete"], styles: ["chic-decontracte"], matiere: "Toile et corde", coupe: "Sans lacets", rayon: "Homme > Chaussures > Été", motsCles: "espadrilles homme toile" }),

  // ======================= HOMME : pièces en plus =======================
  p({ id: "h-surchemise", nom: "Surchemise en laine", categorie: "piece-en-plus", genre: "h", saisons: ["automne"], styles: ["chic-decontracte", "streetwear"], matiere: "Laine mélangée", coupe: "Droite, se porte ouverte", rayon: "Homme > Vestes > Surchemises", motsCles: "surchemise homme laine" }),
  p({ id: "h-veste-workwear", nom: "Veste workwear en toile épaisse", categorie: "piece-en-plus", genre: "h", saisons: ["automne", "ete"], styles: ["streetwear", "chic-decontracte"], matiere: "Toile de coton épaisse", coupe: "Droite, poches plaquées", rayon: "Homme > Vestes", motsCles: "veste workwear homme toile" }),
  p({ id: "h-manteau-laine", nom: "Manteau droit en laine", categorie: "piece-en-plus", genre: "h", saisons: ["hiver"], styles: ["classique", "minimaliste"], matiere: "Laine mélangée", coupe: "Droite, mi-cuisse", rayon: "Homme > Manteaux", motsCles: "manteau laine homme droit" }),
  p({ id: "h-doudoune", nom: "Doudoune légère sans capuche", categorie: "piece-en-plus", genre: "h", saisons: ["hiver", "automne"], styles: ["streetwear", "minimaliste"], matiere: "Nylon matelassé", coupe: "Ajustée", rayon: "Homme > Manteaux > Doudounes", motsCles: "doudoune légère homme" }),
  p({ id: "h-blazer", nom: "Blazer déstructuré", categorie: "piece-en-plus", genre: "h", saisons: ["ete", "automne"], styles: ["chic-decontracte", "classique"], matiere: "Coton ou lin", coupe: "Sans épaulettes", rayon: "Homme > Vestes de costume", motsCles: "blazer homme déstructuré" }),

  // ======================= FEMME : hauts et robes =======================
  p({ id: "f-tshirt-col-v", nom: "T-shirt col V en coton", categorie: "haut", genre: "f", saisons: ["ete", "automne"], styles: ["minimaliste", "chic-decontracte"], matiere: "Coton", coupe: "Droite, col V", rayon: "Femme > T-shirts", motsCles: "t-shirt femme col v coton" }),
  p({ id: "f-chemisier-lavalliere", nom: "Chemisier fluide, col lavallière", categorie: "haut", genre: "f", saisons: ["automne", "ete"], styles: ["classique", "chic-decontracte"], matiere: "Crêpe ou viscose", coupe: "Fluide", rayon: "Femme > Chemisiers", motsCles: "chemisier femme col lavallière fluide" }),
  p({ id: "f-blouse-lin", nom: "Blouse en lin", categorie: "haut", genre: "f", saisons: ["ete"], styles: ["chic-decontracte", "minimaliste"], matiere: "Lin", coupe: "Ample", rayon: "Femme > Chemises et blouses", motsCles: "blouse lin femme" }),
  p({ id: "f-col-roule", nom: "Pull col roulé en maille fine", categorie: "haut", genre: "f", saisons: ["hiver", "automne"], styles: ["classique", "minimaliste"], matiere: "Laine mérinos ou cachemire", coupe: "Ajustée", rayon: "Femme > Pulls > Cols roulés", motsCles: "pull col roulé femme maille fine" }),
  p({ id: "f-pull-cachemire", nom: "Pull col rond en cachemire", categorie: "haut", genre: "f", saisons: ["hiver", "automne"], styles: ["classique", "chic-decontracte"], matiere: "Cachemire ou laine douce", coupe: "Droite", rayon: "Femme > Pulls", motsCles: "pull col rond femme cachemire" }),
  p({ id: "f-cardigan", nom: "Cardigan court en maille", categorie: "haut", genre: "f", saisons: ["automne", "ete"], styles: ["chic-decontracte", "classique"], matiere: "Maille de coton ou laine", coupe: "Court, boutonné", rayon: "Femme > Gilets", motsCles: "cardigan court femme maille" }),
  p({ id: "f-top-wax", nom: "Top à motifs wax", categorie: "haut", genre: "f", saisons: ["ete"], styles: ["afro-moderne"], matiere: "Coton imprimé wax", coupe: "Ajustée ou à volants", rayon: "Femme > Tops > Imprimés", motsCles: "top femme wax imprimé africain" }),
  p({ id: "f-chemise-oversize", nom: "Chemise oversize en popeline", categorie: "haut", genre: "f", saisons: ["ete", "automne"], styles: ["minimaliste", "streetwear"], matiere: "Popeline de coton", coupe: "Oversize", rayon: "Femme > Chemises", motsCles: "chemise oversize femme popeline" }),
  p({ id: "f-sweat", nom: "Sweat col rond en molleton", categorie: "haut", genre: "f", saisons: ["automne", "hiver"], styles: ["streetwear"], matiere: "Molleton de coton", coupe: "Ample", rayon: "Femme > Sweats", motsCles: "sweat femme col rond molleton" }),
  p({ id: "f-robe-chemise", nom: "Robe chemise ceinturée", categorie: "robe", genre: "f", saisons: ["ete", "automne"], styles: ["chic-decontracte", "classique"], matiere: "Coton ou viscose", coupe: "Mi-longue, ceinture à la taille", rayon: "Femme > Robes", motsCles: "robe chemise ceinturée femme" }),
  p({ id: "f-robe-pull", nom: "Robe pull en maille", categorie: "robe", genre: "f", saisons: ["hiver"], styles: ["minimaliste", "chic-decontracte"], matiere: "Maille de laine", coupe: "Midi, près du corps", rayon: "Femme > Robes > Maille", motsCles: "robe pull maille femme" }),
  p({ id: "f-robe-wax", nom: "Robe en wax", categorie: "robe", genre: "f", saisons: ["ete"], styles: ["afro-moderne"], matiere: "Coton imprimé wax", coupe: "Évasée", rayon: "Femme > Robes > Imprimées", motsCles: "robe wax femme imprimé africain" }),

  // ======================= FEMME : bas =======================
  p({ id: "f-jupe-plissee", nom: "Jupe midi plissée, taille haute", categorie: "bas", genre: "f", saisons: ["ete", "automne"], styles: ["chic-decontracte", "classique"], matiere: "Crêpe fluide", coupe: "Plissée, longueur midi", rayon: "Femme > Jupes > Midi", motsCles: "jupe midi plissée femme" }),
  p({ id: "f-pantalon-large", nom: "Pantalon large à pinces, taille haute", categorie: "bas", genre: "f", saisons: ["automne", "hiver", "ete"], styles: ["classique", "minimaliste", "chic-decontracte"], matiere: "Crêpe ou laine légère", coupe: "Large, taille haute", rayon: "Femme > Pantalons", motsCles: "pantalon large pinces femme taille haute" }),
  p({ id: "f-jean-droit", nom: "Jean droit taille haute", categorie: "bas", genre: "f", saisons: ["ete", "automne", "hiver"], styles: ["minimaliste", "chic-decontracte", "streetwear"], matiere: "Denim", coupe: "Droite, taille haute", rayon: "Femme > Jeans > Coupe droite", motsCles: "jean droit femme taille haute" }),
  p({ id: "f-jupe-jean", nom: "Jupe en jean", categorie: "bas", genre: "f", saisons: ["ete"], styles: ["chic-decontracte", "streetwear"], matiere: "Denim", coupe: "Trapèze, au-dessus du genou", rayon: "Femme > Jupes", motsCles: "jupe en jean femme" }),
  p({ id: "f-pantalon-cargo", nom: "Pantalon cargo", categorie: "bas", genre: "f", saisons: ["automne", "ete"], styles: ["streetwear"], matiere: "Toile de coton", coupe: "Ample", rayon: "Femme > Pantalons > Cargo", motsCles: "pantalon cargo femme" }),
  p({ id: "f-short-lin", nom: "Short en lin", categorie: "bas", genre: "f", saisons: ["ete"], styles: ["chic-decontracte", "minimaliste"], matiere: "Lin", coupe: "Taille haute", rayon: "Femme > Shorts", motsCles: "short lin femme" }),

  // ======================= FEMME : chaussures =======================
  p({ id: "f-baskets-cuir", nom: "Baskets basses en cuir", categorie: "chaussures", genre: "f", saisons: ["ete", "automne"], styles: ["minimaliste", "chic-decontracte", "streetwear"], matiere: "Cuir lisse", coupe: "Basse", rayon: "Femme > Chaussures > Baskets", motsCles: "baskets basses cuir femme" }),
  p({ id: "f-mocassins", nom: "Mocassins en cuir lisse", categorie: "chaussures", genre: "f", saisons: ["automne", "ete"], styles: ["classique", "chic-decontracte"], matiere: "Cuir lisse", coupe: "Plats", rayon: "Femme > Chaussures > Mocassins", motsCles: "mocassins cuir femme" }),
  p({ id: "f-bottines", nom: "Bottines à petit talon", categorie: "chaussures", genre: "f", saisons: ["automne", "hiver"], styles: ["classique", "chic-decontracte"], matiere: "Cuir ou daim", coupe: "Talon de 3 à 5 cm", rayon: "Femme > Chaussures > Bottines", motsCles: "bottines petit talon femme" }),
  p({ id: "f-sandales", nom: "Sandales plates à brides", categorie: "chaussures", genre: "f", saisons: ["ete"], styles: ["minimaliste", "chic-decontracte", "afro-moderne"], matiere: "Cuir", coupe: "Plates", rayon: "Femme > Chaussures > Sandales", motsCles: "sandales plates brides cuir femme" }),

  // ======================= FEMME : pièces en plus =======================
  p({ id: "f-trench", nom: "Trench court en gabardine", categorie: "piece-en-plus", genre: "f", saisons: ["automne", "ete"], styles: ["classique", "chic-decontracte"], matiere: "Gabardine de coton", coupe: "Court, ceinturé", rayon: "Femme > Manteaux > Trenchs", motsCles: "trench court femme" }),
  p({ id: "f-manteau-long", nom: "Manteau long en laine", categorie: "piece-en-plus", genre: "f", saisons: ["hiver"], styles: ["classique", "minimaliste"], matiere: "Laine mélangée", coupe: "Long, droit", rayon: "Femme > Manteaux", motsCles: "manteau long laine femme" }),
  p({ id: "f-blazer", nom: "Blazer droit", categorie: "piece-en-plus", genre: "f", saisons: ["automne", "ete"], styles: ["classique", "chic-decontracte", "minimaliste"], matiere: "Crêpe ou laine légère", coupe: "Droite, légèrement oversize", rayon: "Femme > Vestes > Blazers", motsCles: "blazer droit femme" }),
  p({ id: "f-veste-tweed", nom: "Veste en tweed", categorie: "piece-en-plus", genre: "f", saisons: ["automne"], styles: ["classique", "chic-decontracte"], matiere: "Tweed", coupe: "Courte", rayon: "Femme > Vestes", motsCles: "veste tweed femme" }),
  p({ id: "f-doudoune", nom: "Doudoune courte", categorie: "piece-en-plus", genre: "f", saisons: ["hiver"], styles: ["streetwear", "minimaliste"], matiere: "Nylon matelassé", coupe: "Courte", rayon: "Femme > Manteaux > Doudounes", motsCles: "doudoune courte femme" }),
  p({ id: "f-foulard", nom: "Foulard en soie ou satin", categorie: "piece-en-plus", genre: "f", saisons: ["ete", "automne"], styles: ["classique", "afro-moderne", "chic-decontracte"], matiere: "Soie ou satin", coupe: "Carré", rayon: "Femme > Accessoires > Foulards", motsCles: "foulard carré satin femme" }),

  // ======================= MIXTE =======================
  p({ id: "m-echarpe", nom: "Écharpe en laine", categorie: "piece-en-plus", genre: "mixte", saisons: ["hiver", "automne"], styles: ["classique", "minimaliste", "chic-decontracte"], matiere: "Laine", coupe: "Longue", rayon: "Accessoires > Écharpes", motsCles: "écharpe laine" }),
  p({ id: "m-bonnet", nom: "Bonnet en maille côtelée", categorie: "piece-en-plus", genre: "mixte", saisons: ["hiver"], styles: ["streetwear", "minimaliste"], matiere: "Maille de laine ou acrylique", coupe: "Revers", rayon: "Accessoires > Bonnets", motsCles: "bonnet maille côtelée" }),
];

// Recherche courte envoyée aux boutiques (type + genre). Les moteurs de recherche des boutiques
// renvoient souvent 0 résultat si on tape trop de détails : testé le 2026-10-22 sur Spartoo.
export const RECHERCHE_COURTE: Record<string, string> = {
  "h-tshirt-col-rond": "tee-shirt homme", "h-chemise-lin": "chemise lin homme", "h-polo-pique": "polo homme",
  "h-chemise-oxford": "chemise oxford homme", "h-chemise-flanelle": "chemise flanelle homme", "h-pull-merinos": "pull merinos homme",
  "h-col-roule": "pull col roulé homme", "h-sweat-capuche": "sweat capuche homme", "h-chemise-wax": "wax",
  "h-tshirt-oversize": "tee-shirt homme", "h-chino": "chino homme", "h-jean-droit": "jean droit homme",
  "h-short-chino": "short chino homme", "h-velours": "pantalon velours homme", "h-cargo": "pantalon cargo homme",
  "h-pantalon-laine": "pantalon homme", "h-baskets-cuir": "baskets cuir homme", "h-chelsea": "bottines chelsea homme",
  "h-derbies": "derbies homme", "h-espadrilles": "espadrilles homme", "h-surchemise": "surchemise homme",
  "h-veste-workwear": "veste workwear homme", "h-manteau-laine": "manteau laine homme", "h-doudoune": "doudoune légère homme",
  "h-blazer": "blazer homme", "f-tshirt-col-v": "tee-shirt femme", "f-chemisier-lavalliere": "chemisier femme",
  "f-blouse-lin": "blouse femme", "f-col-roule": "pull col roulé femme", "f-pull-cachemire": "pull cachemire femme",
  "f-cardigan": "cardigan femme", "f-top-wax": "wax", "f-chemise-oversize": "chemise oversize femme",
  "f-sweat": "sweat femme", "f-robe-chemise": "robe chemise femme", "f-robe-pull": "robe pull femme",
  "f-robe-wax": "wax", "f-jupe-plissee": "jupe plissée femme", "f-pantalon-large": "pantalon large femme",
  "f-jean-droit": "jean droit femme", "f-jupe-jean": "jupe jean femme", "f-pantalon-cargo": "pantalon cargo femme",
  "f-short-lin": "short lin femme", "f-baskets-cuir": "baskets cuir femme", "f-mocassins": "mocassins femme",
  "f-bottines": "bottines talon femme", "f-sandales": "sandales plates femme", "f-trench": "trench femme",
  "f-manteau-long": "manteau long femme", "f-blazer": "blazer femme", "f-veste-tweed": "veste tweed femme",
  "f-doudoune": "doudoune courte femme", "f-foulard": "foulard femme", "m-echarpe": "écharpe laine", "m-bonnet": "bonnet",
};
export const rechercheCourte = (piece: Piece) => RECHERCHE_COURTE[piece.id] ?? piece.motsCles;

// Neutres reconnus dans les palettes : ils servent pour les bas et les chaussures.
const NEUTRES = [
  "Blanc", "Crème", "Ivoire", "Beige", "Camel", "Taupe", "Gris", "Anthracite", "Noir", "Marine", "Chocolat",
  "Brun", "Kaki", "Olive", "Bleu jean", "Bleu marine", "Argent",
];
export const estNeutre = (nom: string) => NEUTRES.some((n) => nom.toLowerCase().includes(n.toLowerCase()));
