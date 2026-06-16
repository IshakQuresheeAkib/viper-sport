import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ManualSearch } from "@/components/admin/ManualSearch";
import { QRScanner } from "@/components/admin/QRScanner";
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
    <main className="min-h-svh py-8">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Gate check-in
        </p>
        <h1 className="mt-2 text-4xl font-black">Scan or search</h1>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <QRScanner />
          <ManualSearch registrations={registrations} />
        </div>
      </div>
    </main>
  );
}
