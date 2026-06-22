import { NextResponse, type NextRequest } from "next/server";
import { normalizeRegistrationId } from "@/lib/registration";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PublicRegistration } from "@/types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const registrationId = normalizeRegistrationId(id);
  const supabase = createSupabaseAdminClient();
  const registration = await supabase
    .from("registrations")
    .select("registration_id, first_name, last_name")
    .eq("registration_id", registrationId)
    .maybeSingle<PublicRegistration>();

  if (registration.error) {
    return NextResponse.json(
      { error: "Could not load registration." },
      { status: 500 },
    );
  }

  if (!registration.data) {
    return NextResponse.json(
      { error: "Registration not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(registration.data);
}
