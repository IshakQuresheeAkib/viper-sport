import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { registerSchema } from "@/lib/validations/register.schema";
import type { RegisterResponse, Registration } from "@/types";

const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const history = requestLog
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
    return NextResponse.json({ error: "Too many attempts. Try again soon." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
  }

  const supabase = createSupabaseAdminClient();
  const existing = await supabase
    .from("registrations")
    .select("registration_id, first_name, last_name")
    .eq("phone", parsed.data.phone)
    .maybeSingle<Pick<Registration, "registration_id" | "first_name" | "last_name">>();

  if (existing.error) {
    return NextResponse.json({ error: "Could not check registration." }, { status: 500 });
  }

  if (existing.data) {
    const response: RegisterResponse = {
      ...existing.data,
      already_registered: true
    };
    return NextResponse.json(response);
  }

  const inserted = await supabase
    .from("registrations")
    .insert({
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      phone: parsed.data.phone,
      qr_data: ""
    })
    .select("registration_id, first_name, last_name")
    .single<Pick<Registration, "registration_id" | "first_name" | "last_name">>();

  if (inserted.error) {
    return NextResponse.json({ error: "Could not complete registration." }, { status: 500 });
  }

  const response: RegisterResponse = {
    ...inserted.data,
    already_registered: false
  };

  return NextResponse.json(response);
}
