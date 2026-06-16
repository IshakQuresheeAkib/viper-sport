import { Calendar, Globe, Star, Trophy } from "lucide-react";

export function RegisterEventDetails() {
  return (
    <section className="kinetic-glass-card flex flex-col gap-8 rounded-xl p-6 sm:p-8 md:p-10">
      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-kinetic-primary md:text-3xl">
          <Globe className="size-6 text-kinetic-primary-fixed-dim md:size-8" aria-hidden="true" />
          Our Mission
        </h2>
        <p className="text-base leading-relaxed text-kinetic-on-surface-variant md:text-lg">
          Spearheaded by visionary <strong>Fuad Abdul Aziz</strong>, our objective
          is to boldly promote Bangladesh on the global stage. We take immense pride
          in our roots, bringing the passionate <strong>Sylheti language</strong> to
          international football commentary, connecting our rich cultural heritage
          with the world&apos;s most beautiful game.
        </p>
      </div>

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
              <p className="text-base font-bold text-kinetic-primary md:text-lg">
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
              <p className="text-base font-bold text-kinetic-primary md:text-lg">
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
              <p className="mt-1 text-base text-kinetic-primary md:text-lg">
                Fahmidul Islam, Sheikh Mursalin, Topu Barman, Md. Saad Uddin
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
