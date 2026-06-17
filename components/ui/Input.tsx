"use client";

import { forwardRef, useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export interface KineticInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!conn) return false;
  return conn.saveData === true || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

export const KineticInput = forwardRef<HTMLInputElement, KineticInputProps>(function KineticInput(
  { label, icon, error, containerClassName, className, type = "text", id, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  useEffect(() => {
    if (!wrapperRef.current || isSlowConnection()) return;
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={wrapperRef} className={cn("flex flex-col gap-1", containerClassName)} style={{ willChange: "transform" }}>
      {label ? (
        <label
          htmlFor={id}
          className="text-[11px] font-bold uppercase tracking-wider text-kinetic-outline"
        >
          {label}
        </label>
      ) : null}

      <div className="group glass-input flex h-12 items-center rounded-lg px-3 md:h-14 md:px-4">
        {icon ? (
          <span
            className="mr-3 shrink-0 text-kinetic-outline-variant transition-colors duration-200 group-focus-within:text-kinetic-primary-container"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={id}
          type={resolvedType}
          className={cn(
            "w-full border-none bg-transparent p-0 text-base text-kinetic-on-surface outline-none placeholder:text-kinetic-secondary/50 focus:ring-0",
            className
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="ml-2 shrink-0 cursor-pointer text-kinetic-outline transition-colors duration-200 hover:text-kinetic-on-surface"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye className="size-5" aria-hidden="true" /> : <EyeOff className="size-5" aria-hidden="true" />}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm font-semibold text-kinetic-error">{error}</p>
      ) : null}
    </div>
  );
});
