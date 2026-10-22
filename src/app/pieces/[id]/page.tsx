import { notFound } from "next/navigation";
import { PIECES } from "@/data/catalogue";
import { FichePiece } from "./FichePiece";

// Toutes les fiches sont générées à l'avance (le catalogue est dans le code).
export function generateStaticParams() {
  return PIECES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/pieces/[id]">) {
  const { id } = await params;
  const piece = PIECES.find((p) => p.id === id);
  return { title: piece ? `${piece.nom} · Nuance` : "Pièce introuvable · Nuance" };
}

export default async function PagePiece({ params }: PageProps<"/pieces/[id]">) {
  const { id } = await params;
  const piece = PIECES.find((p) => p.id === id);
  if (!piece) notFound();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pt-3 pb-10">
      <FichePiece piece={piece} />
    </main>
  );
}
