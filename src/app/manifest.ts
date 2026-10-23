import type { MetadataRoute } from "next";

// Fiche d'identité de l'appli : c'est elle qui permet « Ajouter à l'écran d'accueil » sur téléphone.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Charmes",
    short_name: "Charmes",
    description: "Les couleurs qui te vont, la tenue de la saison, et où la trouver.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6f0",
    theme_color: "#faf6f0",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
