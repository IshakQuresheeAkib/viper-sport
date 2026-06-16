import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkInSchema } from "@/lib/validations/register.schema";
import type { CheckInResponse, Registration } from "@/types";

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = checkInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration ID." }, { status: 422 });
  }

  const existing = await supabase
    .from("registrations")
    .select("checked_in, checked_in_at")
    .eq("registration_id", parsed.data.registration_id)
    .maybeSingle<Pick<Registration, "checked_in" | "checked_in_at">>();

  if (existing.error) {
    return NextResponse.json({ error: "Could not load registration." }, { status: 500 });
  }

  if (!existing.data) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  if (existing.data.checked_in && existing.data.checked_in_at) {
    const response: CheckInResponse = {
      success: true,
      already_checked_in: true,
      checked_in_at: existing.data.checked_in_at
    };
    return NextResponse.json(response);
  }

  const checkedInAt = new Date().toISOString();
  const updated = await supabase
    .from("registrations")
    .update({
      checked_in: true,
      checked_in_at: checkedInAt
    })
    .eq("registration_id", parsed.data.registration_id);

  if (updated.error) {
    return NextResponse.json({ error: "Could not check in registration." }, { status: 500 });
  }

  const response: CheckInResponse = {
    success: true,
    already_checked_in: false,
    checked_in_at: checkedInAt
  };

  return NextResponse.json(response);
}
