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
