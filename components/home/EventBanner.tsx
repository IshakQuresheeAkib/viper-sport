import Link from "next/link";
import { Calendar } from "lucide-react";

export function EventBanner() {
  return (
    <section id="events" className="w-full bg-kinetic-surface py-6 text-kinetic-on-surface">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="glass-card relative flex w-full flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border-t-2 border-kinetic-error bg-linear-to-r from-kinetic-surface-container-high to-kinetic-surface-container p-6 md:flex-row md:items-center md:p-10">
          <div className="pointer-events-none absolute top-0 right-0 size-32 rounded-bl-full bg-kinetic-error/10 blur-2xl lg:size-64" />
          <div className="relative z-10 flex-1">
            <div className="mb-3 flex items-center gap-2 lg:mb-4">
              <span className="size-2 animate-pulse rounded-full bg-kinetic-error lg:size-3" />
              <span className="text-xs font-bold uppercase tracking-widest text-kinetic-error lg:text-base">
                Upcoming Live Event
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-kinetic-primary lg:mb-4 lg:text-[2.5rem]">
              Argentina vs Austria{" "}
              <br className="hidden lg:block" />
              Live Show
            </h2>
            <p className="mt-2 flex items-center gap-2 text-base text-kinetic-secondary lg:text-lg">
              <Calendar className="size-4 lg:size-5" aria-hidden="true" />
              22 June 2026 | Sylhet, Bangladesh
            </p>
          </div>
          <div className="relative z-10 mt-4 w-full md:mt-0 md:w-auto">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-lg bg-kinetic-error px-8 py-4 text-sm font-bold uppercase tracking-wide text-kinetic-on-error-container transition-all hover:bg-white active:scale-95 md:w-auto"
            >
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
