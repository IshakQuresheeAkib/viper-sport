"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Bell, Circle } from "lucide-react";
import { shouldSkipAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#", label: "Home", sectionId: "hero" },
  { href: "#stats", label: "Stats", sectionId: "stats" },
  { href: "#events", label: "Events", sectionId: "events" },
  { href: "#about", label: "Profile", sectionId: "about" },
] as const;

type NavLinkId = (typeof navLinks)[number]["sectionId"];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DesktopNavbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const linkRefs = useRef<Map<NavLinkId, HTMLAnchorElement>>(new Map());
  const [activeSection, setActiveSection] = useState<NavLinkId>("hero");
  const [isCompact, setIsCompact] = useState(false);

  const repositionIndicator = useCallback(() => {
    const indicator = indicatorRef.current;
    const activeLink = linkRefs.current.get(activeSection);
    if (!indicator || !activeLink) return;

    const skipMotion = shouldSkipAnimation() || prefersReducedMotion();
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

    const skipMotion = shouldSkipAnimation() || prefersReducedMotion();

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
    const sectionIds: NavLinkId[] = ["hero", "stats", "events", "about"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as NavLinkId);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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

  const handleLinkHover = (linkId: NavLinkId, entering: boolean) => {
    if (shouldSkipAnimation() || prefersReducedMotion()) return;

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
          "pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 transition-[box-shadow,background-color,border-color,padding] duration-300",
          "clip-retro-sm border border-white/10 bg-kinetic-surface-container/75 backdrop-blur-xl",
          isCompact ? "py-2.5" : "py-3.5",
          isCompact
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.55),0_0_24px_rgba(211,237,134,0.12)]"
            : "shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
        )}
      >
        <Link
          href="#"
          data-nav-animate
          className="group flex shrink-0 items-center gap-2.5 cursor-pointer"
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
          <span className="font-display text-xl font-bold tracking-tighter text-white">
            Viper<span className="text-kinetic-primary-container">Sport</span>
          </span>
        </Link>

        <div data-nav-animate className="relative flex items-center gap-1">
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-kinetic-primary-container opacity-0 shadow-[0_0_12px_rgba(211,237,134,0.6)]"
            style={{ width: 0 }}
          />

          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;

            return (
              <Link
                key={link.label}
                ref={(node) => {
                  if (node) linkRefs.current.set(link.sectionId, node);
                }}
                href={link.href}
                onMouseEnter={() => handleLinkHover(link.sectionId, true)}
                onMouseLeave={() => handleLinkHover(link.sectionId, false)}
                className={cn(
                  "relative cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200",
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

        <div data-nav-animate className="flex shrink-0 items-center gap-3">
          <Link
            href="/register"
            className="retro-btn clip-retro-sm inline-flex cursor-pointer items-center gap-1.5 bg-kinetic-primary-container px-4 py-2 font-display text-xs font-bold uppercase text-kinetic-on-primary-container transition-all duration-200 hover:shadow-[0_0_18px_rgba(211,237,134,0.45)]"
          >
            Register
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            className="glass-card cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-white/10 hover:shadow-[0_0_14px_rgba(211,237,134,0.25)]"
          >
            <Bell className="size-4 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
