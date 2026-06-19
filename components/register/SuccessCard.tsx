"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CheckCircle, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { createQrDataUrl } from "@/lib/qr";
import { buildPassImage } from "@/lib/pass";
import { shouldSkipAnimation } from "@/lib/animation";
import { kineticColors } from "@/lib/kinetic-colors";
import type { PublicRegistration } from "@/types";

const CONFETTI_COLORS = [
  kineticColors.primaryContainer,
  kineticColors.primary,
  kineticColors.onSurfaceVariant,
] as const;

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  gravity: number;
  drag: number;
}

function createParticle(canvas: HTMLCanvasElement): ConfettiParticle {
  return {
    x: canvas.width / 2,
    y: canvas.height * 0.3,
    vx: (Math.random() - 0.5) * 15,
    vy: (Math.random() - 1) * 15 - 5,
    size: Math.random() * 4 + 2,
    color:
      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ??
      kineticColors.primaryContainer,
    alpha: 1,
    gravity: 0.3,
    drag: 0.96,
  };
}

export function SuccessCard() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [registration, setRegistration] = useState<PublicRegistration | null>(
    null,
  );
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRegistration(id: string) {
      const response = await fetch(`/api/register/${encodeURIComponent(id)}`);

      if (!response.ok) {
        setError("Registration was not found.");
        return;
      }

      const payload = (await response.json()) as PublicRegistration;
      setRegistration(payload);
      setQrUrl(await createQrDataUrl(payload.registration_id));
    }

    if (registrationId) {
      void loadRegistration(registrationId);
    }
  }, [registrationId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;

    if (!canvas || !content || shouldSkipAnimation()) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles: ConfettiParticle[] = Array.from({ length: 60 }, () =>
      createParticle(canvas),
    );

    let frameId = 0;

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((particle) => {
        if (particle.alpha <= 0) {
          return;
        }

        particle.vx *= particle.drag;
        particle.vy *= particle.drag;
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= 0.015;

        ctx.globalAlpha = Math.max(0, particle.alpha);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        active = true;
      });

      if (active) {
        frameId = requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const timeoutId = window.setTimeout(() => {
      frameId = requestAnimationFrame(animateConfetti);
    }, 300);

    const animatedItems = content.querySelectorAll("[data-success-animate]");
    const gsapCtx = gsap.context(() => {
      gsap.set(animatedItems, { opacity: 0, y: 20, willChange: "transform" });
      gsap.to(animatedItems, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, content);

    return () => {
      window.removeEventListener("resize", resize);
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
      gsapCtx.revert();
    };
  }, [registration]);

  async function handleShare() {
    if (!registration) {
      return;
    }

    const shareText = `ViperSport registration confirmed. ID: ${registration.registration_id}`;

    if (navigator.share) {
      await navigator.share({
        title: "ViperSport Pass",
        text: shareText,
      });
      toast.success("Pass shared successfully.");
      return;
    }

    await navigator.clipboard.writeText(shareText);
    toast.success("Registration ID copied to clipboard.");
  }

  async function handleDownloadPass() {
    if (!qrUrl || !registration) {
      return;
    }

    const passUrl = await buildPassImage({
      registrationId: registration.registration_id,
      firstName: registration.first_name,
      lastName: registration.last_name,
      qrDataUrl: qrUrl,
    });

    const link = document.createElement("a");
    link.href = passUrl;
    link.download = `${registration.registration_id}-pass.png`;
    link.click();
  }

  if (!registrationId) {
    return (
      <div className="kinetic-glass-card max-w-md rounded-xl p-6 text-center">
        <h1 className=" text-3xl font-bold">Registration unavailable</h1>
        <p className="mt-3 text-kinetic-on-surface-variant">
          Missing registration ID.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block font-bold text-kinetic"
        >
          Back to registration
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kinetic-glass-card max-w-md rounded-xl p-6 text-center">
        <h1 className=" text-3xl font-bold">Registration unavailable</h1>
        <p className="mt-3 text-kinetic-on-surface-variant">{error}</p>
        <Link
          href="/register"
          className="mt-6 inline-block font-bold text-kinetic"
        >
          Back to registration
        </Link>
      </div>
    );
  }

  if (!registration) {
    return (
      <p className="font-semibold text-kinetic-on-surface" aria-live="polite">
        Loading registration...
      </p>
    );
  }

  return (
    <div
      ref={contentRef}
      className="relative flex w-full flex-col items-center"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 size-full"
        aria-hidden="true"
      />

      <div
        data-success-animate
        className="relative z-10 mb-6 flex flex-col items-center"
      >
        <div className="glow-pulse mb-3 flex size-16 items-center justify-center rounded-full border border-kinetic/20 bg-white/10">
          <CheckCircle className="size-10 text-kinetic" aria-hidden="true" />
        </div>
        <h1 className="text-center  text-[2rem] font-medium text-kinetic-on-surface">
          You&apos;re In
        </h1>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        Registration confirmed for {registration.registration_id}.
      </div>

      <div
        data-success-animate
        className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-[24px] border border-white/5 bg-kinetic-surface-bright/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <div className="h-1 w-full bg-kinetic" />

        <div className="flex items-center justify-between bg-kinetic-surface-container/50 px-6 pb-4 pt-6">
          <span className="text-xs font-bold uppercase tracking-widest text-kinetic-on-surface-variant">
            ViperSport Pass
          </span>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <div>
            <span className="mb-1 block text-xs font-bold text-kinetic-on-surface-variant">
              Event
            </span>
            <h2 className=" text-2xl font-bold text-kinetic-on-surface">
              Argentina vs Austria
            </h2>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-kinetic">
              22 June 2026 &middot; 9:00 PM
            </span>
            <span className="text-xs text-kinetic-on-surface-variant">
              Kobi Nazrul Auditorium, Rikabibazar, Sylhet
            </span>
          </div>
        </div>

        <div className="ticket-cutout relative z-10 my-[-10px] flex h-10 w-full items-center">
          <div className="dash-divider mx-6 w-full" />
        </div>

        <div className="flex flex-col items-center bg-white/5/50 px-6 pb-6">
          <div className="mb-6 flex w-full justify-between pt-3">
            <div className="flex flex-col">
              <span className="mb-1 text-xs font-bold text-kinetic-on-surface-variant">
                Holder
              </span>
              <span className="text-base font-semibold text-kinetic-on-surface">
                {registration.first_name} {registration.last_name}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="mb-1 text-xs font-bold text-kinetic-on-surface-variant">
                Reg ID
              </span>
              <span className=" text-xl font-bold text-kinetic">
                {registration.registration_id}
              </span>
            </div>
          </div>

          <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center rounded-lg bg-white p-3">
            {qrUrl ? (
              <Image
                src={qrUrl}
                alt={`QR code for ${registration.registration_id}`}
                width={176}
                height={176}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full rounded-md bg-kinetic-on-surface-variant/20" />
            )}
          </div>
          <span className="mt-3 text-center text-xs font-bold text-kinetic-on-surface-variant">
            Present this code at entry gates
          </span>
        </div>
      </div>

      <div
        data-success-animate
        className="relative z-10 mt-6 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:gap-4"
      >
        <Button
          type="button"
          variant="coral"
          onClick={() => void handleDownloadPass()}
          className="flex-1 rounded-full normal-case"
        >
          <Download className="size-5" aria-hidden="true" />
          Download Pass
        </Button>
        <Button
          type="button"
          variant="neutral"
          onClick={() => void handleShare()}
          className="flex-1 rounded-full border-kinetic-outline/30 bg-kinetic-surface-variant/30 normal-case backdrop-blur-md hover:bg-kinetic-surface-variant/50"
        >
          <Share2 className="size-5" aria-hidden="true" />
          Share
        </Button>
      </div>
    </div>
  );
}
