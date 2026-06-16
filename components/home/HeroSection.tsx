import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Play, Share2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#210306] text-white">
      <Image
        src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1800&q=80"
        alt="Football crowd under stadium lights"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(33,3,6,0.92),rgba(33,3,6,0.62),rgba(33,3,6,0.22))]" />
      <div className="container relative flex min-h-[92svh] items-center py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/75">
            ViperSport Bangladesh
          </p>
          <h1 className="text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
            Fuad Abdul-Aziz
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84">
            UK-based football creator, founder of ViperSport, and host of the
            Argentina vs Austria live match show in Sylhet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-bold text-primary transition hover:bg-[#f6dedb]"
            >
              Register for the event
            </Link>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/35 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Sponsor inquiry
            </a>
          </div>
          <div className="mt-9 grid gap-3 text-sm text-white/78 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <CalendarDays size={18} /> 22 June 2026, 9:00 PM
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} /> Shahi Eidgah Maidan, Sylhet
            </span>
          </div>
          <div className="mt-8 flex gap-3">
            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              className="grid size-11 place-items-center rounded-md bg-white/10 text-white hover:bg-white/20"
            >
              <Share2 size={19} />
            </a>
            <a
              href="https://www.youtube.com/"
              aria-label="YouTube"
              className="grid size-11 place-items-center rounded-md bg-white/10 text-white hover:bg-white/20"
            >
              <Play size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
