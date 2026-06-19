import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EventBanner() {
  return (
    <section
      id="events"
      className="w-full bg-kinetic-surface py-6 text-kinetic-on-surface"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="glass-card relative flex w-full flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border-t-2 border-kinetic-coral bg-linear-to-r from-black/10 to-kinetic-surface-container p-6 md:flex-row md:items-center md:p-10">
          <div className="pointer-events-none absolute top-0 right-0 size-32 rounded-bl-full bg-kinetic-coral/10 blur-2xl lg:size-64" />
          <div className="relative z-10 flex-1">
            <div className="mb-3 flex items-center gap-2 lg:mb-4">
              <span className="size-2 animate-pulse rounded-full bg-kinetic-coral lg:size-3" />
              <span className="text-xs font-bold uppercase tracking-widest text-kinetic-coral lg:text-base">
                Upcoming Live Event
              </span>
            </div>
            <h2 className=" text-2xl font-bold leading-tight text-kinetic-primary lg:mb-4 lg:text-[2.5rem]">
              Argentina vs Austria <br className="hidden lg:block" />
              Live Show
            </h2>
            <p className="mt-2 flex items-center gap-2 text-base text-kinetic-secondary lg:text-lg">
              <Calendar className="size-4 lg:size-5" aria-hidden="true" />
              22 June 2026 | Kobi Nazrul Auditorium, Rikabibazar, Sylhet.
            </p>
          </div>
          <div className="relative z-10 mt-4 w-full md:mt-0 md:w-auto">
            <Button fullWidth href="/register">
              Register The Event
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
