import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViperSportProfile } from "@/components/shared/ViperSportProfile";
import { RegisterEventDetails } from "@/components/register/RegisterEventDetails";
import { RegisterForm } from "@/components/register/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-x-hidden bg-kinetic-charcoal px-4 py-12 font-body text-kinetic-on-surface md:px-8 lg:px-12">
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

      <header className="mb-8 mt-4 w-full max-w-6xl text-center">
        <Link href="/">
          <h1 className="font-display text-5xl font-extrabold tracking-tighter text-kinetic-primary drop-shadow-lg md:text-7xl lg:text-8xl">
            Viper sport
          </h1>
        </Link>
        <p className="mt-2 text-sm font-bold uppercase tracking-widest text-kinetic-primary-fixed-dim md:text-base">
          Live Broadcast Experience
        </p>
      </header>

      <div className="flex w-full max-w-6xl flex-col gap-8 pb-12 lg:flex-row lg:items-start lg:gap-12">
        <div className="w-full lg:w-[60%]">
          <RegisterEventDetails />
        </div>
        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-8 lg:w-[40%]">
          <ViperSportProfile />
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
