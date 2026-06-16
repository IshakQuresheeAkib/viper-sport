import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminScanQrLink, AdminShell } from "@/components/admin/AdminShell";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";
import { StatsCards } from "@/components/admin/StatsCards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Registration } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard"
};

async function getRegistrations() {
  const supabase = await createSupabaseServerClient();
  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    redirect("/admin");
  }

  const result = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Registration[]>();

  if (result.error) {
    throw new Error("Could not load registrations");
  }

  return result.data;
}

export default async function AdminDashboardPage() {
  const registrations = await getRegistrations();

  return (
    <AdminShell title="Check-In Desk" action={<AdminScanQrLink />}>
      <StatsCards registrations={registrations} />
      <RegistrationsTable registrations={registrations} />
    </AdminShell>
  );
}
