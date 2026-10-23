// Palettes de couleurs de Charmes : 4 profondeurs de teint × 3 sous-tons = 12 palettes.
// Principes (cahier des charges, section 7) :
//  - plus le teint est profond, plus les couleurs franches, saturées et lumineuses le mettent en valeur ;
//  - sur un teint clair, les couleurs douces et nuancées évitent de « durcir » le visage ;
//  - sous-ton chaud → tons dorés, terre, olive, corail ; froid → bleus, prunes, roses, blanc pur ; neutre → un peu des deux ;
//  - une couleur n'est jamais « interdite » : elle se porte loin du visage (pantalon, chaussures, sac).

export type TeintId = "porcelaine" | "ivoire" | "sable" | "miel" | "caramel" | "cannelle" | "cacao" | "ebene";
export type SousTon = "chaud" | "froid" | "neutre";
export type Profondeur = "clair" | "moyen" | "mat" | "profond";

export type Couleur = { nom: string; hex: string };
export type Palette = {
  id: string;
  nom: string;
  profondeur: Profondeur;
  sousTon: SousTon;
  contraste: string;
  phares: Couleur[]; // 12 couleurs conseillées près du visage
  loin: Couleur[]; // 5 couleurs à porter loin du visage
  pourquoi: string;
};

export const TEINTS: { id: TeintId; nom: string; hex: string; clair: string; profondeur: Profondeur }[] = [
  { id: "porcelaine", nom: "Porcelaine", hex: "#F6DCC8", clair: "#FFF1E6", profondeur: "clair" },
  { id: "ivoire", nom: "Ivoire", hex: "#EFCFB6", clair: "#FCE8D8", profondeur: "clair" },
  { id: "sable", nom: "Sable", hex: "#DDAE88", clair: "#F2CDAE", profondeur: "moyen" },
  { id: "miel", nom: "Miel", hex: "#C68A5E", clair: "#E2AA7E", profondeur: "moyen" },
  { id: "caramel", nom: "Caramel", hex: "#A86E44", clair: "#CC8F62", profondeur: "mat" },
  { id: "cannelle", nom: "Cannelle", hex: "#8A5534", clair: "#B07450", profondeur: "mat" },
  { id: "cacao", nom: "Cacao", hex: "#6B3E24", clair: "#96603E", profondeur: "profond" },
  { id: "ebene", nom: "Ébène", hex: "#4A2A18", clair: "#7A4C30", profondeur: "profond" },
];

const CONTRASTE: Record<Profondeur, string> = {
  clair: "Contraste doux",
  moyen: "Contraste moyen",
  mat: "Contraste moyen à marqué",
  profond: "Contraste marqué",
};

// Idée de port pour chaque couleur (affichée quand on touche une pastille).
export const IDEES: Record<string, string> = {
  "Argent": "en bijoux, ceinture ou petite touche métallisée.",
  "Bleu canard": "élégant en pull ou en chemise.",
  "Bleu ciel": "léger en chemise de coton, l’été.",
  "Bleu électrique": "une touche vive en t-shirt ou en accessoire.",
  "Bleu glacier": "frais en chemise ou en maille légère.",
  "Bleu jean": "ton bleu du quotidien, en chemise ou en veste.",
  "Bleu marine": "ton neutre foncé, plus doux que le noir.",
  "Bleu pétrole": "le bleu qui te va, en veste ou en caban.",
  "Bleu roi": "lumineux en chemise, en robe ou en pull.",
  "Bleu sarcelle": "entre le bleu et le vert, superbe en maille.",
  "Bleu ardoise": "ton bleu passe-partout, en jupe ou en veste.",
  "Blanc cassé": "ton blanc à toi, doux et net.",
  "Blanc doux": "ton blanc à toi, net sans être éblouissant.",
  "Blanc pur": "éclatant en chemise ou en t-shirt, près du visage.",
  "Bordeaux": "riche en col roulé ou en chaussures.",
  "Bordeaux chaud": "chaleureux en pull ou en veste, l’hiver.",
  "Brique douce": "une couleur terre douce, en chemise ou en pull.",
  "Brun noisette": "ton neutre foncé, à la place du noir.",
  "Camel": "la base chaude de tes manteaux et pantalons.",
  "Camel clair": "doux en trench, en pull ou en chino.",
  "Camel doux": "un neutre tendre, en manteau ou en maille.",
  "Chocolat": "ton neutre foncé, à la place du noir.",
  "Chocolat au lait": "un neutre chaud et doux, en pantalon ou en veste.",
  "Corail": "pétillant en t-shirt ou en accessoire.",
  "Corail doux": "lumineux près du visage, en haut ou en écharpe.",
  "Corail rosé": "frais et gai en t-shirt ou en chemisier.",
  "Corail vif": "éclatant en haut, l’été.",
  "Crème": "ton blanc à toi, plus doux que le blanc pur.",
  "Doré miel": "une touche lumineuse en pull ou en accessoire.",
  "Émeraude": "un vert profond qui fait ressortir ton teint.",
  "Framboise": "une touche vive en haut ou en écharpe.",
  "Framboise douce": "gai et doux, en pull ou en chemisier.",
  "Gris anthracite": "la base de tes pantalons et blazers.",
  "Gris bleuté": "élégant en manteau ou en maille.",
  "Gris perle": "doux et lumineux en maille fine.",
  "Jade": "un vert frais et doux, en chemise ou en pull.",
  "Jaune citron": "une touche de soleil en t-shirt ou en accessoire.",
  "Kaki clair": "un neutre doux pour les vestes et pantalons.",
  "Lavande": "fraîche en maille légère, au printemps.",
  "Marine": "ton neutre foncé, plus doux que le noir.",
  "Moutarde": "une touche lumineuse en pull ou en écharpe.",
  "Moutarde douce": "chaleureuse en maille ou en accessoire.",
  "Noir profond": "net et graphique, en veste ou en pantalon.",
  "Or": "en bijoux, boutons ou petite touche dans un imprimé.",
  "Orange": "énergique en haut ou en imprimé.",
  "Orange brûlé": "chaleureux en chemise ou en pull, l’automne.",
  "Pêche": "doux et lumineux en t-shirt ou en chemisier.",
  "Prune": "profonde et douce en pull ou en robe.",
  "Prune douce": "élégante en maille ou en chemise.",
  "Rose ancien": "doux et chic en pull ou en chemise.",
  "Rose framboise": "gai en haut ou en accessoire.",
  "Rose poudré": "lumineux en chemisier, près du visage.",
  "Rose vif": "éclatant en haut ou en robe, l’été.",
  "Rouge cerise": "un rouge net qui illumine, en haut ou en accessoire.",
  "Rouge rubis": "intense en pull, en robe ou en écharpe.",
  "Rouge": "franc et lumineux, en haut ou en accessoire.",
  "Rouille": "chaleureuse en surchemise ou en velours.",
  "Taupe": "un neutre doux, à la place du gris.",
  "Terracotta": "parfaite en chemise ou en pull, près du visage.",
  "Turquoise": "frais et vivant en t-shirt ou en chemise.",
  "Turquoise doux": "léger en chemise ou en maille d’été.",
  "Turquoise vif": "éclatant en haut, l’été.",
  "Vert d’eau": "frais et doux en chemise ou en maille.",
  "Vert forêt": "profond et élégant, en chemise ou en maille.",
  "Vert jade": "un vert vivant qui illumine, en haut ou en robe.",
  "Vert olive": "un neutre doux pour les vestes et pantalons.",
  "Vert sapin": "profond et chic, en manteau ou en pull.",
  "Vert sauge": "léger et frais en lin, l’été.",
  "Violet": "intense et élégant, en pull ou en robe.",
  "Violet améthyste": "lumineux en maille ou en chemise.",
};

const c = (nom: string, hex: string): Couleur => ({ nom, hex });

export const PALETTES: Palette[] = [
  // ---------- Teints clairs : couleurs douces, contraste léger ----------
  {
    id: "clair-chaud",
    nom: "Pêche dorée",
    profondeur: "clair",
    sousTon: "chaud",
    contraste: CONTRASTE.clair,
    phares: [
      c("Corail doux", "#F08A6C"), c("Pêche", "#F4B183"), c("Camel clair", "#D2A679"), c("Vert sauge", "#9CAF88"),
      c("Turquoise doux", "#5FB3A9"), c("Crème", "#F5ECD7"), c("Doré miel", "#D9A441"), c("Brique douce", "#C0654A"),
      c("Kaki clair", "#A8A47A"), c("Bleu canard", "#2E7D7A"), c("Brun noisette", "#8B5E3C"), c("Blanc cassé", "#FAF3E3"),
    ],
    loin: [c("Noir profond", "#151515"), c("Gris anthracite", "#3A3D42"), c("Fuchsia", "#D63384"), c("Blanc optique", "#FFFFFF"), c("Bleu glacier", "#CFE3EC")],
    pourquoi:
      "Ton teint clair aux reflets dorés s’illumine avec des couleurs chaudes et douces : pêche, corail, camel, verts tendres. Les couleurs très sombres ou très froides créent un contraste trop dur près de ton visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "clair-froid",
    nom: "Brume rosée",
    profondeur: "clair",
    sousTon: "froid",
    contraste: CONTRASTE.clair,
    phares: [
      c("Prune", "#6B3A5B"), c("Rose poudré", "#D9A5B3"), c("Framboise", "#A8325E"), c("Lavande", "#9C8CC4"),
      c("Bleu ardoise", "#4F6D8A"), c("Bleu marine", "#22324D"), c("Bleu ciel", "#9DB8D2"), c("Gris bleuté", "#8C99A6"),
      c("Gris anthracite", "#3A3D42"), c("Émeraude", "#1F6E5A"), c("Bordeaux", "#6A1F3A"), c("Blanc doux", "#F4F4F2"),
    ],
    loin: [c("Orange vif", "#E8772E"), c("Moutarde", "#D4A235"), c("Camel", "#C19A6B"), c("Beige sable", "#E3CBA4"), c("Kaki", "#7A7346")],
    pourquoi:
      "Ton sous-ton froid et ton teint clair s’illuminent avec des couleurs fraîches et nuancées : bleus, prunes, roses et gris bleutés. Les tons dorés et les beiges proches de ta peau ont tendance à l’éteindre près du visage : garde-les pour le bas de la tenue ou les accessoires.",
  },
  {
    id: "clair-neutre",
    nom: "Lin et lavande",
    profondeur: "clair",
    sousTon: "neutre",
    contraste: CONTRASTE.clair,
    phares: [
      c("Rose poudré", "#D9A5B3"), c("Bleu jean", "#5B7FA6"), c("Vert d’eau", "#A7C7B7"), c("Taupe", "#8B7D74"),
      c("Lavande", "#A99BCB"), c("Marine", "#2F4566"), c("Blanc cassé", "#F4F1EA"), c("Jade", "#4E9C86"),
      c("Framboise douce", "#B24B6B"), c("Gris perle", "#BFC3C8"), c("Corail rosé", "#E88A7D"), c("Bordeaux", "#6E2233"),
    ],
    loin: [c("Orange vif", "#E8772E"), c("Jaune citron", "#E6D02B"), c("Noir profond", "#111111"), c("Beige peau", "#E6CBB0"), c("Kaki terne", "#7A7346")],
    pourquoi:
      "Ton teint clair et neutre accepte les tons chauds comme froids, à condition qu’ils restent doux : roses poudrés, bleus jean, verts tendres, taupe. Les couleurs trop vives ou trop proches de ta peau fatiguent le visage : garde-les loin du visage.",
  },

  // ---------- Teints moyens (sable, miel) ----------
  {
    id: "moyen-chaud",
    nom: "Miel épicé",
    profondeur: "moyen",
    sousTon: "chaud",
    contraste: CONTRASTE.moyen,
    phares: [
      c("Terracotta", "#C2603D"), c("Moutarde", "#D4A235"), c("Vert olive", "#6B7A3A"), c("Corail", "#E07856"),
      c("Camel", "#C19A6B"), c("Bleu pétrole", "#1F5C6B"), c("Crème", "#F3E6CF"), c("Rouille", "#A0482B"),
      c("Vert forêt", "#2F5D45"), c("Turquoise", "#2A9D8F"), c("Chocolat au lait", "#7B4B2A"), c("Pêche", "#F2A27E"),
    ],
    loin: [c("Gris perle", "#C9CBCF"), c("Rose layette", "#F4C9D6"), c("Noir profond", "#111111"), c("Bleu glacier", "#CFE3EC"), c("Blanc optique", "#FFFFFF")],
    pourquoi:
      "Ton teint doré s’illumine avec des couleurs épicées et chaleureuses : terracotta, moutarde, olive, pétrole. Les pastels froids et le noir intense lui donnent un air terne près du visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "moyen-froid",
    nom: "Baie et ardoise",
    profondeur: "moyen",
    sousTon: "froid",
    contraste: CONTRASTE.moyen,
    phares: [
      c("Bleu roi", "#2F57A8"), c("Prune", "#6B3A5B"), c("Framboise", "#C2306E"), c("Émeraude", "#1F6E5A"),
      c("Marine", "#22324D"), c("Gris anthracite", "#3A3D42"), c("Blanc pur", "#FFFFFF"), c("Lavande", "#9C8CC4"),
      c("Rouge cerise", "#B3203A"), c("Bleu glacier", "#BFD7E6"), c("Rose framboise", "#D2557A"), c("Gris bleuté", "#8C99A6"),
    ],
    loin: [c("Orange vif", "#E8772E"), c("Moutarde", "#D4A235"), c("Camel", "#C19A6B"), c("Kaki", "#7A7346"), c("Beige doré", "#D8BC8A")],
    pourquoi:
      "Ton sous-ton froid ressort avec des couleurs fraîches et franches : bleu roi, prune, framboise, émeraude, blanc pur. Les tons dorés et orangés tirent ton teint vers le jaune près du visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "moyen-neutre",
    nom: "Terre et océan",
    profondeur: "moyen",
    sousTon: "neutre",
    contraste: CONTRASTE.moyen,
    phares: [
      c("Bleu sarcelle", "#2A7F86"), c("Rose ancien", "#C77D86"), c("Vert sapin", "#2E5E4E"), c("Marine", "#24344F"),
      c("Taupe", "#8B7D74"), c("Corail doux", "#E58C74"), c("Blanc cassé", "#F4F1EA"), c("Bordeaux", "#6E2233"),
      c("Vert jade", "#4E9C86"), c("Bleu jean", "#5B7FA6"), c("Prune douce", "#7E4A6A"), c("Camel doux", "#C7A27A"),
    ],
    loin: [c("Jaune fluo", "#E8E337"), c("Orange vif", "#E8772E"), c("Gris très clair", "#E3E4E6"), c("Beige peau", "#DDB894"), c("Noir profond", "#111111")],
    pourquoi:
      "Ton teint neutre profite des deux familles : bleus profonds, verts sapin, roses anciens, camel. Évite seulement les couleurs extrêmes (fluo, très pâles ou très proches de ta peau) près du visage.",
  },

  // ---------- Teints mats (caramel, cannelle) ----------
  {
    id: "mat-chaud",
    nom: "Épices et or",
    profondeur: "mat",
    sousTon: "chaud",
    contraste: CONTRASTE.mat,
    phares: [
      c("Moutarde", "#D4A235"), c("Orange brûlé", "#CC5A2A"), c("Vert olive", "#6B7A3A"), c("Terracotta", "#C2603D"),
      c("Bleu pétrole", "#1F5C6B"), c("Crème", "#F3E6CF"), c("Turquoise", "#2A9D8F"), c("Rouille", "#A0482B"),
      c("Or", "#C9A24B"), c("Vert forêt", "#2F5D45"), c("Corail", "#E07856"), c("Bordeaux chaud", "#7A2631"),
    ],
    loin: [c("Gris perle", "#C9CBCF"), c("Rose layette", "#F4C9D6"), c("Lilas pâle", "#CDBEDD"), c("Beige caramel", "#B8865A"), c("Kaki terne", "#7A7346")],
    pourquoi:
      "Ton teint mat et chaud s’illumine avec des couleurs riches et épicées : moutarde, orange brûlé, pétrole, or. Les pastels froids et les beiges proches de ta peau créent moins d’éclat près du visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "mat-froid",
    nom: "Joyaux",
    profondeur: "mat",
    sousTon: "froid",
    contraste: CONTRASTE.mat,
    phares: [
      c("Framboise", "#C2306E"), c("Bleu roi", "#2F57A8"), c("Émeraude", "#1F7A5C"), c("Violet", "#5B3A8C"),
      c("Blanc pur", "#FFFFFF"), c("Rouge rubis", "#A3152E"), c("Turquoise vif", "#1E9AA5"), c("Marine", "#22324D"),
      c("Rose vif", "#E0568A"), c("Gris anthracite", "#3A3D42"), c("Lavande", "#9C8CC4"), c("Prune", "#6B3A5B"),
    ],
    loin: [c("Beige", "#D8C3A5"), c("Kaki", "#7A7346"), c("Orange terne", "#C9783E"), c("Brun moyen", "#8A5A3A"), c("Jaune pâle", "#F2E6A8")],
    pourquoi:
      "Ton teint mat au sous-ton froid brille avec les couleurs « joyaux » : framboise, bleu roi, émeraude, violet, blanc pur. Les beiges, kakis et bruns proches de ta peau l’affadissent près du visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "mat-neutre",
    nom: "Velours",
    profondeur: "mat",
    sousTon: "neutre",
    contraste: CONTRASTE.mat,
    phares: [
      c("Émeraude", "#1F6E5A"), c("Bordeaux", "#6E2233"), c("Bleu canard", "#1F6F78"), c("Corail", "#E07856"),
      c("Marine", "#22324D"), c("Prune", "#6B3A5B"), c("Moutarde douce", "#C99A3A"), c("Blanc cassé", "#F4F1EA"),
      c("Rose framboise", "#C2486E"), c("Bleu jean", "#4F6F9A"), c("Vert olive", "#6B7A3A"), c("Camel", "#C19A6B"),
    ],
    loin: [c("Beige caramel", "#B8865A"), c("Gris clair", "#D3D5D8"), c("Jaune pâle", "#F2E6A8"), c("Brun cannelle", "#8A5534"), c("Kaki terne", "#7A7346")],
    pourquoi:
      "Ton teint mat et neutre porte bien les couleurs profondes et veloutées : émeraude, bordeaux, canard, prune, corail. Les tons trop pâles ou trop proches de ta peau le rendent moins lumineux près du visage.",
  },

  // ---------- Teints profonds (cacao, ébène) : couleurs franches, contraste marqué ----------
  {
    id: "profond-chaud",
    nom: "Terre lumineuse",
    profondeur: "profond",
    sousTon: "chaud",
    contraste: CONTRASTE.profond,
    phares: [
      c("Terracotta", "#C2603D"), c("Camel", "#C19A6B"), c("Moutarde", "#D4A235"), c("Vert olive", "#6B7A3A"),
      c("Vert sauge", "#7A8B6F"), c("Vert forêt", "#2F5D45"), c("Rouille", "#A0482B"), c("Bordeaux", "#6E2233"),
      c("Crème", "#F3E6CF"), c("Chocolat", "#5A3A26"), c("Bleu pétrole", "#1F5C6B"), c("Corail", "#E07856"),
    ],
    loin: [c("Gris perle", "#C9CBCF"), c("Rose layette", "#F4C9D6"), c("Lilas pâle", "#CDBEDD"), c("Bleu glacier", "#CFE3EC"), c("Blanc optique", "#FFFFFF")],
    pourquoi:
      "Ton sous-ton chaud et ton teint profond s’illuminent avec des couleurs riches et chaleureuses : terre, épices, verts profonds. Les tons très pâles et froids créent moins d’éclat près du visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "profond-froid",
    nom: "Nuit et éclat",
    profondeur: "profond",
    sousTon: "froid",
    contraste: CONTRASTE.profond,
    phares: [
      c("Blanc pur", "#FFFFFF"), c("Framboise", "#D02F7A"), c("Bleu roi", "#2546B0"), c("Émeraude", "#12805C"),
      c("Rouge cerise", "#C21E3A"), c("Violet améthyste", "#6A3FA0"), c("Turquoise vif", "#13A3B0"), c("Jaune citron", "#F2D22E"),
      c("Rose vif", "#EC5A96"), c("Bleu électrique", "#2F7BEA"), c("Argent", "#C0C6CC"), c("Noir profond", "#121212"),
    ],
    loin: [c("Brun chocolat", "#5A3A26"), c("Beige", "#D8C3A5"), c("Kaki", "#7A7346"), c("Orange terne", "#C9783E"), c("Gris taupe", "#8B7D74")],
    pourquoi:
      "Ton teint profond au sous-ton froid est fait pour le contraste : blanc pur, couleurs vives et franches, bleus et roses éclatants. Les bruns, beiges et kakis proches de ta peau ou trop ternes l’éteignent près du visage : garde-les pour le bas de la tenue.",
  },
  {
    id: "profond-neutre",
    nom: "Ébène et jade",
    profondeur: "profond",
    sousTon: "neutre",
    contraste: CONTRASTE.profond,
    phares: [
      c("Vert jade", "#1F8A70"), c("Corail vif", "#F06A4F"), c("Bleu roi", "#2F57A8"), c("Moutarde", "#D4A235"),
      c("Blanc cassé", "#F4F1EA"), c("Framboise", "#C2306E"), c("Turquoise", "#2A9D8F"), c("Rouge", "#B3203A"),
      c("Orange", "#E8772E"), c("Violet", "#5B3A8C"), c("Or", "#C9A24B"), c("Marine", "#22324D"),
    ],
    loin: [c("Brun chocolat", "#5A3A26"), c("Gris souris", "#8C8C8C"), c("Beige terne", "#CDB79E"), c("Kaki terne", "#7A7346"), c("Mauve grisé", "#A08C9A")],
    pourquoi:
      "Ton teint profond et neutre peut tout oser, des couleurs chaudes aux froides, du moment qu’elles sont franches : jade, corail, bleu roi, moutarde, framboise. Seules les couleurs ternes ou proches de ta peau lui font perdre son éclat près du visage.",
  },
];

export function paletteFor(teint: TeintId, sousTon: SousTon): Palette {
  const profondeur = TEINTS.find((t) => t.id === teint)?.profondeur ?? "moyen";
  return PALETTES.find((p) => p.profondeur === profondeur && p.sousTon === sousTon) ?? PALETTES[0];
}

export function ideePour(nom: string): string {
  return IDEES[nom] ?? "à porter près du visage, en haut ou en accessoire.";
}
