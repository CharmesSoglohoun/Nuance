-- =====================================================================
-- Charmes : structure initiale de la base (MVP)
-- À exécuter une seule fois dans Supabase > SQL Editor.
--
-- Principe de sécurité (RLS = Row Level Security) :
--   - le catalogue (boutiques, pièces, palettes) est lisible par tout le monde,
--     mais modifiable seulement depuis le tableau de bord Supabase ;
--   - les données personnelles (profil, favoris, tenues) ne sont visibles
--     et modifiables que par leur propriétaire connecté.
-- =====================================================================

-- ---------- Profil de style (1 par compte) ---------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  genre       text check (genre in ('h', 'f')),
  taille_cm   int  check (taille_cm between 140 and 220),
  silhouette  text check (silhouette in ('sablier', 'triangle', 'triangle-inv', 'rectangle', 'ovale', 'trapeze')),
  teint       text check (teint in ('porcelaine', 'ivoire', 'sable', 'miel', 'caramel', 'cannelle', 'cacao', 'ebene')),
  sous_ton    text check (sous_ton in ('chaud', 'froid', 'neutre')),
  styles      text[] not null default '{}',
  boutiques   text[] not null default '{}',
  ville       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Palettes de couleurs (par teint et sous-ton) -------------
create table public.palettes (
  id         uuid primary key default gen_random_uuid(),
  nom        text not null,                         -- ex. « Terre lumineuse »
  teints     text[] not null,                       -- teints concernés
  sous_ton   text not null check (sous_ton in ('chaud', 'froid', 'neutre')),
  contraste  text check (contraste in ('doux', 'moyen', 'marque')),
  phares     jsonb not null default '[]',           -- [{nom, hex, idee}] : 12 couleurs conseillées
  loin       jsonb not null default '[]',           -- [{nom, hex}] : 5 couleurs à porter loin du visage
  pourquoi   text
);

-- ---------- Boutiques de référence ------------------------------------
create table public.stores (
  id        uuid primary key default gen_random_uuid(),
  nom       text not null,
  type      text not null check (type in ('grand-public', 'createurs', 'seconde-main', 'sport')),
  site_url  text,
  ville     text,
  adresse   text,
  latitude  double precision,
  longitude double precision
);

-- ---------- Pièces du catalogue (sans prix) ---------------------------
create table public.products (
  id           uuid primary key default gen_random_uuid(),
  nom          text not null,                       -- ex. « Chino coupe droite, taille mi-haute »
  categorie    text not null check (categorie in ('haut', 'bas', 'chaussures', 'piece-en-plus')),
  genre        text not null check (genre in ('h', 'f', 'mixte')),
  couleur_nom  text not null,
  couleur_hex  text not null check (couleur_hex ~ '^#[0-9A-Fa-f]{6}$'),
  saisons      text[] not null check (saisons <@ array['ete', 'automne', 'hiver']),
  styles       text[] not null default '{}',
  matiere      text,
  coupe        text,
  rayon        text,                                -- ex. « Homme > Pantalons > Chinos »
  mots_cles    text,                                -- mots à copier pour une recherche en ligne
  image_url    text,
  verifie_le   date not null default current_date   -- dernière vérification que la pièce existe encore
);

-- ---------- Où trouver chaque pièce -----------------------------------
create table public.product_stores (
  product_id     uuid not null references public.products (id) on delete cascade,
  store_id       uuid not null references public.stores (id) on delete cascade,
  reference      text,                              -- référence de l'article dans la boutique
  disponibilite  text not null check (disponibilite in ('en-ligne', 'magasin', 'les-deux')),
  url            text,
  primary key (product_id, store_id)
);

-- ---------- Favoris et tenues sauvegardées ----------------------------
create table public.favorite_products (
  user_id     uuid not null references auth.users (id) on delete cascade,
  product_id  uuid not null references public.products (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.outfits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  nom         text not null,
  saison      text not null check (saison in ('ete', 'automne', 'hiver')),
  pieces      uuid[] not null,                      -- haut, bas, chaussures, pièce en plus
  created_at  timestamptz not null default now()
);

create index on public.outfits (user_id);
create index on public.product_stores (store_id);

-- ---------- Mise à jour automatique de updated_at ---------------------
create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Sécurité : activer RLS partout, puis ouvrir uniquement le nécessaire
-- =====================================================================
alter table public.profiles          enable row level security;
alter table public.palettes          enable row level security;
alter table public.stores            enable row level security;
alter table public.products          enable row level security;
alter table public.product_stores    enable row level security;
alter table public.favorite_products enable row level security;
alter table public.outfits           enable row level security;

-- Catalogue : lecture publique, aucune écriture depuis l'appli
create policy "Catalogue lisible par tous" on public.palettes       for select to anon, authenticated using (true);
create policy "Catalogue lisible par tous" on public.stores         for select to anon, authenticated using (true);
create policy "Catalogue lisible par tous" on public.products       for select to anon, authenticated using (true);
create policy "Catalogue lisible par tous" on public.product_stores for select to anon, authenticated using (true);

-- Profil : chacun ne voit et ne modifie que le sien
create policy "Lire mon profil"      on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Créer mon profil"     on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Modifier mon profil"  on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Supprimer mon profil" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

-- Favoris : chacun ne gère que les siens
create policy "Lire mes favoris"      on public.favorite_products for select to authenticated using ((select auth.uid()) = user_id);
create policy "Ajouter mes favoris"   on public.favorite_products for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Retirer mes favoris"   on public.favorite_products for delete to authenticated using ((select auth.uid()) = user_id);

-- Tenues : chacun ne gère que les siennes
create policy "Lire mes tenues"       on public.outfits for select to authenticated using ((select auth.uid()) = user_id);
create policy "Ajouter mes tenues"    on public.outfits for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Renommer mes tenues"   on public.outfits for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Supprimer mes tenues"  on public.outfits for delete to authenticated using ((select auth.uid()) = user_id);
