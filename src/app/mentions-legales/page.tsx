import { Contact, PageLegale } from "@/components/PageLegale";
import { EDITEUR, MISE_A_JOUR } from "@/data/legal";

export const metadata = { title: "Mentions légales · Nuance" };

export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales" miseAJour={MISE_A_JOUR}>
      <section>
        <h2>Éditeur</h2>
        <p>Nuance est un projet personnel, non commercial, édité par {EDITEUR} (étudiant, Rennes). Contact : <Contact />.</p>
      </section>

      <section>
        <h2>Hébergement du site</h2>
        <p>Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (vercel.com).</p>
      </section>

      <section>
        <h2>Hébergement des données</h2>
        <p>Supabase (supabase.com), serveurs situés dans l’Union européenne (région de Paris).</p>
      </section>

      <section>
        <h2>Contenus et marques</h2>
        <p>
          Les palettes, les fiches de pièces, les textes et les illustrations de Nuance sont propres au projet. Les noms de boutiques cités (Zara, H&amp;M, Celio, Zalando, Decathlon, Etsy, Spartoo, Vinted) appartiennent à leurs propriétaires respectifs ; ils sont mentionnés uniquement pour t’aider à trouver une pièce, sans partenariat ni rémunération.
        </p>
      </section>

      <section>
        <h2>Conseils</h2>
        <p>Les conseils de couleurs et de tenues sont des suggestions de style. Ils ne remplacent pas ton propre goût : c’est toi qui décides de ce que tu portes.</p>
      </section>
    </PageLegale>
  );
}
