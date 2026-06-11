alter table public.generated_protocols add column if not exists title text;
alter table public.generated_protocols add column if not exists weakest_pillar text;
alter table public.generated_protocols add column if not exists intensity text not null default 'Beginner';
alter table public.generated_protocols add column if not exists protocol_json jsonb;
alter table public.generated_protocols add column if not exists status text not null default 'active';

update public.generated_protocols
set protocol_json = protocol
where protocol_json is null;

create index if not exists generated_protocols_user_status_idx
on public.generated_protocols (user_id, status, created_at desc);
