-- Create registrations table
create table registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text unique not null default ('REG-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  qr_data text not null,
  sms_sent boolean not null default false,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

-- Create admin_users table
create table admin_users (
  id uuid primary key references auth.users(id),
  email text not null,
  created_at timestamptz not null default now()
);

-- Create indexes for registrations
create index idx_registrations_phone on registrations(phone);
create index idx_registrations_registration_id on registrations(registration_id);
create index idx_registrations_checked_in on registrations(checked_in);

-- Enable RLS on registrations
alter table registrations enable row level security;

-- RLS Policies for registrations
-- Allow public insert (registration form submission)
create policy "allow_public_insert" on registrations
  for insert
  with check (true);

-- Allow authenticated users (admin) full access
create policy "allow_admin_all" on registrations
  for all
  to authenticated
  using (true)
  with check (true);

-- Enable RLS on admin_users
alter table admin_users enable row level security;

-- RLS Policies for admin_users
-- Allow authenticated users to read admin_users
create policy "allow_admin_read" on admin_users
  for select
  to authenticated
  using (true);
