import Image from "next/image";
import Link from "next/link";
import { Calendar, Home, TicketX, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function RegistrationClosed() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-x-hidden bg-kinetic-charcoal px-4 py-12 font-body text-kinetic-on-surface md:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/home/profile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-kinetic-charcoal/70 via-kinetic-charcoal/95 to-kinetic-charcoal" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-1/4 top-1/4 size-[420px] rounded-full bg-kinetic-error/8 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 size-[500px] rounded-full bg-kinetic-primary-container/5 blur-[100px]" />
      </div>

      <header className="relative z-10 mb-8 text-center">
        <Link href="/">
          <h1 className="font-display text-3xl font-extrabold tracking-tighter text-kinetic-primary drop-shadow-lg md:text-5xl">
            Viper sport
          </h1>
        </Link>
      </header>

      <div
        className="glass-card glow-border relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border-t-2 border-kinetic-error p-8 text-center shadow-2xl md:p-10"
        role="alertdialog"
        aria-labelledby="registration-closed-title"
        aria-describedby="registration-closed-desc"
      >
        <div className="pointer-events-none absolute top-0 right-0 size-28 rounded-bl-full bg-kinetic-error/10 blur-2xl" />

        <div className="relative mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-kinetic-error/30 bg-kinetic-error/10">
          <TicketX className="size-8 text-kinetic-error" aria-hidden="true" />
        </div>

        <div className="relative mb-4 flex items-center justify-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-kinetic-error" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-kinetic-error">
            Registration Closed
          </span>
        </div>

        <h2
          id="registration-closed-title"
          className="relative font-display text-3xl font-extrabold uppercase leading-tight tracking-tighter text-kinetic-primary md:text-4xl"
        >
          All Seats Are{" "}
          <span className="text-kinetic-primary-container">Filled</span>
        </h2>

        <p
          id="registration-closed-desc"
          className="relative mt-4 text-base leading-relaxed text-kinetic-secondary md:text-lg"
        >
          Thank you for the overwhelming response. Registration for the
          Argentina vs Austria live show is now closed — capacity has been
          reached.
        </p>

        <div className="relative mt-8 space-y-3 rounded-xl border border-white/10 bg-black/25 p-4 text-left">
          <div className="flex items-start gap-3">
            <Users
              className="mt-0.5 size-4 shrink-0 text-kinetic-primary-container"
              aria-hidden="true"
            />
            <p className="text-sm text-kinetic-on-surface-variant">
              <span className="font-bold text-kinetic-primary">500+ spots</span>{" "}
              have been reserved for the live broadcast experience.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Calendar
              className="mt-0.5 size-4 shrink-0 text-kinetic-primary-container"
              aria-hidden="true"
            />
            <p className="text-sm text-kinetic-on-surface-variant">
              Event still on —{" "}
              <span className="font-bold text-kinetic-primary">
                22 June 2026 · 9:00 PM
              </span>
              <br />
              Kobi Nazrul Auditorium, Rikabibazar, Sylhet
            </p>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-3">
          <Button fullWidth href="/" variant="lime">
            <Home className="size-5" aria-hidden="true" />
            Back to Home
          </Button>
          <p className="text-xs leading-relaxed text-kinetic-outline">
            Already registered? Open the confirmation link from your SMS to view
            your QR pass.
          </p>
        </div>
      </div>
    </main>
  );
}
