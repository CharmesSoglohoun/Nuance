"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EtatEnvoi = { statut: "repos" | "envoye" | "erreur"; message?: string; email?: string };

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Envoie le lien magique. Si l'adresse n'a pas encore de compte, Supabase le crée.
export async function envoyerLienMagique(_etat: EtatEnvoi, formData: FormData): Promise<EtatEnvoi> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_VALIDE.test(email)) {
    return { statut: "erreur", message: "Cette adresse e-mail ne semble pas valide.", email };
  }

  const origine = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${origine}/auth/confirm` },
  });

  if (error) {
    const tropDeDemandes = error.status === 429;
    return {
      statut: "erreur",
      email,
      message: tropDeDemandes
        ? "Trop de demandes en peu de temps. Attends quelques minutes avant de réessayer."
        : "L’envoi n’a pas fonctionné. Réessaie dans un instant.",
    };
  }
  return { statut: "envoye", email };
}

export async function seDeconnecter() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
