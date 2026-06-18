import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const auth = await supabase.auth.getUser();
  return Boolean(auth.data.user);
}
