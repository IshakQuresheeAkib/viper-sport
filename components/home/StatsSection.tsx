"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { shouldSkipAnimation } from "@/lib/animation";

const stats = [
  { value: 500, suffix: "M+", label: "Views", glow: true },
  { value: 1.4, suffix: "M+", label: "Followers", glow: false },
  { value: 5, suffix: "+", label: "Years Exp", glow: false },
] as const;

export function StatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || shouldSkipAnimation()) {
      return;
    }

    const counters = section.querySelectorAll("[data-count]");
    const cards = section.querySelectorAll("[data-stat-card]");

    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 30, willChange: "transform" });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power4.inOut",
        stagger: 0.3,
      });

      counters.forEach((counter) => {
        const target = Number(counter.getAttribute("data-count"));
        const data = { value: 0 };
        gsap.to(data, {
          value: target,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            counter.textContent =
              target % 1 === 0
                ? Math.round(data.value).toString()
                : data.value.toFixed(1);
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 -mt-10 w-full bg-kinetic-surface py-12 text-kinetic-on-surface lg:mt-10"
      aria-labelledby="stats-heading"
    >
      <h2 id="stats-heading" className="sr-only">
        Performance statistics
      </h2>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 md:grid-cols-3 lg:gap-6 lg:px-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            data-stat-card
            className="glass-card flex flex-col items-center justify-center rounded-xl p-6 lg:p-12 glow-border"
          >
            <p
              className=" text-[2rem] font-medium text-kinetic-primary-container lg:text-5xl"
              aria-live="polite"
            >
              <span data-count={stat.value}>{stat.value}</span>
              {stat.suffix}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-kinetic-secondary lg:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
