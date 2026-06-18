"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KineticInput } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  adminLoginSchema,
  type AdminLoginInput,
} from "@/lib/validations/admin.schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AdminLoginInput) {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.auth.signInWithPassword(values);

    if (result.error) {
      setError("root", { message: "Invalid admin credentials." });
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="relative border border-white/5 bg-kinetic-surface-container/80 p-6 shadow-2xl backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-kinetic-outline-variant to-transparent" />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <KineticInput
          id="email"
          label="Admin Email / Username"
          icon={<User className="size-5" />}
          error={errors.email?.message}
          type="email"
          autoComplete="email"
          placeholder="admin@vipersport.io"
          {...register("email")}
        />

        <KineticInput
          id="password"
          label="Password"
          icon={<Lock className="size-5" />}
          error={errors.password?.message}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />

        {errors.root ? (
          <p role="alert" className="text-sm font-semibold text-kinetic-error">
            {errors.root.message}
          </p>
        ) : null}

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            variant="lime"
            className="group relative justify-between overflow-hidden py-4 text-lg"
          >
            <span className="relative z-10 tracking-wide">
              {isSubmitting ? "Signing in..." : "Login as Admin"}
            </span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">
              <ArrowRight className="size-5" aria-hidden="true" />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
