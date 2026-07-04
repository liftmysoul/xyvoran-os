create extension if not exists "pgcrypto";

create table if not exists public.adaptive_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_name text not null,
  primary_pillar text not null,
  "constraint" text not null,
  confidence integer not null default 0 check (confidence >= 0 and confidence <= 100),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  phases jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  tracking_signals jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists adaptive_missions_user_created_idx
  on public.adaptive_missions(user_id, created_at desc);

create index if not exists adaptive_missions_user_active_idx
  on public.adaptive_missions(user_id)
  where completed_at is null;

create or replace function public.set_adaptive_missions_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists adaptive_missions_set_updated_at on public.adaptive_missions;
create trigger adaptive_missions_set_updated_at
before update on public.adaptive_missions
for each row execute function public.set_adaptive_missions_updated_at();

alter table public.adaptive_missions enable row level security;

drop policy if exists "Users can read own adaptive missions" on public.adaptive_missions;
create policy "Users can read own adaptive missions"
on public.adaptive_missions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own adaptive missions" on public.adaptive_missions;
create policy "Users can insert own adaptive missions"
on public.adaptive_missions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own adaptive missions" on public.adaptive_missions;
create policy "Users can update own adaptive missions"
on public.adaptive_missions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own adaptive missions" on public.adaptive_missions;
create policy "Users can delete own adaptive missions"
on public.adaptive_missions
for delete
to authenticated
using (auth.uid() = user_id);
