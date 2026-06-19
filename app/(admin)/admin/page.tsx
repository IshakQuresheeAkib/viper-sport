import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-kinetic-surface px-4  text-kinetic-on-surface antialiased">
      <div className="kinetic-grid absolute inset-0 z-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-1/4 -top-1/4 size-[500px] rounded-full bg-kinetic/5 blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 size-[600px] rounded-full bg-kinetic-coral/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="clip-retro mb-6 flex size-16 items-center justify-center border border-white/60 bg-white/5 shadow-[0_0_20px_rgba(211,237,134,0.1)]">
            <Shield className="size-8 text-kinetic" aria-hidden="true" />
          </div>
          <h1 className="mb-2  text-4xl font-medium uppercase  text-kinetic-primary">
            ViperSport
          </h1>
          <div className="inline-flex items-center border-l-2 border-kinetic bg-white/10 px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-widest text-kinetic-on-surface-variant">
              Admin Portal
            </span>
          </div>
        </div>

        <AdminLoginForm />

        <div className="mt-8 flex flex-col items-center space-y-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
            <span className="size-2 animate-pulse rounded-full bg-kinetic-coral" />
            Secure Connection
          </p>
        </div>
      </div>
    </main>
  );
}
