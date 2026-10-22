import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nuance · Les couleurs qui te vont",
  description: "Les couleurs qui te vont, la tenue de la saison, et où la trouver.",
  applicationName: "Nuance",
  // Prototype en cours de construction : pas d'indexation par les moteurs de recherche.
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Nuance", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
