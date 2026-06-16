import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Registration } from "@/types";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const auth = await supabase.auth.getUser();

  if (!auth.data.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const result = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Registration[]>();

  if (result.error) {
    return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
