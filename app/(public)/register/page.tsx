import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/register/RegisterForm";

export const metadata: Metadata = {
  title: "Register"
};

export default function RegisterPage() {
  return (
    <main className="min-h-svh py-10">
      <div className="container">
        <Link href="/" className="text-sm font-bold text-primary">
          ViperSport
        </Link>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Event registration
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Reserve your free general entry.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Register once with your Bangladesh phone number. You will receive
              a registration ID and can show your QR code or SMS at the gate.
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
