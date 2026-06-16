"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Bell,
  ChevronDown,
  Circle
} from "lucide-react";
import { shouldSkipAnimation } from "@/lib/animation";

const navLinks = [
  { href: "#", label: "Home", active: true },
  { href: "#stats", label: "Stats", active: false },
  { href: "#events", label: "Events", active: false },
  { href: "#about", label: "Profile", active: false }
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
      className="relative flex min-h-[751px] items-center overflow-hidden bg-kinetic-surface pt-24 text-kinetic-on-surface lg:min-h-[85vh]"
    >
      <header className="sticky top-0 z-40 hidden w-full bg-linear-to-b from-kinetic-surface/80 to-transparent backdrop-blur-md md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
          <div className="flex items-center gap-3">
            <Circle className="size-6 fill-kinetic-primary text-kinetic-primary" aria-hidden="true" />
            <p className="font-display text-2xl font-bold tracking-tighter text-kinetic-primary">
              FAZIZ
            </p>
          </div>
          <nav className="flex gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-wider ${
                  link.active
                    ? "text-kinetic-primary"
                    : "text-kinetic-on-surface-variant hover:opacity-80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label="Notifications"
            className="glass-card rounded-full p-2 hover:opacity-80"
          >
            <Bell className="size-5 text-kinetic-primary" />
          </button>
        </div>
      </header>

      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <Circle className="size-6 fill-kinetic-primary text-kinetic-primary" aria-hidden="true" />
          <p className="font-display text-2xl font-bold tracking-tighter text-kinetic-primary">
            Viper sport
          </p>
        </div>
      </header>

      <div className="absolute inset-0 z-0 lg:left-1/2 lg:w-1/2">
        <Image
          src="/images/home/fuad-hero.jpg"
          alt="Fuad Abdul-Aziz holding a microphone in a stadium"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top opacity-90 hero-mask lg:object-center lg:[mask-image:linear-gradient(to_left,black_70%,transparent_100%)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-kinetic-surface via-kinetic-surface/60 to-transparent lg:bg-linear-to-r lg:from-kinetic-surface lg:via-transparent lg:to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-[751px] w-full max-w-7xl flex-col justify-end px-4 pb-12 lg:h-auto lg:justify-center lg:px-8 lg:pb-0">
        <div className="flex flex-col gap-6 lg:w-1/2">
          <div
            data-hero-animate
            className="glass-card relative -top-6 inline-block w-fit rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl lg:static"
          >
            <h1 className="font-display text-[3rem] font-extrabold uppercase leading-[0.9] tracking-tighter text-kinetic-primary lg:text-[4.5rem]">
              Fuad <br />
              <span className="text-kinetic-primary-container drop-shadow-md">
                Abdul-Aziz
              </span>
            </h1>
            <p className="mt-3 text-base font-bold uppercase tracking-widest text-kinetic-primary-container">
              ViperSport Manager
            </p>
          </div>

          <div data-hero-animate className="flex gap-4 lg:mt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.ariaLabel}
                className="glass-card flex size-10 items-center justify-center rounded-full text-xs font-bold uppercase transition-colors hover:bg-kinetic-primary-container hover:text-kinetic-surface lg:size-12"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div data-hero-animate className="mt-4 lg:mt-8">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-lg bg-kinetic-primary-container px-8 py-4 text-sm font-bold uppercase tracking-wide text-kinetic-on-primary-container shadow-[0_0_20px_rgba(211,237,134,0.4)] transition-all hover:bg-white active:scale-95 sm:w-auto"
            >
              Register the Event
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroScrollHint() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 text-center opacity-50">
      <ChevronDown className="mx-auto mb-4 size-10 text-kinetic-secondary" aria-hidden="true" />
      <p className="font-body text-base text-kinetic-secondary">Scroll for more</p>
    </section>
  );
}
