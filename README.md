# Charmes

Application web (installable sur téléphone) de conseil en style : les couleurs qui te vont selon ton teint et ton sous-ton, la tenue de la saison sur un mannequin personnalisé, et des références précises pour trouver chaque pièce. Hommes et femmes, peaux noires comme peaux blanches.

Projet en cours de construction (MVP). Pas de prix, pas d'affiliation.

## Technologies

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript) et Tailwind CSS 4
- Bientôt : Supabase (comptes et données), React Three Fiber (mannequin 3D)
- Hébergement : Vercel

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Variables d'environnement

Aucune clé n'est écrite dans le code. En local, elles sont lues dans le fichier `.env` de l'espace de travail parent ; en ligne, elles sont réglées dans Vercel.
