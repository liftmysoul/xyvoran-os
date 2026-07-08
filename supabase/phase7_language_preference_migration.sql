-- XYVORAN OS Phase 7: bilingual language preference.
-- Safe to run more than once.

alter table public.profiles
  add column if not exists language_preference text default 'en';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_language_preference_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_language_preference_check
      check (language_preference is null or language_preference in ('en', 'es'));
  end if;
end $$;

update public.profiles
set language_preference = 'en'
where language_preference is null;
-- LEGACY XYVORAN OS LOCAL MIGRATION.
-- Do not run directly against the shared xyvoran.com Supabase backend.
-- Review and apply approved changes through Lovable Cloud migrations only.

