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
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
    >
      <div
        className={cn(
          "relative flex h-17 items-center justify-around rounded-t-4xl px-1 pb-safe",
          "border border-b-0 border-white/8 bg-kinetic-surface-container/95 backdrop-blur-xl",
          "shadow-[0_-8px_32px_rgba(0,0,0,0.55),0_-2px_20px_rgba(211,237,134,0.08)]",
          "before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px",
          "before:bg-linear-to-r before:from-transparent before:via-kinetic-primary-container/50 before:to-transparent",
        )}
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
                "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5",
                "transition-colors duration-200 motion-safe:transition-transform motion-safe:active:scale-95",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kinetic-primary-container",
                isActive
                  ? "glow-border rounded-full px-3 py-2 text-kinetic-primary"
                  : "px-2 py-2 text-white/50 hover:text-white/75",
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  isActive ? "text-kinetic-primary-fixed-dim" : "text-white/50",
                )}
                aria-hidden="true"
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span
                className={cn(
                  "truncate text-[10px] font-bold uppercase tracking-wide",
                  isActive ? "text-kinetic-primary-fixed-dim" : "text-current",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
