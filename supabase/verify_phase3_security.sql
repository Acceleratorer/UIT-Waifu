-- UIT Waifu Phase 3 live Supabase verification.
-- Run this in the Supabase SQL Editor after applying migrations.
-- It reports missing tables, disabled RLS, and missing owner-only policies.

with required_tables(table_name) as (
  values
    ('profiles'),
    ('conversations'),
    ('messages'),
    ('documents'),
    ('document_chunks'),
    ('study_plans'),
    ('tasks'),
    ('settings'),
    ('feedback')
),
required_policies(table_name, policy_name) as (
  values
    ('profiles', 'profiles own rows'),
    ('conversations', 'conversations own rows'),
    ('messages', 'messages own conversations'),
    ('documents', 'documents own rows'),
    ('document_chunks', 'document chunks own rows'),
    ('study_plans', 'study plans own rows'),
    ('tasks', 'tasks own rows'),
    ('settings', 'settings own rows'),
    ('feedback', 'feedback own rows')
),
table_status as (
  select
    'table:' || rt.table_name as check_name,
    case when c.oid is null then 'missing' else 'ok' end as status,
    coalesce(n.nspname || '.' || c.relname, 'not found') as detail
  from required_tables rt
  left join pg_namespace n
    on n.nspname = 'public'
  left join pg_class c
    on c.relname = rt.table_name
    and c.relnamespace = n.oid
),
rls_status as (
  select
    'rls:' || rt.table_name as check_name,
    case
      when c.oid is null then 'missing'
      when c.relrowsecurity then 'ok'
      else 'disabled'
    end as status,
    case
      when c.oid is null then 'table not found'
      when c.relrowsecurity then 'row level security enabled'
      else 'row level security disabled'
    end as detail
  from required_tables rt
  left join pg_namespace n
    on n.nspname = 'public'
  left join pg_class c
    on c.relname = rt.table_name
    and c.relnamespace = n.oid
),
policy_status as (
  select
    'policy:' || rp.table_name || ':' || rp.policy_name as check_name,
    case when p.policyname is null then 'missing' else 'ok' end as status,
    coalesce(p.cmd, 'policy not found') as detail
  from required_policies rp
  left join pg_policies p
    on p.schemaname = 'public'
    and p.tablename = rp.table_name
    and p.policyname = rp.policy_name
),
extension_status as (
  select
    'extension:uuid-ossp' as check_name,
    case when exists (select 1 from pg_extension where extname = 'uuid-ossp')
      then 'ok'
      else 'missing'
    end as status,
    'required for uuid_generate_v4() defaults' as detail
  union all
  select
    'extension:vector' as check_name,
    case when exists (select 1 from pg_extension where extname = 'vector')
      then 'ok'
      else 'missing'
    end as status,
    'required for pgvector document embeddings' as detail
)
select *
from extension_status
union all
select *
from table_status
union all
select *
from rls_status
union all
select *
from policy_status
order by check_name;
