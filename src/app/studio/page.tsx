import { Studio } from "./Studio";

export const metadata = { title: "Studio · Nuance" };

export default function PageStudio() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3.5 px-5 pt-5 pb-10">
      <Studio />
    </main>
  );
}
