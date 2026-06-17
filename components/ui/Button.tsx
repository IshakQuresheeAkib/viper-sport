import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "lime" | "coral" | "neutral";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  active?: boolean;
  href?: string;
  children: ReactNode;
}

function getVariantClasses(variant: ButtonVariant, active: boolean): string {
  if (active) {
    return "border-kinetic-primary-container/40 bg-kinetic-primary-container text-kinetic-on-primary-container shadow-[0_0_15px_rgba(211,237,134,0.25)]";
  }

  switch (variant) {
    case "lime":
      return "border-transparent bg-kinetic-primary-container text-kinetic-on-primary-container hover:bg-kinetic-primary-fixed-dim hover:shadow-[0_0_15px_rgba(211,237,134,0.3)]";
    case "coral":
      return "border-transparent bg-[#f86d6c] text-[#13140d] hover:brightness-95";
    case "neutral":
      return "border-kinetic-outline/20 bg-kinetic-charcoal text-kinetic-on-surface hover:bg-kinetic-surface-bright";
  }
}

export function Button({
  variant = "coral",
  fullWidth = false,
  loading = false,
  active = false,
  href,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sharedClassName = cn(
    "retro-btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm px-5 py-3 font-display text-base font-bold uppercase transition-all duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kinetic-primary-container",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "active:scale-[0.98]",
    getVariantClasses(variant, active),
    fullWidth && "w-full",
    className
  );

  const content = loading ? (
    <>
      <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" />
      {children}
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(sharedClassName, isDisabled && "pointer-events-none opacity-60")}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} disabled={isDisabled} type={type} {...props}>
      {content}
    </button>
  );
}
