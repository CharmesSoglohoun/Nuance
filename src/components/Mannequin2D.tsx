// Mannequin stylisé en SVG, repris du prototype Claude Design (composant « Mannequin »).
// Il sert d'aperçu en attendant le vrai mannequin 3D (phase 4), et de plan B si la 3D bloque.

export type Look = {
  g?: "h" | "f";
  skin?: string;
  hair?: string;
  hairStyle?: "court" | "raie" | "afro" | "chignon";
  top?: string;
  sleeve?: "long" | "court" | "aucune";
  col?: "" | "roule";
  bottom?: string;
  bottomType?: "pantalon" | "jupe" | "short";
  shoes?: string;
  outer?: string;
  outerLen?: "court" | "long";
  mid?: string;
  scarf?: string;
  hat?: string;
};

type Body = {
  head: { cx: number; cy: number; rx: number; ry: number };
  neck: string;
  arm: string;
  sleeveLong: string;
  sleeveShort: string;
  torso: string;
  legs: string;
  pantalon: string;
  short: string;
  jupe: string;
  shoe: string;
  outerCourt: string;
  outerLong: string;
  outerSleeve: string;
  midPanel: string;
  col: string;
  scarf: string;
  scarfEnd: string;
  hatCrown: string;
  brim: { cy: number; rx: number; ry: number };
};

const BODIES: Record<"h" | "f", Body> = {
  h: {
    head: { cx: 100, cy: 46, rx: 21, ry: 26 },
    neck: "M90 64 L110 64 L111 92 Q100 97 89 92 Z",
    arm: "M60 96 Q46 100 44 126 L38 204 Q38 218 46 218 Q54 218 53 206 L62 132 Z",
    sleeveLong: "M60 93 Q45 97 43 126 L37 196 L55 198 L62 132 Z",
    sleeveShort: "M60 93 Q46 97 44 124 L42 142 L60 144 L62 130 Z",
    torso: "M60 92 Q100 82 140 92 L136 206 Q100 212 64 206 Z",
    legs: "M68 200 L132 200 L130 382 L108 382 L100 250 L92 382 L70 382 Z",
    pantalon: "M63 198 L137 198 L135 384 L107 384 L100 248 L93 384 L65 384 Z",
    short: "M63 198 L137 198 L136 270 L106 270 L100 244 L94 270 L64 270 Z",
    jupe: "M63 198 L137 198 L135 384 L107 384 L100 248 L93 384 L65 384 Z",
    shoe: "M64 380 L94 380 Q96 390 96 398 L56 398 Q56 386 64 380 Z",
    outerCourt: "M56 90 Q78 84 95 94 L93 222 L59 222 Z",
    outerLong: "M55 90 Q78 84 95 94 L95 306 L52 306 Z",
    outerSleeve: "M56 90 Q41 96 39 124 L33 200 L53 202 L62 130 Z",
    midPanel: "M58 92 Q80 86 97 95 L96 214 L61 214 Z",
    col: "M88 80 L112 80 L113 96 Q100 101 87 96 Z",
    scarf: "M83 84 Q100 100 117 84 L119 97 Q100 113 81 97 Z",
    scarfEnd: "M104 100 L115 100 L113 156 L102 156 Z",
    hatCrown: "M80 24 Q82 4 100 4 Q118 4 120 24 Z",
    brim: { cy: 24, rx: 32, ry: 6 },
  },
  f: {
    head: { cx: 100, cy: 48, rx: 19, ry: 24 },
    neck: "M92 66 L108 66 L109 94 Q100 98 91 94 Z",
    arm: "M68 98 Q56 102 54 124 L48 198 Q48 212 55 212 Q62 212 61 200 L70 132 Z",
    sleeveLong: "M68 95 Q55 99 53 124 L47 190 L63 192 L70 132 Z",
    sleeveShort: "M68 95 Q56 99 54 122 L52 138 L68 140 L70 130 Z",
    torso: "M66 94 Q100 86 134 94 Q127 128 122 162 L78 162 Q73 128 66 94 Z",
    legs: "M77 196 L123 196 L121 382 L106 382 L100 262 L94 382 L79 382 Z",
    pantalon:
      "M79 158 L121 158 Q139 186 139 214 L141 384 L106 384 L100 248 L94 384 L59 384 L61 214 Q61 186 79 158 Z",
    jupe: "M79 158 L121 158 Q133 192 147 320 L53 320 Q67 192 79 158 Z",
    short:
      "M79 158 L121 158 Q137 186 138 214 L138 262 L104 262 L100 232 L96 262 L62 262 L62 214 Q63 186 79 158 Z",
    shoe: "M76 380 L96 380 Q97 390 97 397 L65 397 Q65 386 76 380 Z",
    outerCourt: "M64 92 Q82 86 96 96 L95 218 L60 218 Z",
    outerLong: "M63 92 Q82 86 96 96 L96 310 L52 310 Z",
    outerSleeve: "M64 92 Q51 98 49 124 L43 192 L62 194 L70 130 Z",
    midPanel: "M66 94 Q84 88 97.5 97 L97 206 L64 206 Z",
    col: "M90 82 L110 82 L111 98 Q100 103 89 98 Z",
    scarf: "M85 86 Q100 101 115 86 L117 99 Q100 114 83 99 Z",
    scarfEnd: "M103 102 L113 102 L111 154 L101 154 Z",
    hatCrown: "M82 28 Q84 9 100 9 Q116 9 118 28 Z",
    brim: { cy: 28, rx: 30, ry: 5.5 },
  },
};

const HAIR = {
  court: { top: "M79 40 Q79 18 100 17 Q121 18 121 40 Q113 29 100 29 Q87 29 79 40 Z", back: { cx: 100, cy: 40, r: 0 } },
  raie: { top: "M79 44 Q77 16 102 15 Q125 17 122 44 Q119 28 105 29 Q95 23 87 31 Q81 36 79 44 Z", back: { cx: 100, cy: 40, r: 0 } },
  afro: { top: "M81 44 Q80 22 100 22 Q120 22 119 44 Q110 32 100 32 Q90 32 81 44 Z", back: { cx: 100, cy: 44, r: 33 } },
  chignon: { top: "M81 46 Q80 23 100 23 Q120 23 119 46 Q111 33 100 33 Q89 33 81 46 Z", back: { cx: 100, cy: 22, r: 12 } },
};

const DEFAULT_LOOK: Required<Look> = {
  g: "h",
  skin: "#6B3E24",
  hair: "#1E140E",
  hairStyle: "court",
  top: "#2F5D45",
  sleeve: "long",
  col: "",
  bottom: "#C19A6B",
  bottomType: "pantalon",
  shoes: "#8A4B26",
  outer: "none",
  outerLen: "court",
  mid: "none",
  scarf: "none",
  hat: "none",
};

const LAYERS = ["skin", "hair", "top", "bottom", "shoes", "outer", "mid", "scarf", "hat"] as const;
type Layer = (typeof LAYERS)[number];

// Symétrie gauche / droite : on reflète les abscisses autour de l'axe x = 100.
const mirror = (d: string) =>
  d ? d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${200 - parseFloat(x)} ${y}`) : "";

const rgb = (hex: string) => {
  const s = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.substring(i, i + 2), 16));
};

const mix = (a: string, b: string, t: number) => {
  const A = rgb(a);
  const B = rgb(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

// Identifiant stable dérivé de la tenue, pour que les dégradés SVG ne se mélangent pas
// quand plusieurs mannequins sont affichés sur la même page.
const hashLook = (look: Look) => {
  const s = JSON.stringify(look);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return "mq" + (h >>> 0).toString(36);
};

type Props = { look?: Look; width?: number; height?: number; uid?: string };

export function Mannequin2D({ look: input = {}, width = 200, height = 420, uid }: Props) {
  const look = { ...DEFAULT_LOOK, ...input };
  const id = uid ?? hashLook(look);
  const B = BODIES[look.g];
  const H = HAIR[look.hairStyle] ?? HAIR.court;
  const has = (k: Layer) => Boolean(look[k]) && look[k] !== "none";

  // Chaque couche a un dégradé clair → base → ombre, la peau reçoit un reflet chaud pour rester lumineuse.
  const shades = (k: Layer) => {
    const base = look[k];
    const skin = k === "skin";
    return {
      l: mix(base, skin ? "#FFE6CC" : "#FFFFFF", skin ? 0.22 : 0.16),
      b: base,
      d: mix(base, "#140B06", 0.3),
    };
  };
  const fill = (k: Layer) => (has(k) ? `url(#${id}-${k})` : "none");

  const sleeve = look.sleeve === "long" ? B.sleeveLong : look.sleeve === "court" ? B.sleeveShort : "";
  const outerPanel = has("outer") ? (look.outerLen === "long" ? B.outerLong : B.outerCourt) : "";
  const outerSleeve = has("outer") ? B.outerSleeve : "";
  const midPanel = has("mid") ? B.midPanel : "";
  const bottom = B[look.bottomType] ?? B.pantalon;

  return (
    <svg
      viewBox="0 0 200 420"
      width={width}
      height={height}
      aria-hidden="true"
      style={{ display: "block", overflow: "visible", flexShrink: 0 }}
    >
      <defs>
        {LAYERS.filter(has).map((k) => {
          const c = shades(k);
          return (
            <linearGradient key={k} id={`${id}-${k}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={c.l} />
              <stop offset="0.45" stopColor={c.b} />
              <stop offset="1" stopColor={c.d} />
            </linearGradient>
          );
        })}
      </defs>
      <ellipse cx="100" cy="402" rx="60" ry="8" fill="rgba(43, 29, 20, 0.16)" />
      <g stroke="rgba(43, 29, 20, 0.18)" strokeWidth="0.8" strokeLinejoin="round">
        {H.back.r > 0 && <circle cx={H.back.cx} cy={H.back.cy} r={H.back.r} fill={fill("hair")} />}
        <path d={B.legs} fill={fill("skin")} />
        <path d={B.arm} fill={fill("skin")} />
        <path d={mirror(B.arm)} fill={fill("skin")} />
        <path d={bottom} fill={fill("bottom")} />
        <path d={B.shoe} fill={fill("shoes")} />
        <path d={mirror(B.shoe)} fill={fill("shoes")} />
        <path d={B.neck} fill={fill("skin")} />
        <path d={B.torso} fill={fill("top")} />
        {sleeve && <path d={sleeve} fill={fill("top")} />}
        {sleeve && <path d={mirror(sleeve)} fill={fill("top")} />}
        {look.col === "roule" && <path d={B.col} fill={fill("top")} />}
        <ellipse cx={B.head.cx} cy={B.head.cy} rx={B.head.rx} ry={B.head.ry} fill={fill("skin")} />
        {midPanel && <path d={midPanel} fill={fill("mid")} />}
        {midPanel && <path d={mirror(midPanel)} fill={fill("mid")} />}
        {outerPanel && <path d={outerPanel} fill={fill("outer")} />}
        {outerPanel && <path d={mirror(outerPanel)} fill={fill("outer")} />}
        {outerSleeve && <path d={outerSleeve} fill={fill("outer")} />}
        {outerSleeve && <path d={mirror(outerSleeve)} fill={fill("outer")} />}
        {has("scarf") && <path d={B.scarf} fill={fill("scarf")} />}
        {has("scarf") && <path d={B.scarfEnd} fill={fill("scarf")} />}
        <path d={H.top} fill={fill("hair")} />
        {has("hat") && <ellipse cx="100" cy={B.brim.cy} rx={B.brim.rx} ry={B.brim.ry} fill={fill("hat")} />}
        {has("hat") && <path d={B.hatCrown} fill={fill("hat")} />}
      </g>
    </svg>
  );
}
