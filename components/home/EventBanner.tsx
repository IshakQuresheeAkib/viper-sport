import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export function EventBanner() {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/72">
            Free registration
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-5xl">
            Argentina vs Austria: World Cup Live Match Show
          </h2>
          <p className="mt-4 flex items-center gap-2 text-white/78">
            <MapPin size={18} /> Shahi Eidgah Maidan, TV Gate, Sylhet
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-black text-primary transition hover:bg-[#f7e2df]"
        >
          Register now <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
