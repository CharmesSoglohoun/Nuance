import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Arrivée depuis le lien de l'e-mail : on vérifie le jeton, on ouvre la session, puis on va sur « Mon espace ».
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  // On n'accepte qu'une destination interne au site (évite les redirections vers un autre site).
  const suite = searchParams.get("next") ?? "/moi";
  const destination = suite.startsWith("/") && !suite.startsWith("//") ? suite : "/moi";

  const supabase = await createClient();
  let ok = false;

  if (tokenHash && type) {
    // Lien construit par notre modèle d'e-mail : fonctionne même si l'e-mail est ouvert dans un autre navigateur.
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    // Lien par défaut de Supabase (même navigateur que la demande).
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  return NextResponse.redirect(new URL(ok ? destination : "/connexion?erreur=lien", origin));
}
