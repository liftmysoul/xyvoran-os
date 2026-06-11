create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  age int not null check (age between 13 and 120),
  sex text not null check (sex in ('female', 'male', 'intersex', 'prefer_not_to_say')),
  height_cm numeric not null,
  weight_kg numeric not null,
  main_goal text not null,
  sleep_quality int not null check (sleep_quality between 1 and 10),
  stress_level int not null check (stress_level between 1 and 10),
  energy_level int not null check (energy_level between 1 and 10),
  exercise_frequency text not null,
  diet_style text not null,
  supplements text,
  disclaimer_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.biomarker_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fasting_glucose numeric,
  hba1c numeric,
  insulin numeric,
  crp numeric,
  vitamin_d numeric,
  testosterone numeric,
  cortisol numeric,
  hrv numeric,
  resting_heart_rate numeric,
  sleep_duration numeric,
  deep_sleep numeric,
  rem_sleep numeric,
  notes text,
  created_at timestamptz not null default now()
);

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

create table if not exists public.pillar_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pillar text not null check (pillar in ('Metabolic', 'Recovery', 'Longevity', 'Cognitive', 'Beauty')),
  score int not null check (score between 0 and 100),
  status text not null,
  metrics jsonb not null default '[]'::jsonb,
  suggested_next_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.generated_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  goal text not null,
  weakest_pillar text,
  intensity text not null default 'Beginner',
  protocol_json jsonb,
  protocol jsonb not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table public.generated_protocols add column if not exists title text;
alter table public.generated_protocols add column if not exists weakest_pillar text;
alter table public.generated_protocols add column if not exists intensity text not null default 'Beginner';
alter table public.generated_protocols add column if not exists protocol_json jsonb;
alter table public.generated_protocols add column if not exists status text not null default 'active';

update public.generated_protocols
set protocol_json = protocol
where protocol_json is null;

create unique index if not exists onboarding_data_user_id_idx on public.onboarding_data (user_id);
create unique index if not exists pillar_scores_user_pillar_idx on public.pillar_scores (user_id, pillar);
create index if not exists biomarker_entries_user_created_idx on public.biomarker_entries (user_id, created_at desc);
create index if not exists ai_chat_messages_user_created_idx on public.ai_chat_messages (user_id, created_at asc);
create index if not exists generated_protocols_user_created_idx on public.generated_protocols (user_id, created_at desc);
create index if not exists generated_protocols_user_status_idx on public.generated_protocols (user_id, status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_onboarding_data_updated_at on public.onboarding_data;
create trigger set_onboarding_data_updated_at
before update on public.onboarding_data
for each row execute procedure public.set_updated_at();

drop trigger if exists set_pillar_scores_updated_at on public.pillar_scores;
create trigger set_pillar_scores_updated_at
before update on public.pillar_scores
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.onboarding_data enable row level security;
alter table public.biomarker_entries enable row level security;
alter table public.pillar_scores enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.generated_protocols enable row level security;

drop policy if exists "Profiles are self managed" on public.profiles;
drop policy if exists "Onboarding is self managed" on public.onboarding_data;
drop policy if exists "Biomarkers are self managed" on public.biomarker_entries;
drop policy if exists "Pillar scores are self managed" on public.pillar_scores;
drop policy if exists "Chat messages are self managed" on public.ai_chat_messages;
drop policy if exists "Protocols are self managed" on public.generated_protocols;

drop policy if exists "Profiles select own" on public.profiles;
drop policy if exists "Profiles insert own" on public.profiles;
drop policy if exists "Profiles update own" on public.profiles;
drop policy if exists "Profiles delete own" on public.profiles;
create policy "Profiles select own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Profiles insert own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Profiles delete own" on public.profiles for delete to authenticated using (auth.uid() = id);

drop policy if exists "Onboarding select own" on public.onboarding_data;
drop policy if exists "Onboarding insert own" on public.onboarding_data;
drop policy if exists "Onboarding update own" on public.onboarding_data;
drop policy if exists "Onboarding delete own" on public.onboarding_data;
create policy "Onboarding select own" on public.onboarding_data for select to authenticated using (auth.uid() = user_id);
create policy "Onboarding insert own" on public.onboarding_data for insert to authenticated with check (auth.uid() = user_id);
create policy "Onboarding update own" on public.onboarding_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Onboarding delete own" on public.onboarding_data for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Biomarkers select own" on public.biomarker_entries;
drop policy if exists "Biomarkers insert own" on public.biomarker_entries;
drop policy if exists "Biomarkers update own" on public.biomarker_entries;
drop policy if exists "Biomarkers delete own" on public.biomarker_entries;
create policy "Biomarkers select own" on public.biomarker_entries for select to authenticated using (auth.uid() = user_id);
create policy "Biomarkers insert own" on public.biomarker_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "Biomarkers update own" on public.biomarker_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Biomarkers delete own" on public.biomarker_entries for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Pillar scores select own" on public.pillar_scores;
drop policy if exists "Pillar scores insert own" on public.pillar_scores;
drop policy if exists "Pillar scores update own" on public.pillar_scores;
drop policy if exists "Pillar scores delete own" on public.pillar_scores;
create policy "Pillar scores select own" on public.pillar_scores for select to authenticated using (auth.uid() = user_id);
create policy "Pillar scores insert own" on public.pillar_scores for insert to authenticated with check (auth.uid() = user_id);
create policy "Pillar scores update own" on public.pillar_scores for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Pillar scores delete own" on public.pillar_scores for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Chat messages select own" on public.ai_chat_messages;
drop policy if exists "Chat messages insert own" on public.ai_chat_messages;
drop policy if exists "Chat messages update own" on public.ai_chat_messages;
drop policy if exists "Chat messages delete own" on public.ai_chat_messages;
create policy "Chat messages select own" on public.ai_chat_messages for select to authenticated using (auth.uid() = user_id);
create policy "Chat messages insert own" on public.ai_chat_messages for insert to authenticated with check (auth.uid() = user_id);
create policy "Chat messages update own" on public.ai_chat_messages for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Chat messages delete own" on public.ai_chat_messages for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Protocols select own" on public.generated_protocols;
drop policy if exists "Protocols insert own" on public.generated_protocols;
drop policy if exists "Protocols update own" on public.generated_protocols;
drop policy if exists "Protocols delete own" on public.generated_protocols;
create policy "Protocols select own" on public.generated_protocols for select to authenticated using (auth.uid() = user_id);
create policy "Protocols insert own" on public.generated_protocols for insert to authenticated with check (auth.uid() = user_id);
create policy "Protocols update own" on public.generated_protocols for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Protocols delete own" on public.generated_protocols for delete to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.lab_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_path text not null,
  upload_date timestamptz not null default now(),
  processing_status text not null default 'uploaded' check (processing_status in ('uploaded', 'processing', 'completed', 'failed')),
  analysis_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lab_reports_user_created_idx on public.lab_reports (user_id, created_at desc);
alter table public.lab_reports enable row level security;
drop policy if exists "Lab reports select own" on public.lab_reports;
drop policy if exists "Lab reports insert own" on public.lab_reports;
drop policy if exists "Lab reports update own" on public.lab_reports;
drop policy if exists "Lab reports delete own" on public.lab_reports;
create policy "Lab reports select own" on public.lab_reports for select to authenticated using (auth.uid() = user_id);
create policy "Lab reports insert own" on public.lab_reports for insert to authenticated with check (auth.uid() = user_id);
create policy "Lab reports update own" on public.lab_reports for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Lab reports delete own" on public.lab_reports for delete to authenticated using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lab-reports', 'lab-reports', false, 4194304, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Lab files select own" on storage.objects;
drop policy if exists "Lab files insert own" on storage.objects;
drop policy if exists "Lab files update own" on storage.objects;
drop policy if exists "Lab files delete own" on storage.objects;
create policy "Lab files select own" on storage.objects for select to authenticated using (bucket_id = 'lab-reports' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Lab files insert own" on storage.objects for insert to authenticated with check (bucket_id = 'lab-reports' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Lab files update own" on storage.objects for update to authenticated using (bucket_id = 'lab-reports' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'lab-reports' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Lab files delete own" on storage.objects for delete to authenticated using (bucket_id = 'lab-reports' and (storage.foldername(name))[1] = auth.uid()::text);
