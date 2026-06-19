import Link from "next/link";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-white/5 pb-28 pt-16 md:pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-kinetic-primary-container/30 to-transparent" />

      <div className="container flex flex-col items-center gap-10 text-center">
        <div className="space-y-3">
          <Link
            href="/"
            className=" text-3xl font-medium uppercase  text-kinetic-primary transition-opacity duration-200 hover:opacity-80"
          >
            ViperSport
          </Link>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-kinetic-on-surface-variant">
            Argentina vs Austria Live Show · 22 June 2026 · Kobi Nazrul
            Auditorium, Rikabibazar, Sylhet.
          </p>
        </div>

        <SocialLinks variant="footer" />

        <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-kinetic-outline">
          <p>© {year} ViperSport · Fuad Abdul-Aziz</p>
          <Link
            href="/register"
            className="text-kinetic-primary-container transition-colors duration-200 hover:text-kinetic-primary"
          >
            Register Free
          </Link>
        </div>
      </div>
    </footer>
  );
}
