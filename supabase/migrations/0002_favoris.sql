-- =====================================================================
-- Nuance : favoris adaptés au catalogue (qui vit dans le code de l'appli)
-- À exécuter une seule fois dans Supabase > SQL Editor, après 0001.
-- Les pièces sont désormais identifiées par un texte (ex. « h-chino ») et non plus
-- par une ligne de la table products. Les règles de sécurité (RLS) restent actives.
-- =====================================================================

-- ---------- Pièces favorites ------------------------------------------
alter table public.favorite_products drop constraint if exists favorite_products_product_id_fkey;
alter table public.favorite_products alter column product_id type text using product_id::text;
alter table public.favorite_products add column if not exists couleur text;      -- nom de la couleur choisie
alter table public.favorite_products add column if not exists couleur_hex text;

-- Changer la couleur d'une pièce déjà aimée
create policy "Modifier mes favoris" on public.favorite_products
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ---------- Tenues aimées ----------------------------------------------
alter table public.outfits drop column if exists pieces;
alter table public.outfits add column pieces jsonb not null default '[]';        -- [{pieceId, couleur, hex}]
alter table public.outfits add column if not exists signature text not null default '';
create unique index if not exists outfits_user_signature on public.outfits (user_id, signature);
