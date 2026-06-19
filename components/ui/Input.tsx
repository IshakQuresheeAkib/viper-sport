"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { gsap } from "gsap";
import { shouldSkipAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";

export interface KineticInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const KineticInput = forwardRef<HTMLInputElement, KineticInputProps>(
  function KineticInput(
    {
      label,
      icon,
      error,
      containerClassName,
      className,
      type = "text",
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const [showPassword, setShowPassword] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const isPassword = type === "password";
    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    useEffect(() => {
      if (!wrapperRef.current || shouldSkipAnimation()) return;
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    }, []);

    return (
      <div
        ref={wrapperRef}
        className={cn("flex flex-col gap-1", containerClassName)}
        style={{ willChange: "transform" }}
      >
        {label ? (
          <label
            htmlFor={inputId}
            className="text-[11px] font-bold uppercase text-seconday tracking-wider"
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "group glass-input flex h-12 items-center rounded-lg px-3 md:h-14 md:px-4",
            error && "border-secondary/60",
          )}
        >
          {icon ? (
            <span
              className="mr-3 shrink-0 text-white/60 transition-colors duration-200 group-focus-within:text-kinetic-primary-container"
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [errorId, ariaDescribedBy].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "w-full border-none bg-transparent p-0 text-base text-kinetic-on-surface outline-none placeholder:text-kinetic-secondary/50 focus:ring-0",
              className,
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="ml-2 shrink-0 cursor-pointer text-white/50 transition-colors duration-200 hover:text-kinetic-on-surface"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="size-5" aria-hidden="true" />
              ) : (
                <EyeOff className="size-5" aria-hidden="true" />
              )}
            </button>
          ) : null}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-sm font-semibold text-secondary"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
