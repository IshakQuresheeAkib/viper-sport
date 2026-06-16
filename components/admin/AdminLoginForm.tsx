"use client";

import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log('result: ', result);

    setIsSubmitting(false);

    if (result.error) {
      setError("Invalid admin credentials.");
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form className="surface mt-6 grid gap-4 rounded-md p-5" onSubmit={handleSubmit}>
      <Input
        autoComplete="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
        type="email"
        value={email}
      />
      <Input
        autoComplete="current-password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
        type="password"
        value={password}
      />
      {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
        Sign in
      </Button>
    </form>
  );
}
