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
