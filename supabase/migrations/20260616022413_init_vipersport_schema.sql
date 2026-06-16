create extension if not exists pgcrypto with schema extensions;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text unique not null default ('REG-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  qr_data text not null default '',
  sms_sent boolean not null default false,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  constraint registrations_first_name_length check (char_length(btrim(first_name)) between 2 and 50),
  constraint registrations_last_name_length check (char_length(btrim(last_name)) between 2 and 50),
  constraint registrations_phone_format check (phone ~ '^(\+?880|0)1[3-9][0-9]{8}$'),
  constraint registrations_checked_in_at_consistency check (
    (checked_in = false and checked_in_at is null)
    or checked_in = true
  )
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_registrations_phone on public.registrations(phone);
create index if not exists idx_registrations_registration_id on public.registrations(registration_id);
create index if not exists idx_registrations_checked_in on public.registrations(checked_in);

alter table public.registrations enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "admins can read admin profile" on public.admin_users;
drop policy if exists "admins can read registrations" on public.registrations;
drop policy if exists "admins can update registrations" on public.registrations;

revoke all on table public.registrations from anon, authenticated;
revoke all on table public.admin_users from anon, authenticated;

grant select, update on table public.registrations to authenticated;
grant select on table public.admin_users to authenticated;
grant all on table public.registrations to service_role;
grant all on table public.admin_users to service_role;

create policy "admins can read admin profile"
on public.admin_users
for select
to authenticated
using (id = (select auth.uid()));

create policy "admins can read registrations"
on public.registrations
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.id = (select auth.uid())
  )
);

create policy "admins can update registrations"
on public.registrations
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.id = (select auth.uid())
  )
);
