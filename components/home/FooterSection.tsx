import Link from "next/link";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ViperSportLogo } from "@/components/shared/ViperSportLogo";

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-white/5 pb-28 pt-16 md:pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-kinetic/30 to-transparent" />

      <div className="container flex flex-col items-center gap-10 text-center">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex justify-center transition-opacity duration-200 hover:opacity-80"
          >
            <ViperSportLogo size="md" />
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
            className="text-kinetic transition-colors duration-200 hover:text-kinetic-primary"
          >
            Register Free
          </Link>
        </div>
      </div>
    </footer>
  );
}
