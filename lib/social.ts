export type SocialPlatform = "tiktok" | "instagram" | "facebook" | "youtube";

export interface SocialLink {
  href: string;
  platform: SocialPlatform;
  ariaLabel: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: "https://www.tiktok.com/@vipersport",
    platform: "tiktok",
    ariaLabel: "Follow ViperSport on TikTok",
  },
  {
    href: "https://www.instagram.com/vipersporttv",
    platform: "instagram",
    ariaLabel: "Follow ViperSport on Instagram",
  },
  {
    href: "https://www.facebook.com/ViperSporttv",
    platform: "facebook",
    ariaLabel: "Follow ViperSport on Facebook",
  },
  {
    href: "https://www.youtube.com/@ViperSport18",
    platform: "youtube",
    ariaLabel: "Subscribe to ViperSport on YouTube",
  },
] as const;

export const VIPER_SPORT_BIO =
  "A sports content creator born in Bangladesh with 1.4M+ followers. Fuad Abdul-Aziz built ViperSport into a global sports media brand.";
