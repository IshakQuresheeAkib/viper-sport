import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CardRegistration } from "@/types";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json(
      { error: "Registration ID is required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const registration = await supabase
    .from("registrations")
    .select("registration_id, first_name, last_name")
    .eq("registration_id", id)
    .maybeSingle<CardRegistration>();

  if (registration.error) {
    return NextResponse.json(
      { error: "Could not verify registration." },
      { status: 500 },
    );
  }

  if (!registration.data) {
    return NextResponse.json(
      { error: "Registration ID not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(registration.data);
}
