"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validations/admin.schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
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
        <div className="space-y-2">
          <label
            className="block text-[11px] font-bold uppercase tracking-wider text-kinetic-outline"
            htmlFor="email"
          >
            Admin Email / Username
          </label>
          <div className="group relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-kinetic-outline-variant transition-colors group-focus-within:text-kinetic-primary-container">
              <User className="size-5" aria-hidden="true" />
            </span>
            <input
              id="email"
              autoComplete="email"
              placeholder="admin@vipersport.io"
              className="w-full border border-kinetic-outline-variant bg-kinetic-surface-container-lowest py-3 pl-12 pr-4 text-base text-kinetic-on-surface transition-all placeholder:text-kinetic-outline-variant/50 focus:border-kinetic-primary-container focus:outline-none focus:ring-1 focus:ring-kinetic-primary-container"
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p className="text-sm font-semibold text-kinetic-error">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            className="block text-[11px] font-bold uppercase tracking-wider text-kinetic-outline"
            htmlFor="password"
          >
            Password
          </label>
          <div className="group relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-kinetic-outline-variant transition-colors group-focus-within:text-kinetic-primary-container">
              <Lock className="size-5" aria-hidden="true" />
            </span>
            <input
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className="w-full border border-kinetic-outline-variant bg-kinetic-surface-container-lowest py-3 pl-12 pr-12 text-base text-kinetic-on-surface transition-all placeholder:text-kinetic-outline-variant/50 focus:border-kinetic-primary-container focus:outline-none focus:ring-1 focus:ring-kinetic-primary-container"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-kinetic-outline transition-colors hover:text-kinetic-on-surface"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="size-5" aria-hidden="true" />
              ) : (
                <EyeOff className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="text-sm font-semibold text-kinetic-error">{errors.password.message}</p>
          ) : null}
        </div>

        {errors.root ? (
          <p className="text-sm font-semibold text-kinetic-error">{errors.root.message}</p>
        ) : null}

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            variant="coral"
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
