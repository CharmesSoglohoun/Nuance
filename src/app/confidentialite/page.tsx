import { Contact, PageLegale } from "@/components/PageLegale";
import { EDITEUR, MISE_A_JOUR } from "@/data/legal";

export const metadata = { title: "Politique de confidentialité · Charmes" };

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité" miseAJour={MISE_A_JOUR}>
      <p>
        Charmes t’aide à trouver les couleurs et les tenues qui te mettent en valeur. Cette page explique, simplement, quelles données sont utilisées, pourquoi, et comment tu gardes la main dessus.
      </p>

      <section>
        <h2>Qui est responsable ?</h2>
        <p>{EDITEUR}, à l’origine de Charmes (projet personnel en cours de développement, Rennes). Contact : <Contact />.</p>
      </section>

      <section>
        <h2>Quelles données ?</h2>
        <ul>
          <li><strong>Ton profil de style</strong> : genre de vêtements, taille, silhouette, teint, sous-ton, styles et types de boutiques préférés.</li>
          <li><strong>Tes favoris</strong> : tenues et pièces que tu as aimées, avec leur couleur.</li>
          <li><strong>Ton adresse e-mail</strong>, seulement si tu crées un compte (pour te connecter).</li>
        </ul>
        <p>Charmes ne demande <strong>aucune photo</strong>, aucune donnée bancaire, et n’affiche aucune publicité.</p>
      </section>

      <section>
        <h2>Où sont-elles gardées ?</h2>
        <ul>
          <li><strong>Sans compte</strong> : uniquement sur ton téléphone (stockage du navigateur). Rien n’est envoyé.</li>
          <li><strong>Avec un compte</strong> : ton e-mail et tes favoris sont enregistrés chez notre hébergeur de données, Supabase, sur des serveurs situés dans l’Union européenne (région de Paris). Ton profil de style n’y est enregistré que si tu touches « Enregistrer ma palette dans mon compte ».</li>
        </ul>
      </section>

      <section>
        <h2>Le teint de peau : une donnée à part</h2>
        <p>
          Ton teint sert uniquement à choisir les couleurs qui te vont. Comme il peut être lié à l’origine, il est traité avec une protection renforcée : il n’est enregistré dans ton compte qu’avec ton <strong>accord explicite</strong> (le bouton prévu à cet effet), il n’est jamais partagé, et tu peux l’effacer à tout moment.
        </p>
      </section>

      <section>
        <h2>Pourquoi, et sur quelle base ?</h2>
        <p>
          Pour te proposer ta palette, tes tenues et retrouver tes favoris sur tes appareils. La base est ton <strong>consentement</strong> : tu choisis de faire le test, de créer un compte et d’enregistrer ta palette, et tu peux revenir sur ce choix à tout moment.
        </p>
      </section>

      <section>
        <h2>Combien de temps ?</h2>
        <p>Tant que ton compte existe. Si tu supprimes ton compte, tout est effacé immédiatement : e-mail, profil, favoris. Les données gardées sur ton téléphone restent tant que tu ne les effaces pas (bouton « Supprimer mon compte et mes données » dans Profil).</p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>Charmes utilise seulement les cookies nécessaires pour rester connecté. Aucun cookie publicitaire ni de mesure d’audience.</p>
      </section>

      <section>
        <h2>Liens vers les boutiques</h2>
        <p>Les boutons « Chercher » ouvrent le site d’une boutique (Zara, H&amp;M, Vinted…). Charmes ne leur transmet aucune donnée personnelle : seuls les mots-clés de la pièce sont envoyés. Sur leur site, c’est leur propre politique de confidentialité qui s’applique. Charmes n’a aucun partenariat avec ces boutiques.</p>
      </section>

      <section>
        <h2>Tes droits</h2>
        <p>
          Tu peux à tout moment consulter, corriger, télécharger ou effacer tes données. Depuis Profil : « Refaire le test » (corriger), « Télécharger mes données » (consulter et récupérer) et « Supprimer mon compte et mes données » (effacer). Pour toute autre demande : <Contact />. Tu peux aussi adresser une réclamation à la CNIL (cnil.fr).
        </p>
      </section>
    </PageLegale>
  );
}
