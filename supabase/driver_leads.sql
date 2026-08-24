-- Driver leads captured by the /for-drivers gate before driver services unlock.
-- Run this once in the Supabase SQL editor.
--
-- Already ran an earlier version without the truck number? Run just this:
--   alter table public.driver_leads add column if not exists truck_number text;

create table if not exists public.driver_leads (
  id         bigint generated always as identity primary key,
  name       text        not null,
  phone      text        not null,
  email      text,
  truck_number text,
  locale     text,
  created_at timestamptz not null default now()
);

-- Leads are written by the server (service-role key) via /api/driver-leads and
-- read from the Supabase dashboard, so no anon access is granted. RLS on with
-- zero policies blocks the public anon key outright; the service role bypasses it.
alter table public.driver_leads enable row level security;

-- Explicit privileges, so this works whether or not the project is set to
-- "automatically expose new tables". Only the server-side service_role gets
-- anything; the public anon key and logged-in users get nothing at all.
revoke all on table public.driver_leads from anon, authenticated;
grant select, insert on table public.driver_leads to service_role;

-- Newest-first listing in the dashboard.
create index if not exists driver_leads_created_at_idx
  on public.driver_leads (created_at desc);

-- Handy for spotting repeat signups from the same number.
create index if not exists driver_leads_phone_idx
  on public.driver_leads (phone);
