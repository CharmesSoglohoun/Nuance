import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

// Client Supabase côté serveur (pages, actions, routes). Il lit la session dans les cookies.
export async function createClient() {
  const { url, key } = supabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appelé depuis une page : impossible d'écrire des cookies ici.
          // Ce n'est pas grave, le proxy rafraîchit la session à chaque requête.
        }
      },
    },
  });
}
