import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/logo.png";
const LOGO_WIDTH = 1120;
const LOGO_HEIGHT = 129;

export type ViperSportLogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeClasses: Record<ViperSportLogoSize, string> = {
  xs: "h-3",
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
  "2xl": "h-14 md:h-16 lg:h-[4.5rem]",
};

export interface ViperSportLogoProps {
  size?: ViperSportLogoSize;
  className?: string;
  priority?: boolean;
}

export function ViperSportLogo({
  size = "md",
  className,
  priority = false,
}: ViperSportLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="ViperSport"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn("w-auto object-contain", sizeClasses[size], className)}
    />
  );
}
