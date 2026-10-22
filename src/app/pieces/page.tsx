import { ListePieces } from "./ListePieces";

export const metadata = { title: "Tes pièces de saison · Nuance" };

export default function Pieces() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pt-6 pb-10">
      <ListePieces />
    </main>
  );
}
