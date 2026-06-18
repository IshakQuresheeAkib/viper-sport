import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPhoneLookupVariants, normalizePhone } from "@/lib/phone";
import { registerSchema } from "@/lib/validations/register.schema";
import type { RegisterResponse, Registration } from "@/types";

const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const history =
    requestLog
      .get(ip)
      ?.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS) ?? [];

  if (history.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, history);
    return true;
  }

  requestLog.set(ip, [...history, now]);
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again soon." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    );
  }

  const phone = normalizePhone(parsed.data.phone);
  const phoneVariants = getPhoneLookupVariants(phone);

  const supabase = createSupabaseAdminClient();
  const existing = await supabase
    .from("registrations")
    .select("registration_id, first_name, last_name")
    .in("phone", phoneVariants)
    .limit(1);

  if (existing.error) {
    return NextResponse.json(
      { error: "Could not check registration." },
      { status: 500 },
    );
  }

  if (existing.data?.[0]) {
    return NextResponse.json(
      { error: "This number is already used. Try a different number." },
      { status: 409 },
    );
  }

  const inserted = await supabase
    .from("registrations")
    .insert({
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      phone,
      qr_data: "",
    })
    .select("registration_id, first_name, last_name")
    .single<
      Pick<Registration, "registration_id" | "first_name" | "last_name">
    >();

  if (inserted.error) {
    if (inserted.error.code === "23505") {
      return NextResponse.json(
        { error: "This number is already used. Try a different number." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Could not complete registration." },
      { status: 500 },
    );
  }

  // Keep qr_data in sync with the registration_id so the column is meaningful.
  void supabase
    .from("registrations")
    .update({ qr_data: inserted.data.registration_id })
    .eq("registration_id", inserted.data.registration_id);

  const response: RegisterResponse = {
    ...inserted.data,
    already_registered: false,
  };

  return NextResponse.json(response);
}
