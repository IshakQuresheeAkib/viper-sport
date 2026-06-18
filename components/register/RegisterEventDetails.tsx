import { Calendar, Globe, Star, Trophy } from "lucide-react";

export function RegisterEventDetails() {
  return (
    <section className="kinetic-glass-card flex flex-col gap-8 rounded-xl p-6 sm:p-8 md:p-10">

      <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex flex-col gap-6">
        <h3 className="font-display text-xl font-bold text-kinetic-primary md:text-2xl">
          The Main Event
        </h3>
        <div className="grid grid-cols-1 gap-6 rounded-xl border border-white/5 bg-black/20 p-6 md:grid-cols-3 lg:p-8">
          <div className="flex flex-row items-start gap-4 md:flex-col md:items-start">
            <span className="rounded-full bg-kinetic-surface-tint/10 p-3 text-kinetic-surface-tint md:p-4">
              <Trophy className="size-5 md:size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Match
              </p>
              <p className="text-sm text-kinetic-primary 2xl:text-lg">
                Argentina vs Austria
              </p>
            </div>
          </div>
          <div className="flex flex-row items-start gap-4 md:flex-col md:items-start">
            <span className="rounded-full bg-kinetic-surface-tint/10 p-3 text-kinetic-surface-tint md:p-4">
              <Calendar className="size-5 md:size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Date &amp; Time
              </p>
              <p className="text-sm text-kinetic-primary 2xl:text-lg">
                22 June 2026 • 9:00 PM
              </p>
            </div>
          </div>
          <div className="flex flex-row items-start gap-4 md:flex-col md:items-start">
            <span className="rounded-full bg-kinetic-surface-tint/10 p-3 text-kinetic-surface-tint md:p-4">
              <Star className="size-5 md:size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Featuring National Stars
              </p>
              <p className="mt-1 text-sm text-kinetic-primary 2xl:text-lg">
                Fahmidul Islam, Topu Barman, and Md. Saad Uddin
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
