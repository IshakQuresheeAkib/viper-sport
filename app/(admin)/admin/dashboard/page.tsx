import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
    <main className="min-h-svh py-8">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Admin dashboard
        </p>
        <h1 className="mt-2 text-4xl font-black">Registrations</h1>
        <StatsCards registrations={registrations} />
        <RegistrationsTable registrations={registrations} />
      </div>
    </main>
  );
}
