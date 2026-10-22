import type { Piece } from "@/data/catalogue";

// Illustration simple d'une pièce, colorée avec la couleur choisie (en attendant de vraies photos).
export function IllustrationPiece({ piece, couleur, taille = 160 }: { piece: Piece; couleur: string; taille?: number }) {
  const ombre = "rgba(20, 11, 6, 0.22)";
  const forme = formePour(piece);
  return (
    <svg width={taille} height={taille} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="190" rx="66" ry="6" fill="rgba(43, 29, 20, 0.12)" />
      <path d={forme.corps} fill={couleur} stroke="rgba(43,29,20,0.18)" strokeWidth="1.2" strokeLinejoin="round" />
      {forme.ombre && <path d={forme.ombre} fill={ombre} />}
      {forme.details?.map((d) => <path key={d} d={d} fill="none" stroke={ombre} strokeWidth="2" strokeLinecap="round" />)}
    </svg>
  );
}

function formePour(piece: Piece): { corps: string; ombre?: string; details?: string[] } {
  const id = piece.id;
  if (id.includes("jupe")) {
    return { corps: "M66 30 L134 30 L168 176 L32 176 Z", ombre: "M100 30 L134 30 L168 176 L100 176 Z", details: ["M66 40 L134 40", "M82 42 L64 174", "M100 42 L100 174", "M118 42 L136 174"] };
  }
  if (id.includes("short")) {
    return { corps: "M52 36 L148 36 L156 132 L108 132 L100 84 L92 132 L44 132 Z", ombre: "M100 36 L148 36 L156 132 L108 132 L100 84 Z", details: ["M52 48 L148 48"] };
  }
  switch (piece.categorie) {
    case "bas":
      return { corps: "M54 18 L146 18 L156 182 L110 182 L100 70 L90 182 L44 182 Z", ombre: "M100 18 L146 18 L156 182 L110 182 L100 70 Z", details: ["M54 32 L146 32", "M100 34 L100 66"] };
    case "chaussures":
      return { corps: "M30 112 Q34 86 62 84 L96 82 Q112 82 122 98 L150 114 Q176 122 176 140 L176 150 L24 150 L24 132 Q24 118 30 112 Z", ombre: "M24 140 L176 140 L176 150 L24 150 Z", details: ["M82 92 L104 108", "M90 88 L112 104"] };
    case "robe":
      return { corps: "M74 18 L126 18 L134 66 L120 78 L158 182 L42 182 L80 78 L66 66 Z", ombre: "M100 18 L126 18 L134 66 L120 78 L158 182 L100 182 Z", details: ["M80 80 L120 80"] };
    case "piece-en-plus":
      if (id.includes("echarpe") || id.includes("foulard")) {
        return { corps: "M60 30 Q100 60 140 30 L148 52 Q100 88 52 52 Z M112 70 L132 70 L128 176 L106 176 Z", ombre: "M120 70 L132 70 L128 176 L118 176 Z" };
      }
      if (id.includes("bonnet")) {
        return { corps: "M50 140 Q48 52 100 48 Q152 52 150 140 Z M44 128 L156 128 L156 160 L44 160 Z", details: ["M70 132 L70 158", "M90 132 L90 158", "M110 132 L110 158", "M130 132 L130 158"] };
      }
      return { corps: "M62 20 L138 20 L176 50 L166 112 L150 110 L150 186 L50 186 L50 110 L34 112 L24 50 Z", ombre: "M100 20 L138 20 L176 50 L166 112 L150 110 L150 186 L100 186 Z", details: ["M100 30 L100 186", "M84 20 L100 60 L116 20"] };
    default:
      return { corps: "M66 22 L134 22 L176 52 L160 86 L144 78 L144 182 L56 182 L56 78 L40 86 L24 52 Z", ombre: "M100 22 L134 22 L176 52 L160 86 L144 78 L144 182 L100 182 Z", details: ["M84 22 Q100 38 116 22"] };
  }
}
