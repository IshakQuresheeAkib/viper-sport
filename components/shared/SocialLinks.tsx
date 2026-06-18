import { SOCIAL_LINKS } from "@/lib/social";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/shared/SocialIcon";

export type SocialLinksVariant = "hero" | "footer" | "profile";

export interface SocialLinksProps {
  variant?: SocialLinksVariant;
  className?: string;
}

const variantStyles: Record<
  SocialLinksVariant,
  { list: string; link: string; icon: string }
> = {
  hero: {
    list: "flex gap-3 my-[4vh]",
    link: "glass-card flex size-11 items-center justify-center rounded-full text-kinetic-on-surface text-kinetic-on-surface-variant transition-[background-color,box-shadow,color] duration-200 hover:border-kinetic-primary-container hover:bg-kinetic-primary-container hover:text-kinetic-on-primary-fixed hover:shadow-[0_0_12px_rgba(211,237,134,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-kinetic-charcoal hover:text-kinetic-primary-container",
    icon: "size-[18px]",
  },
  footer: {
    list: "flex flex-wrap items-center justify-center gap-2 sm:gap-3",
    link: "group relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-kinetic-surface-container/60 text-kinetic-secondary backdrop-blur-sm transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-kinetic-primary-container/50 hover:bg-kinetic-primary-container/10 hover:text-kinetic-primary-container hover:shadow-[0_0_12px_rgba(211,237,134,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-kinetic-surface sm:size-11",
    icon: "size-[17px] transition-transform duration-200 group-hover:scale-110",
  },
  profile: {
    list: "flex flex-wrap gap-2.5",
    link: "flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-kinetic-on-surface transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-kinetic-primary-container hover:bg-kinetic-primary-container hover:text-kinetic-on-primary-fixed hover:shadow-[0_0_14px_rgba(211,237,134,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-kinetic-charcoal",
    icon: "size-4",
  },
};

export function SocialLinks({ variant = "hero", className }: SocialLinksProps) {
  const styles = variantStyles[variant];

  return (
    <nav aria-label="ViperSport social media" className={className}>
      <ul className={styles.list}>
        {SOCIAL_LINKS.map((link) => (
          <li key={link.platform}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className={cn(styles.link, "cursor-pointer")}
            >
              <SocialIcon platform={link.platform} className={styles.icon} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
