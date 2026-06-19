"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Circle } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { homeNavLinks, homeScrollSpySectionIds } from "@/lib/home-nav";
import type { HomeSectionId } from "@/lib/home-nav";
import { shouldSkipAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";

export function DesktopNavbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const linkRefs = useRef<Map<HomeSectionId, HTMLAnchorElement>>(new Map());
  const activeSection = useActiveSection({
    sectionIds: homeScrollSpySectionIds,
    defaultSection: "hero",
  });
  const [isCompact, setIsCompact] = useState(false);

  const repositionIndicator = useCallback(() => {
    const indicator = indicatorRef.current;
    const activeLink = linkRefs.current.get(activeSection);
    if (!indicator || !activeLink) return;

    const skipMotion = shouldSkipAnimation();
    const { offsetLeft, offsetWidth } = activeLink;

    if (skipMotion) {
      gsap.set(indicator, { x: offsetLeft, width: offsetWidth, opacity: 1 });
      return;
    }

    gsap.to(indicator, {
      x: offsetLeft,
      width: offsetWidth,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [activeSection]);

  useEffect(() => {
    const nav = navRef.current;
    const shell = shellRef.current;
    if (!nav || !shell) return;

    const skipMotion = shouldSkipAnimation();

    if (!skipMotion) {
      const animatedItems = nav.querySelectorAll("[data-nav-animate]");
      const ctx = gsap.context(() => {
        gsap.set(animatedItems, {
          opacity: 0,
          y: -16,
          willChange: "transform",
        });
        gsap.to(animatedItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.15,
        });

        gsap.fromTo(
          shell,
          { scale: 0.96, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.4)",
            delay: 0.05,
          },
        );
      }, nav);

      return () => ctx.revert();
    }

    gsap.set(nav.querySelectorAll("[data-nav-animate]"), { opacity: 1, y: 0 });
    gsap.set(shell, { opacity: 1, scale: 1 });
  }, []);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    repositionIndicator();
  }, [repositionIndicator, isCompact]);

  useEffect(() => {
    window.addEventListener("resize", repositionIndicator);
    return () => window.removeEventListener("resize", repositionIndicator);
  }, [repositionIndicator]);

  const handleLinkHover = (linkId: HomeSectionId, entering: boolean) => {
    if (shouldSkipAnimation()) return;

    const link = linkRefs.current.get(linkId);
    if (!link) return;

    gsap.to(link, {
      y: entering ? -2 : 0,
      duration: 0.22,
      ease: "power2.out",
    });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-6 pt-5 lg:block"
    >
      <div
        ref={shellRef}
        data-nav-animate
        className={cn(
          "pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-[box-shadow,background-color,border-color,padding] duration-300",
          "clip-retro-sm border border-white/10 bg-kinetic-surface-container/75 backdrop-blur-xl",
          isCompact ? "py-2.5" : "py-3.5",
          isCompact
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_24px_rgba(211,237,134,0.12)]"
            : "shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
        )}
      >
        <Link
          href="#hero"
          data-nav-animate
          className="group flex shrink-0 cursor-pointer items-center gap-2.5"
        >
          <span className="relative flex size-5 items-center justify-center">
            <Circle
              className="size-5 fill-kinetic-primary-container text-kinetic-primary-container transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 rounded-full bg-kinetic-primary-container/40 blur-sm motion-safe:animate-pulse"
              aria-hidden="true"
            />
          </span>
          <span className=" text-xl font-bold  text-white">
            Viper<span className="text-kinetic-primary-container">Sport</span>
          </span>
        </Link>

        <div data-nav-animate className="relative flex items-center gap-0.5">
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-kinetic-primary-container opacity-0 shadow-[0_0_12px_rgba(211,237,134,0.6)]"
            style={{ width: 0 }}
          />

          {homeNavLinks.map((link) => {
            const isActive = activeSection === link.sectionId;

            return (
              <Link
                key={link.sectionId}
                ref={(node) => {
                  if (node) linkRefs.current.set(link.sectionId, node);
                }}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onMouseEnter={() => handleLinkHover(link.sectionId, true)}
                onMouseLeave={() => handleLinkHover(link.sectionId, false)}
                className={cn(
                  "relative cursor-pointer px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kinetic-primary-container",
                  isActive
                    ? "text-kinetic-primary-container"
                    : "text-white/55 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div data-nav-animate className="flex shrink-0 items-center">
          <Link
            href="/register"
            className="retro-btn clip-retro-sm inline-flex cursor-pointer items-center gap-1.5 bg-kinetic-primary-container px-4 py-2  text-xs font-bold uppercase text-kinetic-on-primary-container transition-all duration-200 hover:shadow-[0_0_18px_rgba(211,237,134,0.45)]"
          >
            Register
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
