"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  QrCode,
  User
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Stats & Desk", icon: LayoutDashboard },
  { href: "/admin/checkin", label: "Check-In", icon: QrCode }
] as const;

const mobileLinks = [
  { href: "/admin/dashboard", label: "Stats", icon: LayoutDashboard },
  { href: "/admin/checkin", label: "Check-In", icon: QrCode }
] as const;

export function AdminShell({ children, title, eyebrow = "Live Event Admin", action }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-svh bg-kinetic-surface font-body text-kinetic-on-surface antialiased">
      <aside className="relative z-50 hidden h-svh w-[280px] shrink-0 flex-col border-r border-kinetic-outline/30 bg-kinetic-surface-container-low lg:flex">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex items-center justify-center rounded-full bg-kinetic-primary-container/10 p-2 text-kinetic-primary">
            <LayoutDashboard className="size-5" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-tighter text-kinetic-primary">
            Viper sport
          </h1>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  active
                    ? "border border-kinetic-primary-container/20 bg-kinetic-primary-container/10 text-kinetic-primary"
                    : "text-kinetic-secondary-fixed-dim hover:bg-kinetic-surface-container-highest hover:text-kinetic-primary"
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="text-xs font-bold uppercase">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-kinetic-outline/30 p-4">
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-kinetic-secondary-fixed-dim transition-colors hover:bg-kinetic-surface-container-highest hover:text-kinetic-primary"
          >
            <LogOut className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase">Sign out</span>
          </button>
        </div>
      </aside>

      <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 shrink-0 bg-linear-to-b from-kinetic-surface-dim/80 to-transparent backdrop-blur-md lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center rounded-full p-2 text-kinetic-primary transition-opacity hover:opacity-80"
            >
              <LayoutDashboard className="size-5" aria-hidden="true" />
            </Link>
            <p className="font-display text-lg font-bold uppercase tracking-tighter text-kinetic-primary">
              Viper sport
            </p>
            <button
              type="button"
              className="relative flex items-center justify-center rounded-full p-2 text-kinetic-primary transition-opacity hover:opacity-80"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden="true" />
              <span className="absolute right-1 top-1 size-2 rounded-full border border-kinetic-surface bg-kinetic-error" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-28 lg:px-12 lg:py-8 lg:pb-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:gap-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-kinetic-primary-container">
                  {eyebrow}
                </p>
                <h2 className="font-display text-3xl font-extrabold text-kinetic-primary lg:text-5xl">
                  {title}
                </h2>
              </div>
              {action ? <div className="flex items-center gap-3">{action}</div> : null}
            </div>
            {children}
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-full border-t border-white/5 bg-kinetic-surface/90 px-4 pb-safe backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] lg:hidden">
          <div className="flex h-20 items-center justify-around">
            {mobileLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
                    active
                      ? "rounded-full bg-kinetic-primary-container/10 px-4 py-1 text-kinetic-primary shadow-[0_0_15px_rgba(227,254,149,0.3)]"
                      : "text-kinetic-secondary-fixed-dim opacity-60 hover:text-kinetic-primary"
                  }`}
                >
                  <Icon className="mb-1 size-5" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase">{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/"
              className="flex flex-col items-center justify-center text-kinetic-secondary-fixed-dim opacity-60 transition-transform hover:text-kinetic-primary active:scale-90"
            >
              <Home className="mb-1 size-5" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase">Home</span>
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex flex-col items-center justify-center text-kinetic-secondary-fixed-dim opacity-60 transition-transform hover:text-kinetic-primary active:scale-90"
            >
              <User className="mb-1 size-5" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export function AdminScanQrLink() {
  return (
    <Link
      href="/admin/checkin"
      className="clip-retro-sm flex w-full items-center justify-center gap-2 bg-[#f86d6c] px-6 py-3 text-sm font-bold uppercase tracking-wider text-kinetic-on-primary-fixed transition-all hover:opacity-90 active:scale-95 sm:w-auto lg:text-base"
    >
      <QrCode className="size-5" aria-hidden="true" />
      Scan QR
    </Link>
  );
}

export function AdminBackLink({ href = "/admin/dashboard" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-full p-2 text-kinetic-on-surface-variant transition-opacity hover:opacity-80"
      aria-label="Go back"
    >
      <ArrowLeft className="size-5" aria-hidden="true" />
    </Link>
  );
}
