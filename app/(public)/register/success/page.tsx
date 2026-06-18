import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessCard } from "@/components/register/SuccessCard";

export const metadata: Metadata = {
  title: "Registration Success",
};

export default function RegistrationSuccessPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-kinetic-charcoal px-4 py-12 font-body text-kinetic-on-surface">
      <div className="container flex justify-center">
        <Suspense
          fallback={
            <p className="font-semibold text-kinetic-on-surface">
              Loading registration...
            </p>
          }
        >
          <SuccessCard />
        </Suspense>
      </div>
    </main>
  );
}
