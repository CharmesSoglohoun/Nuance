"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { envoyerLienMagique, type EtatEnvoi } from "./actions";

const ETAT_INITIAL: EtatEnvoi = { statut: "repos" };

export function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(envoyerLienMagique, ETAT_INITIAL);
  const lienInvalide = useSearchParams().get("erreur") === "lien";

  if (etat.statut === "envoye") {
    return (
      <section aria-live="polite" className="flex flex-col gap-3 rounded-2xl bg-[#eef1ea] p-5">
        <h2 className="font-serif text-2xl font-semibold">Regarde tes e-mails</h2>
        <p className="text-[15px] leading-relaxed text-[#33402d]">
          On vient d’envoyer un lien de connexion à <strong>{etat.email}</strong>. Touche le bouton dans l’e-mail
          et tu seras connecté. Pense à regarder dans les spams.
        </p>
        <p className="text-[13px] text-[#3f4a38]">Le lien est valable une heure et ne sert qu’une fois.</p>
      </section>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      {lienInvalide && (
        <p role="alert" className="rounded-xl bg-[#fbede6] p-3 text-[14px] text-[#8a3d22]">
          Ce lien n’est plus valable (déjà utilisé ou expiré). Demande un nouveau lien ci-dessous.
        </p>
      )}
      <label htmlFor="email" className="text-[15px] font-semibold">
        Ton adresse e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        defaultValue={etat.email}
        placeholder="prenom@exemple.fr"
        aria-invalid={etat.statut === "erreur"}
        aria-describedby={etat.statut === "erreur" ? "email-erreur" : undefined}
        className="h-14 rounded-2xl border-2 border-bordure bg-carte px-4 text-[17px] outline-none focus:border-terracotta"
      />
      {etat.statut === "erreur" && (
        <p id="email-erreur" role="alert" className="text-[14px] text-[#8a3d22]">
          {etat.message}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="mt-1 flex h-14 items-center justify-center rounded-2xl bg-terracotta text-[17px] font-semibold text-white transition hover:bg-[#8a3d22] disabled:opacity-70"
      >
        {enCours ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
      </button>
      <p className="text-[13px] leading-relaxed text-encre-douce">
        Pas de mot de passe à retenir : tu reçois un lien par e-mail. Si tu n’as pas encore de compte, il est créé
        automatiquement.
      </p>
    </form>
  );
}
