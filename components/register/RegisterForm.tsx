"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema, type RegisterInput } from "@/lib/validations/register.schema";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import type { RegisterResponse } from "@/types";

export function RegisterForm() {
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

  return (
    <form className="surface grid gap-5 rounded-md p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="first_name">
          First name
        </label>
        <Input id="first_name" autoComplete="given-name" {...register("first_name")} />
        {errors.first_name ? (
          <p className="text-sm font-semibold text-[#b42318]">{errors.first_name.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="last_name">
          Last name
        </label>
        <Input id="last_name" autoComplete="family-name" {...register("last_name")} />
        {errors.last_name ? (
          <p className="text-sm font-semibold text-[#b42318]">{errors.last_name.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="phone">
          Bangladesh phone number
        </label>
        <Input id="phone" autoComplete="tel" placeholder="017XXXXXXXX" {...register("phone")} />
        {errors.phone ? (
          <p className="text-sm font-semibold text-[#b42318]">{errors.phone.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm font-semibold text-[#b42318]">{formError}</p> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
        Complete registration
      </Button>
    </form>
  );
}
