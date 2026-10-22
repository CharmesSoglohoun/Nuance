import { BientotDisponible } from "@/components/BientotDisponible";

export const metadata = { title: "Ton profil · Nuance" };

export default function Profil() {
  return (
    <BientotDisponible
      titre="Parlons de ta silhouette"
      texte="Le test en 3 étapes (silhouette, teint et sous-ton, goûts) arrive dans la prochaine version."
    />
  );
}
