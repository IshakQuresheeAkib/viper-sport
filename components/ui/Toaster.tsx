"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "kinetic-glass-card border border-white/10 bg-kinetic-surface-container text-kinetic-on-surface  shadow-lg",
          title: "font-semibold text-kinetic-primary",
          description: "text-kinetic-on-surface-variant",
          error: "border-secondary/40",
        },
      }}
    />
  );
}
