import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          ViperSport Admin
        </p>
        <h1 className="mt-3 text-4xl font-black">Sign in</h1>
        <AdminLoginForm />
      </div>
    </main>
  );
}
