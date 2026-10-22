import { SAISONS, type Saison } from "@/data/catalogue";
import { createClient } from "@/lib/supabase/client";
import type { Tenue } from "./tenues";

// Favoris de Nuance (tenues aimées et pièces favorites).
// Le téléphone garde toujours une copie (localStorage) : ça marche sans compte et sans réseau.
// Si la personne est connectée, chaque changement est aussi enregistré dans son compte (Supabase, RLS),
// et synchroniser() fusionne les deux au chargement.

export type PieceTenue = { pieceId: string; couleur: string; hex: string };
export type TenueAimee = { id: string; saison: Saison; pieces: PieceTenue[]; date: string };
export type PieceAimee = { pieceId: string; couleur: string; hex: string; date: string };

const CLE_TENUES = "nuance:tenues-aimees";
const CLE_PIECES = "nuance:pieces-aimees";

function lire<T>(cle: string): T[] {
  try {
    return JSON.parse(window.localStorage.getItem(cle) ?? "[]") as T[];
  } catch {
    return [];
  }
}
function ecrire<T>(cle: string, valeur: T[]) {
  try {
    window.localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    // Stockage indisponible (navigation privée) : on ignore.
  }
}

export const lireTenuesAimees = () => lire<TenueAimee>(CLE_TENUES);
export const lirePiecesAimees = () => lire<PieceAimee>(CLE_PIECES);

export const signature = (tenue: Tenue) => tenue.elements.map((e) => `${e.piece.id}:${e.couleur.nom}`).join("|");
export const estAimee = (tenue: Tenue) => lireTenuesAimees().some((t) => t.id === signature(tenue));
export const estPieceAimee = (pieceId: string) => lirePiecesAimees().some((p) => p.pieceId === pieceId);

async function utilisateur() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { supabase, id: data.user.id } : null;
}

// ---------- Tenues ----------
export function basculerTenueAimee(tenue: Tenue): boolean {
  const liste = lireTenuesAimees();
  const id = signature(tenue);
  const existe = liste.some((t) => t.id === id);
  const aimee: TenueAimee = {
    id,
    saison: tenue.saison,
    pieces: tenue.elements.map((e) => ({ pieceId: e.piece.id, couleur: e.couleur.nom, hex: e.couleur.hex })),
    date: new Date().toISOString(),
  };
  ecrire(CLE_TENUES, existe ? liste.filter((t) => t.id !== id) : [aimee, ...liste]);
  void enregistrerTenue(aimee, !existe);
  return !existe;
}

export function retirerTenue(id: string) {
  const t = lireTenuesAimees().find((x) => x.id === id);
  ecrire(CLE_TENUES, lireTenuesAimees().filter((x) => x.id !== id));
  if (t) void enregistrerTenue(t, false);
}

async function enregistrerTenue(t: TenueAimee, ajouter: boolean) {
  const u = await utilisateur();
  if (!u) return;
  if (ajouter) {
    await u.supabase.from("outfits").upsert(
      { user_id: u.id, nom: `Tenue ${SAISONS[t.saison].toLowerCase()}`, saison: t.saison, pieces: t.pieces, signature: t.id },
      { onConflict: "user_id,signature" },
    );
  } else {
    await u.supabase.from("outfits").delete().eq("user_id", u.id).eq("signature", t.id);
  }
}

// ---------- Pièces ----------
export function basculerPieceAimee(pieceId: string, couleur: { nom: string; hex: string }): boolean {
  const liste = lirePiecesAimees();
  const existe = liste.some((p) => p.pieceId === pieceId);
  const aimee: PieceAimee = { pieceId, couleur: couleur.nom, hex: couleur.hex, date: new Date().toISOString() };
  ecrire(CLE_PIECES, existe ? liste.filter((p) => p.pieceId !== pieceId) : [aimee, ...liste]);
  void enregistrerPiece(aimee, !existe);
  return !existe;
}

async function enregistrerPiece(p: PieceAimee, ajouter: boolean) {
  const u = await utilisateur();
  if (!u) return;
  if (ajouter) {
    await u.supabase
      .from("favorite_products")
      .upsert({ user_id: u.id, product_id: p.pieceId, couleur: p.couleur, couleur_hex: p.hex }, { onConflict: "user_id,product_id" });
  } else {
    await u.supabase.from("favorite_products").delete().eq("user_id", u.id).eq("product_id", p.pieceId);
  }
}

// ---------- Synchronisation au chargement ----------
// Fusionne le téléphone et le compte : ce qui n'existe que sur le téléphone est envoyé dans le compte,
// ce qui n'existe que dans le compte (autre appareil) est copié sur le téléphone.
export async function synchroniser(): Promise<"compte" | "telephone"> {
  const u = await utilisateur();
  if (!u) return "telephone";

  const [{ data: tenues }, { data: pieces }] = await Promise.all([
    u.supabase.from("outfits").select("saison, pieces, signature, created_at"),
    u.supabase.from("favorite_products").select("product_id, couleur, couleur_hex, created_at"),
  ]);

  const localesT = lireTenuesAimees();
  const distantesT: TenueAimee[] = (tenues ?? []).map((t) => ({ id: t.signature, saison: t.saison, pieces: t.pieces, date: t.created_at }));
  for (const t of localesT) if (!distantesT.some((d) => d.id === t.id)) await enregistrerTenue(t, true);
  ecrire(CLE_TENUES, fusion(localesT, distantesT, (t) => t.id));

  const localesP = lirePiecesAimees();
  const distantesP: PieceAimee[] = (pieces ?? []).map((p) => ({ pieceId: p.product_id, couleur: p.couleur ?? "", hex: p.couleur_hex ?? "#C9A24B", date: p.created_at }));
  for (const p of localesP) if (!distantesP.some((d) => d.pieceId === p.pieceId)) await enregistrerPiece(p, true);
  ecrire(CLE_PIECES, fusion(localesP, distantesP, (p) => p.pieceId));

  return "compte";
}

function fusion<T extends { date: string }>(a: T[], b: T[], cle: (x: T) => string): T[] {
  const parCle = new Map<string, T>();
  [...b, ...a].forEach((x) => parCle.set(cle(x), x));
  return [...parCle.values()].sort((x, y) => y.date.localeCompare(x.date));
}
