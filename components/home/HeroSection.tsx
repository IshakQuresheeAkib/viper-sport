"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Bell, ChevronDown, Circle } from "lucide-react";
import { shouldSkipAnimation } from "@/lib/animation";

const navLinks = [
  { href: "#", label: "Home" },
  { href: "#stats", label: "Stats" },
  { href: "#events", label: "Events" },
  { href: "#about", label: "Profile" }
] as const;

const socialLinks = [
  { href: "https://www.tiktok.com/", label: "TT", ariaLabel: "TikTok" },
  { href: "https://www.instagram.com/", label: "IG", ariaLabel: "Instagram" },
  { href: "https://www.youtube.com/", label: "YT", ariaLabel: "YouTube" }
] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || shouldSkipAnimation()) {
      return;
    }

    const animatedItems = section.querySelectorAll("[data-hero-animate]");

    const ctx = gsap.context(() => {
      gsap.set(animatedItems, { opacity: 0, y: 20, willChange: "transform" });
      gsap.to(animatedItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85svh] overflow-hidden bg-hero-surface text-white"
    >
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <Circle className="size-6 fill-white text-white" aria-hidden="true" />
          <p className="font-display text-2xl font-bold tracking-tighter text-white">
            Viper sport
          </p>
        </div>
      </header>

      <header className="sticky top-0 z-40 hidden items-center justify-between bg-linear-to-b from-hero-surface/80 to-transparent px-4 py-3 backdrop-blur-md md:flex md:px-8">
        <div className="flex items-center gap-3">
          <Circle className="size-6 fill-white text-white" aria-hidden="true" />
          <p className="font-display text-2xl font-bold tracking-tighter text-white">FAZIZ</p>
        </div>
        <nav className="flex gap-10">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-wider ${
                index === 0 ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Notifications"
          className="glass-card rounded-full p-2 hover:bg-white/10"
        >
          <Bell className="size-5 text-white" />
        </button>
      </header>

      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/fuad-hero.jpg"
          alt="Fuad Abdul-Aziz holding a microphone in a stadium"
          fill
          priority
          sizes="100vw"
          className="hero-mask object-cover object-top opacity-90"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-hero-surface via-hero-surface/60 to-transparent" />
      </div>

      <div className="container relative z-10 flex min-h-[85svh] flex-col justify-end pb-12 pt-24">
        <div className="flex flex-col gap-6">
          <div
            data-hero-animate
            className="glass-card relative -top-6 inline-block w-fit rounded-2xl p-6 shadow-2xl"
          >
            <h1 className="font-display text-[2.75rem] font-extrabold uppercase leading-[0.9] tracking-tighter text-white sm:text-5xl lg:text-7xl">
              Fuad <br />
              <span className="text-primary">Abdul-Aziz</span>
            </h1>
            <p className="mt-3 text-base font-bold uppercase tracking-[0.2em] text-white/80">
              ViperSport Manager
            </p>
          </div>

          <div data-hero-animate className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.ariaLabel}
                className="glass-card flex size-10 items-center justify-center rounded-full text-xs font-bold uppercase hover:bg-primary hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div data-hero-animate className="mt-2">
            <Link
              href="/register"
              className="hero-glow inline-flex w-full items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-primary sm:w-auto"
            >
              Register the Event
            </Link>
          </div>
        </div>

        <div
          data-hero-animate
          className="mt-10 flex flex-col items-center gap-2 text-center text-white/50"
        >
          <ChevronDown className="size-8" aria-hidden="true" />
          <p className="text-base text-white/60">Scroll for more</p>
        </div>
      </div>
    </section>
  );
}
