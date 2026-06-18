"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Badge, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KineticInput } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/register.schema";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import type { RegisterResponse } from "@/types";

interface RegisterFormProps {
  variant?: "simple" | "card";
}

export function RegisterForm({ variant = "card" }: RegisterFormProps) {
  const router = useRouter();
  const setRegistration = useRegistrationStore(
    (state) => state.setRegistration,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      const message =
        payload?.error ?? "Registration failed. Please try again.";

      if (response.status === 409) {
        toast.error(message);
        return;
      }

      setFormError(message);
      return;
    }

    const payload = (await response.json()) as RegisterResponse;
    setRegistration({
      registrationId: payload.registration_id,
      firstName: payload.first_name,
      lastName: payload.last_name,
    });
    router.push(
      `/register/success?id=${encodeURIComponent(payload.registration_id)}`,
    );
  }

  const formContent = (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <KineticInput
        id="first_name"
        label="First Name"
        icon={<User className="size-5" />}
        error={errors.first_name?.message}
        autoComplete="given-name"
        placeholder="Enter your first name"
        {...register("first_name")}
      />

      <KineticInput
        id="last_name"
        label="Last Name"
        icon={<Badge className="size-5" />}
        error={errors.last_name?.message}
        autoComplete="family-name"
        placeholder="Enter your last name"
        {...register("last_name")}
      />

      <KineticInput
        id="phone"
        label="Phone Number"
        icon={<Phone className="size-5" />}
        error={errors.phone?.message}
        type="tel"
        autoComplete="tel"
        placeholder="01XXXXXXXX"
        {...register("phone")}
      />

      {formError ? (
        <p role="alert" className="text-sm font-semibold text-kinetic-error">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        className="mt-3 py-4 text-xl md:text-2xl"
      >
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
