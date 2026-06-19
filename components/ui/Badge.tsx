import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "lime" | "coral" | "neutral" | "pending";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  lime: "border border-kinetic-primary-container/30 bg-kinetic-primary-container/10 text-kinetic-primary-container",
  coral:
    "border border-kinetic-coral/30 bg-kinetic-coral/10 text-kinetic-coral",
  neutral:
    "border border-white/60 bg-kinetic-surface-bright text-kinetic-on-surface-variant",
  pending:
    "border border-white/60 bg-kinetic-surface-container text-kinetic-on-surface-variant",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
