import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessCard } from "@/components/register/SuccessCard";

export const metadata: Metadata = {
  title: "Registration Success"
};

export default function RegistrationSuccessPage() {
  return (
    <main className="min-h-svh py-10">
      <div className="container">
        <Suspense fallback={<p className="font-semibold">Loading registration...</p>}>
          <SuccessCard />
        </Suspense>
      </div>
    </main>
  );
}
