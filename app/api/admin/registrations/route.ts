import { NextResponse, type NextRequest } from "next/server";
import { normalizeRegistrationId } from "@/lib/registration";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Registration } from "@/types";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const registrationId = request.nextUrl.searchParams.get("registration_id");

  if (registrationId) {
    const normalized = normalizeRegistrationId(registrationId);
    const result = await supabase
      .from("registrations")
      .select("*")
      .eq("registration_id", normalized)
      .maybeSingle<Registration>();

    if (result.error) {
      return NextResponse.json(
        { error: "Could not load registration." },
        { status: 500 },
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(result.data);
  }

  const result = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Registration[]>();

  if (result.error) {
    return NextResponse.json(
      { error: "Could not load registrations." },
      { status: 500 },
    );
  }

  return NextResponse.json(result.data);
}
