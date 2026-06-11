alter table public.onboarding_data add column if not exists secondary_goals text[];
alter table public.onboarding_data add column if not exists sleep_duration numeric;
alter table public.onboarding_data add column if not exists hrv numeric;
alter table public.onboarding_data add column if not exists resting_heart_rate numeric;
alter table public.onboarding_data add column if not exists waist_circumference_cm numeric;
alter table public.onboarding_data add column if not exists body_fat_percent numeric;
alter table public.onboarding_data add column if not exists fasting_hours numeric;
alter table public.onboarding_data add column if not exists eating_window_hours numeric;
alter table public.onboarding_data add column if not exists sugar_craving_frequency text;
alter table public.onboarding_data add column if not exists afternoon_energy_crash_frequency text;
alter table public.onboarding_data add column if not exists focus_level int;
alter table public.onboarding_data add column if not exists brain_fog_frequency text;
alter table public.onboarding_data add column if not exists caffeine_intake text;
alter table public.onboarding_data add column if not exists productivity_goal text;
alter table public.onboarding_data add column if not exists alcohol_use text;
alter table public.onboarding_data add column if not exists nicotine_use text;
alter table public.onboarding_data add column if not exists family_history_notes text;
alter table public.onboarding_data add column if not exists longevity_concern text;
alter table public.onboarding_data add column if not exists skin_quality int;
alter table public.onboarding_data add column if not exists hydration_level int;
alter table public.onboarding_data add column if not exists beauty_concern text;
alter table public.onboarding_data add column if not exists medications text;
alter table public.onboarding_data add column if not exists peptides text;
alter table public.onboarding_data add column if not exists wearables_used text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'onboarding_sleep_duration_range') then
    alter table public.onboarding_data add constraint onboarding_sleep_duration_range check (sleep_duration is null or sleep_duration between 0 and 24);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'onboarding_focus_level_range') then
    alter table public.onboarding_data add constraint onboarding_focus_level_range check (focus_level is null or focus_level between 1 and 10);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'onboarding_skin_quality_range') then
    alter table public.onboarding_data add constraint onboarding_skin_quality_range check (skin_quality is null or skin_quality between 1 and 10);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'onboarding_hydration_level_range') then
    alter table public.onboarding_data add constraint onboarding_hydration_level_range check (hydration_level is null or hydration_level between 1 and 10);
  end if;
end $$;
