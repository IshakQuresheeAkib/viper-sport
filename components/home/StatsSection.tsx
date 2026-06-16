"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const stats = [
  { value: 500, suffix: "M+", label: "views across football content" },
  { value: 1.4, suffix: "M+", label: "followers in the community" },
  { value: 500, suffix: "+", label: "expected event registrations" }
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const connection = navigator as Navigator & {
      connection?: { effectiveType?: string };
    };

    if (connection.connection?.effectiveType === "2g") {
      return;
    }

    const counters = section.querySelectorAll("[data-count]");
    const ctx = gsap.context(() => {
      counters.forEach((counter) => {
        const target = Number(counter.getAttribute("data-count"));
        const data = { value: 0 };
        gsap.to(data, {
          value: target,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: undefined,
          onUpdate: () => {
            counter.textContent =
              target % 1 === 0 ? Math.round(data.value).toString() : data.value.toFixed(1);
          }
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="bg-[#1d1a1a] py-16 text-white">
      <div className="container grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border-l border-white/16 pl-6">
            <p className="text-5xl font-black">
              <span data-count={stat.value}>{stat.value}</span>
              {stat.suffix}
            </p>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-white/64">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
