import Link from "next/link";
import { BarChart3, Calendar, Home, User } from "lucide-react";

const tabs = [
  { href: "#", label: "Home", icon: Home, active: true },
  { href: "#stats", label: "Stats", icon: BarChart3, active: false },
  { href: "#events", label: "Events", icon: Calendar, active: false },
  { href: "#about", label: "Profile", icon: User, active: false }
] as const;

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around rounded-t-full border-t border-white/5 bg-kinetic-surface/90 px-4 pb-safe backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
              tab.active
                ? "rounded-full bg-kinetic-primary-container/10 px-4 py-1 text-kinetic-primary shadow-[0_0_15px_rgba(227,254,149,0.3)]"
                : "text-kinetic-secondary-fixed-dim opacity-60 hover:text-kinetic-primary"
            }`}
          >
            <Icon className="mb-1 size-5" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
