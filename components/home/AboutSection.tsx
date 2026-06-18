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
            Fuad Abdul-Aziz is a UK-based football personality, born in
            Bangladesh, who is the founder of ViperSport — a social media
            platform with over 1.4M+ followers.
          </p>
          <p>
            ViperSport has collaborated with the likes of Real Madrid, Apple,
            FIFA, Adidas, and many more household names, generating over 500
            million views.
          </p>
          <p>
            Fuad has recently gained huge traction in Bangladesh with his
            coverage and relationship with the Bangladesh football scene. He is
            a prominent figure within the hype of Bangladesh football.
          </p>
        </div>
      </div>
    </section>
  );
}
