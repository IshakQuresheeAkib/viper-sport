"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Badge, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/lib/validations/register.schema";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import type { RegisterResponse } from "@/types";

interface RegisterFormProps {
  variant?: "simple" | "card";
}

export function RegisterForm({ variant = "card" }: RegisterFormProps) {
  const router = useRouter();
  const setRegistration = useRegistrationStore((state) => state.setRegistration);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: ""
    }
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setFormError(payload?.error ?? "Registration failed. Please try again.");
      return;
    }

    const payload = (await response.json()) as RegisterResponse;
    setRegistration({
      registrationId: payload.registration_id,
      firstName: payload.first_name,
      lastName: payload.last_name
    });
    router.push(`/register/success?id=${encodeURIComponent(payload.registration_id)}`);
  }

  const formContent = (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-bold uppercase text-kinetic-on-surface-variant"
          htmlFor="first_name"
        >
          First Name
        </label>
        <div className="glass-input flex h-12 items-center rounded-lg px-3 md:h-14 md:px-4">
          <User className="mr-3 size-5 text-kinetic-secondary" aria-hidden="true" />
          <input
            id="first_name"
            autoComplete="given-name"
            placeholder="Enter your first name"
            className="w-full border-none bg-transparent p-0 text-base text-kinetic-on-surface outline-none placeholder:text-kinetic-secondary/50 focus:ring-0"
            {...register("first_name")}
          />
        </div>
        {errors.first_name ? (
          <p className="text-sm font-semibold text-kinetic-error">{errors.first_name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-bold uppercase text-kinetic-on-surface-variant"
          htmlFor="last_name"
        >
          Last Name
        </label>
        <div className="glass-input flex h-12 items-center rounded-lg px-3 md:h-14 md:px-4">
          <Badge className="mr-3 size-5 text-kinetic-secondary" aria-hidden="true" />
          <input
            id="last_name"
            autoComplete="family-name"
            placeholder="Enter your last name"
            className="w-full border-none bg-transparent p-0 text-base text-kinetic-on-surface outline-none placeholder:text-kinetic-secondary/50 focus:ring-0"
            {...register("last_name")}
          />
        </div>
        {errors.last_name ? (
          <p className="text-sm font-semibold text-kinetic-error">{errors.last_name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-bold uppercase text-kinetic-on-surface-variant"
          htmlFor="phone"
        >
          Phone Number
        </label>
        <div className="glass-input flex h-12 items-center rounded-lg px-3 md:h-14 md:px-4">
          <Phone className="mr-3 size-5 text-kinetic-secondary" aria-hidden="true" />
          <input
            id="phone"
            autoComplete="tel"
            placeholder="01XXXXXXXX"
            className="w-full border-none bg-transparent p-0 text-base text-kinetic-on-surface outline-none placeholder:text-kinetic-secondary/50 focus:ring-0"
            {...register("phone")}
          />
        </div>
        {errors.phone ? (
          <p className="text-sm font-semibold text-kinetic-error">{errors.phone.message}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="text-sm font-semibold text-kinetic-error">{formError}</p>
      ) : null}

      <Button type="submit" fullWidth loading={isSubmitting} className="mt-3 py-4 text-xl md:text-2xl">
        Register Now
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </form>
  );

  if (variant === "simple") {
    return (
      <section className="w-full max-w-md rounded-xl border border-white/5 bg-kinetic-surface-variant/30 p-6 shadow-2xl backdrop-blur-md">
        {formContent}
      </section>
    );
  }

  return (
    <section className="kinetic-glass-card rounded-xl p-6 sm:p-8 md:p-10">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="font-display text-2xl font-bold text-kinetic-primary md:text-3xl">
          Secure Your Spot
        </h2>
        <p className="mt-2 text-sm text-kinetic-on-surface-variant md:text-base">
          Register for exclusive access
        </p>
      </div>
      {formContent}
    </section>
  );
}
