"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronDown, Circle } from "lucide-react";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { Button } from "@/components/ui/Button";
import { shouldSkipAnimation } from "@/lib/animation";

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
      id="hero"
      ref={sectionRef}
      className="relative flex h-dvh max-h-dvh min-h-dvh flex-col overflow-hidden bg-black text-white"
    >
      {/* ── Background: left solid black panel ── */}
      <div
        className="absolute inset-y-0 left-0 hidden w-1/2 bg-black lg:block"
        aria-hidden="true"
      />

      {/* ── Background: right photo panel — fills full viewport height ── */}
      <div className="absolute inset-0 z-0 lg:inset-y-0 lg:left-1/2 lg:w-1/2">
        <Image
          src="/images/home/profile.webp"
          alt="Fuad Abdul-Aziz holding a microphone in a stadium"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="hero-photo"
        />
        {/* Mobile: bottom-to-top scrim so text is readable */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent lg:hidden" />
        {/* Desktop: subtle left edge bleed into black */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-linear-to-r from-black to-transparent lg:block" />
        {/* Desktop: bottom anchor so subject stays grounded on short viewports */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-24 bg-linear-to-t from-black/40 to-transparent lg:block" />
      </div>

      {/* ── Mobile nav — absolute, sits above photo ── */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Circle className="size-5 fill-white text-white" aria-hidden="true" />
          <span className=" text-2xl font-bold  text-white">ViperSport</span>
        </div>
      </header>

      {/* ── Main content — vertically centered within remaining viewport ── */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-4 pb-14 pt-24 lg:justify-center lg:px-0 lg:pb-8 lg:pt-20">
        <div className="flex w-full flex-col lg:ml-[calc(50%-210px)] lg:w-[420px]">
          {/* Glass name card */}
          <div
            data-hero-animate
            className="hero-name-card glass-card rounded-3xl border border-white/10 p-7 shadow-2xl backdrop-blur-xl lg:p-9"
          >
            <h1 className="text-[2.75rem] font-medium uppercase text-kinetic-primary lg:text-[4rem]">
              Fuad
              <br />
              <span className="font-extrabold text-kinetic-coral">
                Abdul-Aziz
              </span>
            </h1>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-kinetic lg:text-sm">
              Founder of ViperSport
            </p>
          </div>

          {/* Social links */}
          <div data-hero-animate>
            <SocialLinks variant="hero" />
          </div>

          {/* CTA */}
          <div data-hero-animate>
            <Button variant="coral" fullWidth href="/register">
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
      <p className=" text-base text-kinetic-secondary">Scroll for more</p>
    </section>
  );
}
