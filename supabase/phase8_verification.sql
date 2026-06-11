-- Read-only Phase 8 verification queries.

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name in (
    'first_name', 'last_name', 'phone_number', 'date_of_birth', 'country',
    'state_province', 'city', 'address_line', 'gender', 'height_cm',
    'weight_kg', 'occupation', 'member_id'
  )
order by ordinal_position;

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'memberships', 'member_consents', 'compliance_audit_logs', 'member_admin_metadata',
    'biometrics', 'wearable_connections', 'bloodwork_records', 'protocol_history', 'health_goals'
  )
order by table_name;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid in (
  'public.memberships'::regclass,
  'public.member_consents'::regclass,
  'public.compliance_audit_logs'::regclass,
  'public.member_admin_metadata'::regclass,
  'public.biometrics'::regclass,
  'public.wearable_connections'::regclass,
  'public.bloodwork_records'::regclass,
  'public.protocol_history'::regclass,
  'public.health_goals'::regclass
)
order by relname;

select policyname, tablename, cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'memberships', 'member_consents', 'compliance_audit_logs', 'member_admin_metadata',
    'biometrics', 'wearable_connections', 'bloodwork_records', 'protocol_history', 'health_goals'
  )
order by tablename, policyname;

select member_id, count(*)
from public.profiles
group by member_id
having member_id is null or count(*) > 1;

select status, count(*)
from public.memberships
group by status
order by status;

select event_type, count(*)
from public.compliance_audit_logs
group by event_type
order by event_type;
