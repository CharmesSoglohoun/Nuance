import { createBrowserClient } from "@supabase/ssr";

// Client Supabase côté navigateur. Les règles RLS limitent ce qu'il peut lire et écrire.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
