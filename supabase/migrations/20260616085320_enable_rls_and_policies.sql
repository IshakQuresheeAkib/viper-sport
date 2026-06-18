-- This migration was originally created with duplicate CREATE TABLE statements
-- (without IF NOT EXISTS) that would fail when applied after the init migration.
-- It has been replaced with the correct idempotent form below.

-- Ensure RLS is enabled on the registrations table.
-- The init migration contained ENABLE ROW LEVEL SECURITY but this was
-- inadvertently disabled; this migration re-enforces it.
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- The following policies are already created by the init migration:
--   admins can read registrations   (SELECT  for authenticated users in admin_users)
--   admins can update registrations (UPDATE  for authenticated users in admin_users)
--   admins can read admin profile   (SELECT  for authenticated users on their own row)
--
-- Public registration inserts are handled by the service_role client in the
-- API route, which bypasses RLS entirely, so no anon INSERT policy is needed.
