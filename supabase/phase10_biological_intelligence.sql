create table if not exists public.biological_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('biomarker', 'lab', 'lifestyle', 'pillar', 'missing_data')),
  source_id uuid,
  insight_type text not null check (insight_type in ('constraint', 'opportunity', 'trend', 'risk_flag', 'protocol_priority', 'missing_data')),
  pillar text not null,
  severity text not null default 'low' check (severity in ('low', 'moderate', 'high', 'priority')),
  confidence_score numeric not null default 0 check (confidence_score >= 0 and confidence_score <= 100),
  title text not null,
  summary text not null,
  evidence jsonb not null default '{}'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists biological_insights_user_created_idx
on public.biological_insights (user_id, created_at desc);

create index if not exists biological_insights_user_status_idx
on public.biological_insights (user_id, status, severity, created_at desc);

create unique index if not exists biological_insights_user_issue_idx
on public.biological_insights (user_id, source_type, insight_type, pillar, title);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_biological_insights_updated_at on public.biological_insights;
create trigger set_biological_insights_updated_at
before update on public.biological_insights
for each row execute function public.set_updated_at();

alter table public.biological_insights enable row level security;

drop policy if exists "Biological insights select own" on public.biological_insights;
drop policy if exists "Biological insights insert own" on public.biological_insights;
drop policy if exists "Biological insights update own" on public.biological_insights;
drop policy if exists "Biological insights delete own" on public.biological_insights;

create policy "Biological insights select own"
on public.biological_insights
for select
to authenticated
using (auth.uid() = user_id);

create policy "Biological insights insert own"
on public.biological_insights
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Biological insights update own"
on public.biological_insights
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Biological insights delete own"
on public.biological_insights
for delete
to authenticated
using (auth.uid() = user_id);
