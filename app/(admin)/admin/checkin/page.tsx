import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminBackLink, AdminShell } from "@/components/admin/AdminShell";
import { CheckInExperience } from "@/components/admin/CheckInExperience";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Registration } from "@/types";

export const metadata: Metadata = {
  title: "Check-in"
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

export default async function AdminCheckInPage() {
  const registrations = await getRegistrations();

  return (
    <AdminShell
      title="Check-In"
      eyebrow="Access Control"
      action={<AdminBackLink href="/admin/dashboard" />}
    >
      <CheckInExperience registrations={registrations} />
    </AdminShell>
  );
}
