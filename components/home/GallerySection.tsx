import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80",
    alt: "Football on pitch"
  },
  {
    src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80",
    alt: "Football stadium"
  },
  {
    src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    alt: "Players competing on football pitch"
  }
];

export function GallerySection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-kinetic-primary-container">
              Highlights
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-kinetic-primary sm:text-4xl">
              Match energy, creator coverage, fan moments.
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {images.map((image) => (
            <div key={image.src} className="relative aspect-[4/5] overflow-hidden rounded-md">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
