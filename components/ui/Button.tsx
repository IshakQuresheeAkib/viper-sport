import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[#7d000e] disabled:bg-[#b86a72]",
  secondary:
    "border border-border bg-card text-foreground hover:border-primary hover:text-primary",
  ghost: "text-foreground hover:bg-muted",
  danger: "bg-[#b42318] text-white hover:bg-[#8f1d15]"
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
