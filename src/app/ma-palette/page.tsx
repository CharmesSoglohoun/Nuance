import { BarreNavigation } from "@/components/BarreNavigation";
import { MaPalette } from "./MaPalette";

export const metadata = { title: "Ma palette · Charmes" };

export default function PageMaPalette() {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pt-6 pb-28">
        <MaPalette />
      </main>
      <BarreNavigation />
    </>
  );
}
