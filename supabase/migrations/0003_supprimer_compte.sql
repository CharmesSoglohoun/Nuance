-- =====================================================================
-- Charmes : suppression de compte par la personne elle-même (RGPD, droit à l'effacement)
-- À exécuter une seule fois dans Supabase > SQL Editor, après 0002.
--
-- La fonction efface UNIQUEMENT le compte de la personne connectée qui l'appelle (auth.uid()).
-- Grâce aux « on delete cascade » de 0001, son profil, ses favoris et ses tenues partent avec.
-- =====================================================================

create or replace function public.supprimer_mon_compte()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Il faut être connecté pour supprimer son compte.';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- Seules les personnes connectées peuvent l'appeler (pas les visiteurs anonymes).
revoke all on function public.supprimer_mon_compte() from public, anon;
grant execute on function public.supprimer_mon_compte() to authenticated;
