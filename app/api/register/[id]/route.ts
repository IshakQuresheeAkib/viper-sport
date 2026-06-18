import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RegistrationLookup } from "@/types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createSupabaseAdminClient();
  const registration = await supabase
    .from("registrations")
    .select("id, registration_id, first_name, last_name, phone, created_at, checked_in")
    .eq("registration_id", id)
    .maybeSingle<RegistrationLookup>();

  if (registration.error) {
    return NextResponse.json({ error: "Could not load registration." }, { status: 500 });
  }

  if (!registration.data) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  return NextResponse.json(registration.data);
}
