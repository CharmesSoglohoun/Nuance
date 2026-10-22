import { BarreNavigation } from "@/components/BarreNavigation";
import { Favoris } from "./Favoris";

export const metadata = { title: "Favoris · Nuance" };

export default function PageFavoris() {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-5 pt-5 pb-28">
        <Favoris />
      </main>
      <BarreNavigation />
    </>
  );
}
