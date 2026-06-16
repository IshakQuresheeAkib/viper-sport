import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "red" | "green" | "neutral" | "amber";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  red: "bg-primary text-white",
  green: "bg-[#dff7ec] text-[#13795b]",
  neutral: "bg-muted text-muted-foreground",
  amber: "bg-[#fff0cc] text-[#986500]"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
