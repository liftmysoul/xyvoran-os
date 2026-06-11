create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  language_preference text default 'en' check (language_preference is null or language_preference in ('en', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists language_preference text default 'en';
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_language_preference_check' and conrelid = 'public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_language_preference_check check (language_preference is null or language_preference in ('en', 'es'));
  end if;
end $$;

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

-- Phase 8 membership and compliance infrastructure.
-- XYVORAN OS Phase 8: membership and compliance infrastructure.
-- Safe to run more than once.

create extension if not exists "pgcrypto";
create sequence if not exists public.xyv_member_number_seq start with 1 increment by 1;

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists state_province text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists address_line text;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists height_cm numeric;
alter table public.profiles add column if not exists weight_kg numeric;
alter table public.profiles add column if not exists occupation text;
alter table public.profiles add column if not exists member_id text;

create unique index if not exists profiles_member_id_idx
  on public.profiles (member_id)
  where member_id is not null;

create or replace function public.assign_xyv_member_id()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.member_id := 'XYV-' || lpad(nextval('public.xyv_member_number_seq')::text, 6, '0');
  elsif old.member_id is not null then
    new.member_id := old.member_id;
  elsif new.member_id is null then
    new.member_id := 'XYV-' || lpad(nextval('public.xyv_member_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists assign_xyv_member_id on public.profiles;
create trigger assign_xyv_member_id
before insert or update of member_id on public.profiles
for each row execute procedure public.assign_xyv_member_id();

update public.profiles
set member_id = 'XYV-' || lpad(nextval('public.xyv_member_number_seq')::text, 6, '0')
where member_id is null;

select setval(
  'public.xyv_member_number_seq',
  greatest(
    (select last_value from public.xyv_member_number_seq),
    coalesce((select max(substring(member_id from 5)::bigint) from public.profiles where member_id ~ '^XYV-[0-9]+$'), 1)
  ),
  true
);

create or replace function public.validate_profile_member_age()
returns trigger
language plpgsql
as $$
begin
  if new.date_of_birth is not null and new.date_of_birth > (current_date - interval '21 years')::date then
    raise exception 'Member must be at least 21 years old.' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_profile_member_age on public.profiles;
create trigger validate_profile_member_age
before insert or update of date_of_birth on public.profiles
for each row execute procedure public.validate_profile_member_age();

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('active', 'pending', 'suspended', 'expired')),
  join_date timestamptz not null default now(),
  plan_code text,
  billing_provider text,
  billing_customer_id text,
  billing_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.memberships (user_id, status, join_date)
select id, 'pending', created_at
from public.profiles
on conflict (user_id) do nothing;

create table if not exists public.member_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  age_certified_at timestamptz not null,
  educational_content_accepted_at timestamptz not null,
  terms_accepted_at timestamptz not null,
  privacy_accepted_at timestamptz not null,
  consent_version text not null default '2026-06',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.compliance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.member_admin_metadata (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notes text,
  risk_flags text[] not null default '{}',
  compliance_status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.biometrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null,
  value numeric,
  text_value text,
  unit text,
  source text not null default 'manual',
  measured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wearable_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  external_user_id text,
  status text not null default 'pending' check (status in ('pending', 'connected', 'disconnected', 'error')),
  connected_at timestamptz,
  last_synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists public.bloodwork_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lab_report_id uuid references public.lab_reports(id) on delete set null,
  panel_name text,
  laboratory_name text,
  collected_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  protocol_id uuid references public.generated_protocols(id) on delete set null,
  status text not null default 'started' check (status in ('started', 'completed', 'paused', 'archived')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  protocol_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.health_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text,
  target_value numeric,
  target_unit text,
  target_date date,
  status text not null default 'active' check (status in ('active', 'achieved', 'paused', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memberships_user_status_idx on public.memberships (user_id, status);
create index if not exists compliance_audit_logs_user_created_idx on public.compliance_audit_logs (user_id, created_at desc);
create index if not exists biometrics_user_measured_idx on public.biometrics (user_id, measured_at desc);
create index if not exists bloodwork_records_user_collected_idx on public.bloodwork_records (user_id, collected_at desc);
create index if not exists protocol_history_user_created_idx on public.protocol_history (user_id, created_at desc);
create index if not exists health_goals_user_status_idx on public.health_goals (user_id, status);

create or replace function public.ensure_membership_record()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.memberships (user_id, status, join_date)
  values (new.id, 'pending', coalesce(new.created_at, now()))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists ensure_membership_record on public.profiles;
create trigger ensure_membership_record
after insert on public.profiles
for each row execute procedure public.ensure_membership_record();

create or replace function public.log_profile_compliance_event()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  audit_event text := 'profile_updated';
begin
  if old.language_preference is distinct from new.language_preference then
    audit_event := 'language_changed';
  end if;
  insert into public.compliance_audit_logs (user_id, event_type, event_data)
  values (new.id, audit_event, jsonb_build_object('language_preference', new.language_preference));
  return new;
end;
$$;

drop trigger if exists log_profile_compliance_event on public.profiles;
create trigger log_profile_compliance_event
after update on public.profiles
for each row execute procedure public.log_profile_compliance_event();

create or replace function public.log_consent_compliance_event()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.memberships
  set status = 'active'
  where user_id = new.user_id and status = 'pending';
  insert into public.compliance_audit_logs (user_id, event_type, event_data)
  values (
    new.user_id,
    case when tg_op = 'INSERT' then 'consent_accepted' else 'consent_updated' end,
    jsonb_build_object('consent_version', new.consent_version)
  );
  return new;
end;
$$;

drop trigger if exists log_consent_compliance_event on public.member_consents;
create trigger log_consent_compliance_event
after insert or update on public.member_consents
for each row execute procedure public.log_consent_compliance_event();

drop trigger if exists set_memberships_updated_at on public.memberships;
create trigger set_memberships_updated_at before update on public.memberships for each row execute procedure public.set_updated_at();
drop trigger if exists set_member_consents_updated_at on public.member_consents;
create trigger set_member_consents_updated_at before update on public.member_consents for each row execute procedure public.set_updated_at();
drop trigger if exists set_member_admin_metadata_updated_at on public.member_admin_metadata;
create trigger set_member_admin_metadata_updated_at before update on public.member_admin_metadata for each row execute procedure public.set_updated_at();
drop trigger if exists set_wearable_connections_updated_at on public.wearable_connections;
create trigger set_wearable_connections_updated_at before update on public.wearable_connections for each row execute procedure public.set_updated_at();
drop trigger if exists set_health_goals_updated_at on public.health_goals;
create trigger set_health_goals_updated_at before update on public.health_goals for each row execute procedure public.set_updated_at();

alter table public.memberships enable row level security;
alter table public.member_consents enable row level security;
alter table public.compliance_audit_logs enable row level security;
alter table public.member_admin_metadata enable row level security;
alter table public.biometrics enable row level security;
alter table public.wearable_connections enable row level security;
alter table public.bloodwork_records enable row level security;
alter table public.protocol_history enable row level security;
alter table public.health_goals enable row level security;

drop policy if exists "Profiles delete own" on public.profiles;

drop policy if exists "Memberships select own" on public.memberships;
create policy "Memberships select own" on public.memberships for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Member consents select own" on public.member_consents;
drop policy if exists "Member consents insert own" on public.member_consents;
drop policy if exists "Member consents update own" on public.member_consents;
create policy "Member consents select own" on public.member_consents for select to authenticated using (auth.uid() = user_id);
create policy "Member consents insert own" on public.member_consents for insert to authenticated with check (auth.uid() = user_id);
create policy "Member consents update own" on public.member_consents for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Compliance logs select own" on public.compliance_audit_logs;
create policy "Compliance logs select own" on public.compliance_audit_logs for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Biometrics self managed" on public.biometrics;
create policy "Biometrics self managed" on public.biometrics for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Wearables self managed" on public.wearable_connections;
create policy "Wearables self managed" on public.wearable_connections for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Bloodwork records self managed" on public.bloodwork_records;
create policy "Bloodwork records self managed" on public.bloodwork_records for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Protocol history self managed" on public.protocol_history;
create policy "Protocol history self managed" on public.protocol_history for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Health goals self managed" on public.health_goals;
create policy "Health goals self managed" on public.health_goals for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- member_admin_metadata intentionally has no authenticated policy.
-- Service-role/admin tooling may access it later without exposing admin notes to members.
