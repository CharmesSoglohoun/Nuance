import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Règle du workspace Jarvis : les clés vivent uniquement dans le .env à la racine du workspace.
// En local, on le charge depuis là. En ligne, Vercel fournit les variables lui-même (ce dossier n'existe pas).
const workspaceRoot = path.resolve(process.cwd(), "../../../..");
if (existsSync(path.join(workspaceRoot, ".env"))) {
  // forceReload : Next.js a déjà chargé (et mis en cache) les .env du dossier app, qui n'en a pas.
  loadEnvConfig(workspaceRoot, process.env.NODE_ENV !== "production", undefined, true);
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
