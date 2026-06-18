"use client";

import Link from "next/link";
import { Calendar, Home, Mail, User } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { homeNavLinks, homeScrollSpySectionIds } from "@/lib/home-nav";
import { cn } from "@/lib/utils";

const tabIcons = {
  hero: Home,
  events: Calendar,
  about: User,
  contact: Mail,
} as const;

export function MobileBottomNav() {
  const activeSection = useActiveSection({
    sectionIds: homeScrollSpySectionIds,
    defaultSection: "hero",
  });

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around rounded-t-full border-t border-white/5 bg-kinetic-surface/90 px-2 pb-safe backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:hidden"
    >
      {homeNavLinks.map((tab) => {
        const Icon = tabIcons[tab.sectionId];
        const isActive = activeSection === tab.sectionId;

        return (
          <Link
            key={tab.sectionId}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center transition-transform active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kinetic-primary-container",
              isActive
                ? "rounded-full bg-kinetic-primary-container/10 px-2 py-1 text-kinetic-primary shadow-[0_0_15px_rgba(227,254,149,0.3)]"
                : "text-kinetic-secondary-fixed-dim opacity-60 hover:text-kinetic-primary",
            )}
          >
            <Icon className="mb-1 size-5 shrink-0" aria-hidden="true" />
            <span className="truncate text-[10px] font-bold uppercase">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
