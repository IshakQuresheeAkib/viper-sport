export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-kinetic-primary-container">
            About
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-kinetic-primary sm:text-4xl">
            Bangladesh-born football voice with global reach.
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-8 text-kinetic-on-surface-variant">
          <p>
            Fuad Abdul-Aziz built ViperSport into a football media presence
            known for match reactions, fan culture, and high-energy creator-led
            coverage across platforms.
          </p>
          <p>
            The Sylhet live match show brings that audience together for a free
            fan engagement event with simple mobile registration and QR check-in.
          </p>
        </div>
      </div>
    </section>
  );
}
