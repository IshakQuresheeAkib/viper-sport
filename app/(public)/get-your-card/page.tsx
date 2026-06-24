import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GetYourCardFlow } from "@/components/get-your-card/GetYourCardFlow";
import { ViperSportLogo } from "@/components/shared/ViperSportLogo";

export const metadata: Metadata = {
  title: "Get Your Card",
};

export default function GetYourCardPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-x-hidden bg-kinetic-charcoal px-4 py-12  text-kinetic-on-surface md:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/home/profile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-kinetic-charcoal/70 via-kinetic-charcoal/95 to-kinetic-charcoal" />
      </div>

      <header className="relative z-10 mb-8 text-center">
        <Link href="/" className="inline-flex justify-center">
          <h1 className="sr-only">ViperSport</h1>
          <ViperSportLogo size="lg" />
        </Link>
      </header>

      <GetYourCardFlow />
    </main>
  );
}
