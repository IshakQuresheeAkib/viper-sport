const brands = ["Real Madrid", "Apple", "FIFA", "Adidas", "ViperSport"];

export function CollabSection() {
  return (
    <section className="py-18">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-kinetic-primary-container">
          Collaborations
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {brands.map((brand) => (
            <div
              key={brand}
              className="glass-card flex h-24 items-center justify-center rounded-md px-4 text-center text-lg font-black text-kinetic-primary"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
