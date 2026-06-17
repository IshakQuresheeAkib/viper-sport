"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Bell, ChevronDown, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { shouldSkipAnimation } from "@/lib/animation";

const navLinks = [
  { href: "#", label: "Home", active: true },
  { href: "#stats", label: "Stats", active: false },
  { href: "#events", label: "Events", active: false },
  { href: "#about", label: "Profile", active: false },
] as const;

const socialLinks = [
  { href: "https://www.tiktok.com/", label: "TT", ariaLabel: "TikTok" },
  { href: "https://www.instagram.com/", label: "IG", ariaLabel: "Instagram" },
  { href: "https://www.youtube.com/", label: "YT", ariaLabel: "YouTube" },
] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldSkipAnimation()) return;

    const animatedItems = section.querySelectorAll("[data-hero-animate]");
    const ctx = gsap.context(() => {
      gsap.set(animatedItems, { opacity: 0, y: 20, willChange: "transform" });
      gsap.to(animatedItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[85vh] flex-col overflow-hidden bg-black text-white"
    >
      {/* ── Background: left solid black panel ── */}
      <div
        className="absolute inset-y-0 left-0 hidden w-1/2 bg-black lg:block"
        aria-hidden="true"
      />

      {/* ── Background: right photo panel ── */}
      <div className="absolute inset-0 z-0 lg:left-1/2 lg:w-1/2">
        <Image
          src="/images/home/fuad-hero.jpg"
          alt="Fuad Abdul-Aziz holding a microphone in a stadium"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top lg:object-center"
        />
        {/* Mobile: bottom-to-top scrim so text is readable */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent lg:hidden" />
        {/* Desktop: subtle left edge bleed into black */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-linear-to-r from-black to-transparent lg:block" />
      </div>

      {/* ── Desktop nav — in flex flow (left half only), never overlaps content ── */}
      <header
        data-hero-animate
        className="relative z-20 hidden w-1/2 items-center justify-between px-8 pb-2 pt-8 lg:flex"
      >
        <div className="flex items-center gap-3">
          <Circle className="size-5 fill-white text-white" aria-hidden="true" />
          <span className="font-display text-2xl font-bold tracking-tighter text-white">
            ViperSport
          </span>
        </div>
        <nav className="flex gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-wider transition-opacity ${
                link.active ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Notifications"
          className="glass-card cursor-pointer rounded-full p-2 transition-opacity hover:opacity-80"
        >
          <Bell className="size-4 text-white" />
        </button>
      </header>

      {/* ── Mobile nav — absolute, sits above photo ── */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Circle className="size-5 fill-white text-white" aria-hidden="true" />
          <span className="font-display text-2xl font-bold tracking-tighter text-white">
            ViperSport
          </span>
        </div>
      </header>

      {/* ── Main content — flex-1 centers card in the remaining height ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-14 pt-24 lg:justify-center lg:px-0 lg:pb-0 lg:pt-0">
        {/*
          On desktop: ml-[calc(50%-210px)] centers the 420 px card exactly at the
          left/right boundary so it overlaps into the photo (as in the reference).
        */}
        <div className="flex w-full flex-col gap-5 lg:ml-[calc(50%-210px)] lg:w-[420px]">
          {/* Glass name card */}
          <div
            data-hero-animate
            className="glass-card rounded-3xl border border-white/10 p-7 shadow-2xl backdrop-blur-xl lg:p-9"
          >
            <h1 className="font-display text-[2.75rem] font-extrabold uppercase leading-[0.88] tracking-tighter text-white lg:text-[4rem]">
              Fuad
              <br />
              <span className="text-kinetic-primary-container">
                Abdul&#8209;Aziz
              </span>
            </h1>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-kinetic-primary-container lg:text-sm">
              Founder of ViperSport
            </p>
          </div>

          {/* Social links */}
          <div data-hero-animate className="flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.ariaLabel}
                className="glass-card flex size-11 items-center justify-center rounded-full text-xs font-bold uppercase text-white transition-colors hover:bg-kinetic-primary-container hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div data-hero-animate>
            <Button variant="lime" fullWidth href="/register">
              Register The Event
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroScrollHint() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 text-center opacity-50">
      <ChevronDown
        className="mx-auto mb-4 size-10 text-kinetic-secondary"
        aria-hidden="true"
      />
      <p className="font-body text-base text-kinetic-secondary">
        Scroll for more
      </p>
    </section>
  );
}
