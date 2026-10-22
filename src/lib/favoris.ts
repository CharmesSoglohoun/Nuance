import type { Saison } from "@/data/catalogue";
import type { Tenue } from "./tenues";

// Tenues aimées, gardées sur le téléphone (la synchronisation avec le compte viendra ensuite).
export type TenueAimee = { id: string; saison: Saison; pieces: { pieceId: string; couleur: string }[]; date: string };

const CLE = "nuance:tenues-aimees";

export function lireTenuesAimees(): TenueAimee[] {
  try {
    return JSON.parse(window.localStorage.getItem(CLE) ?? "[]") as TenueAimee[];
  } catch {
    return [];
  }
}

export const signature = (tenue: Tenue) => tenue.elements.map((e) => `${e.piece.id}:${e.couleur.nom}`).join("|");

export function basculerTenueAimee(tenue: Tenue): boolean {
  const liste = lireTenuesAimees();
  const id = signature(tenue);
  const existe = liste.some((t) => t.id === id);
  const nouvelle = existe
    ? liste.filter((t) => t.id !== id)
    : [{ id, saison: tenue.saison, pieces: tenue.elements.map((e) => ({ pieceId: e.piece.id, couleur: e.couleur.nom })), date: new Date().toISOString() }, ...liste];
  try {
    window.localStorage.setItem(CLE, JSON.stringify(nouvelle));
  } catch {
    // Stockage indisponible : on ignore.
  }
  return !existe;
}

export const estAimee = (tenue: Tenue) => lireTenuesAimees().some((t) => t.id === signature(tenue));
