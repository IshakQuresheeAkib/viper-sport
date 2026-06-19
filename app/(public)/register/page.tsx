import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViperSportProfile } from "@/components/shared/ViperSportProfile";
import { RegisterEventDetails } from "@/components/register/RegisterEventDetails";
import { RegisterForm } from "@/components/register/RegisterForm";
import { RegistrationClosed } from "@/components/register/RegistrationClosed";
import { isAuthenticatedAdmin } from "@/lib/auth/admin";
import { isRegistrationClosed } from "@/lib/registration";

export const metadata: Metadata = {
  title: "Register",
};

export default async function RegisterPage() {
  const closed = isRegistrationClosed();
  const isAdmin = closed ? await isAuthenticatedAdmin() : false;

  if (closed && !isAdmin) {
    return <RegistrationClosed />;
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-x-hidden bg-kinetic-charcoal px-4 py-12  text-kinetic-on-surface md:px-8 lg:px-12">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/home/profile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-kinetic-charcoal/60 via-kinetic-charcoal/90 to-kinetic-charcoal" />
      </div>

      <header className="mb-6 mt-2 w-full max-w-6xl text-center lg:mb-8 lg:mt-4">
        <Link href="/">
          <h1 className="font-display text-4xl font-medium  text-kinetic-primary drop-shadow-lg md:text-6xl lg:text-7xl">
            ViperSport
          </h1>
        </Link>
        <p className="mt-2 text-sm font-bold uppercase tracking-widest text-kinetic-primary-fixed-dim md:text-base">
          Live Broadcast Experience
        </p>
      </header>

      {closed && isAdmin ? (
        <div className="mb-6 w-full max-w-6xl rounded-lg border border-kinetic-primary-container/30 bg-kinetic-primary-container/10 px-4 py-3 text-center text-sm text-kinetic-primary-container">
          Admin access — registration is closed to the public.
        </div>
      ) : null}

      <div className="flex w-full max-w-6xl flex-col gap-8 pb-12 lg:flex-row lg:items-start lg:gap-12">
        <div className="order-2 w-full lg:order-1 lg:w-[60%]">
          <RegisterEventDetails />
        </div>
        <div className="order-1 flex w-full flex-col gap-6 lg:sticky lg:top-8 lg:order-2 lg:w-[40%]">
          <RegisterForm />
          <div className="lg:order-2">
            <ViperSportProfile />
          </div>
        </div>
      </div>
    </main>
  );
}
