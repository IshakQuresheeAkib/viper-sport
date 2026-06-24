import Image from "next/image";
import { VIPER_SPORT_BIO } from "@/lib/social";
import { ViperSportLogo } from "@/components/shared/ViperSportLogo";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function ViperSportProfile() {
  return (
    <aside className="kinetic-glass-card overflow-hidden rounded-xl">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src="/images/home/profile.webp"
          alt="Fuad Abdul-Aziz, founder of ViperSport"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-kinetic-charcoal via-kinetic-charcoal/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <ViperSportLogo size="xs" className="mb-1" />
          <h2 className="text-2xl uppercase text-kinetic-primary">
            Fuad <span className="font-extrabold text-kinetic">Abdul-Aziz</span>
          </h2>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-kinetic-on-surface-variant sm:text-base">
          {VIPER_SPORT_BIO}
        </p>
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-kinetic-outline">
            Follow the journey
          </p>
          <SocialLinks variant="profile" />
        </div>
      </div>
    </aside>
  );
}
