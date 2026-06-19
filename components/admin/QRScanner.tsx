"use client";

import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, Focus, Loader2, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type {
  CheckInResponse,
  Registration,
  RegistrationLookup,
} from "@/types";

type ScanState = "idle" | "scanning" | "submitting";

interface QRScannerProps {
  registrations: Registration[];
}

function getInitials(
  registration: Pick<Registration, "first_name" | "last_name">,
) {
  return `${registration.first_name[0] ?? ""}${registration.last_name[0] ?? ""}`.toUpperCase();
}

function toRegistration(payload: RegistrationLookup): Registration {
  return {
    id: payload.id,
    registration_id: payload.registration_id,
    first_name: payload.first_name,
    last_name: payload.last_name,
    phone: payload.phone,
    qr_data: "",
    sms_sent: false,
    checked_in: payload.checked_in,
    checked_in_at: null,
    created_at: payload.created_at,
  };
}

export function QRScanner({ registrations }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Registration | null>(null);

  useEffect(() => {
    return () => {
      void releaseScanner();
    };
  }, []);

  async function fetchRegistration(
    registrationId: string,
  ): Promise<Registration | null> {
    const response = await fetch(
      `/api/register/${encodeURIComponent(registrationId)}`,
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as RegistrationLookup;
    return toRegistration(payload);
  }

  /**
   * Some Android camera apps inject a URL scheme (e.g. "http://…" or
   * "https://…") in front of raw text QR codes. Strip it so we always
   * match against the bare registration_id.
   */
  function extractRegistrationId(raw: string): string {
    const trimmed = raw.trim();
    try {
      const url = new URL(trimmed);
      // If it parsed as a URL, take the last non-empty path segment or the
      // hostname — whatever looks like a REG-XXXXXXXX token.
      const parts = url.pathname.split("/").filter(Boolean);
      const candidate = parts.at(-1) ?? url.hostname;
      return candidate.toUpperCase().startsWith("REG-") ? candidate : trimmed;
    } catch {
      return trimmed;
    }
  }

  async function resolveRegistration(
    registrationId: string,
  ): Promise<Registration | null> {
    const normalized = extractRegistrationId(registrationId);
    const localMatch = registrations.find(
      (item) => item.registration_id === normalized,
    );

    if (localMatch) {
      return localMatch;
    }

    return fetchRegistration(normalized);
  }

  async function handleScan(registrationId: string) {
    setState("submitting");
    setMessage(null);

    const registration = await resolveRegistration(registrationId);

    if (!registration) {
      setMessage("Registration not found for this QR code.");
      setState("idle");
      return;
    }

    setResult(registration);
    setState("idle");
  }

  async function submitCheckIn(registrationId: string) {
    setState("submitting");
    const response = await fetch("/api/admin/checkin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registration_id: registrationId }),
    });

    if (!response.ok) {
      setMessage("Could not check in this registration.");
      setState("idle");
      return;
    }

    const payload = (await response.json()) as CheckInResponse;
    setMessage(
      payload.already_checked_in
        ? "Already checked in."
        : "Check-in confirmed.",
    );
    setResult((current) =>
      current && current.registration_id === registrationId
        ? { ...current, checked_in: true, checked_in_at: payload.checked_in_at }
        : current,
    );
    setState("idle");
  }

  async function releaseScanner() {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }

    scannerRef.current = null;

    try {
      await scanner.stop();
    } catch {
      // Scanner may already be stopped.
    }

    try {
      scanner.clear();
    } catch {
      // Container may already be cleared.
    }
  }

  async function stopScanner() {
    await releaseScanner();
    setState("idle");
  }

  async function startScanner() {
    setMessage(null);
    setResult(null);
    await releaseScanner();

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    setState("scanning");

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          void releaseScanner().finally(() => handleScan(decodedText));
        },
        undefined,
      );
    } catch {
      await releaseScanner();
      setMessage("Could not access the camera.");
      setState("idle");
    }
  }

  return (
    <section className="flex flex-col items-center">
      <div className="relative size-72 overflow-hidden rounded-xl border border-kinetic/30 admin-glass-card admin-glow-active md:size-96">
        <div
          id="qr-reader"
          className="absolute inset-0 z-0 [&>video]:size-full [&>video]:object-cover"
        />

        {state === "idle" ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-kinetic-surface-container/80 p-6 text-center">
            <QrCode className="mb-4 size-12 text-kinetic" aria-hidden="true" />
            <p className="text-sm text-kinetic-on-surface-variant">
              Start the camera to scan attendee QR codes at the gate.
            </p>
            <Button
              type="button"
              variant="coral"
              onClick={() => void startScanner()}
              className="mt-6 px-4 py-2 text-sm normal-case"
            >
              Start camera
            </Button>
          </div>
        ) : null}

        {state !== "idle" ? (
          <>
            <div className="pointer-events-none absolute inset-4 z-20">
              <div className="absolute left-0 top-0 size-8 rounded-tl-lg border-l-2 border-t-2 border-kinetic" />
              <div className="absolute right-0 top-0 size-8 rounded-tr-lg border-r-2 border-t-2 border-kinetic" />
              <div className="absolute bottom-0 left-0 size-8 rounded-bl-lg border-b-2 border-l-2 border-kinetic" />
              <div className="absolute bottom-0 right-0 size-8 rounded-br-lg border-b-2 border-r-2 border-kinetic" />
            </div>
            <div className="scanner-line pointer-events-none absolute inset-x-0 z-20 h-1 bg-kinetic shadow-[0_0_15px_rgba(227,254,149,0.8)]" />
          </>
        ) : null}

        {state === "scanning" ? (
          <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
            <Button
              type="button"
              variant="neutral"
              onClick={() => void stopScanner()}
              className="rounded-full px-4 py-2 text-xs normal-case"
            >
              Stop camera
            </Button>
          </div>
        ) : null}

        {state === "submitting" ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-kinetic-surface/70">
            <Loader2
              className="size-10 animate-spin text-kinetic"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-white/5 bg-kinetic-surface-variant/80 px-4 py-2">
        <Focus
          className="size-4 animate-pulse text-kinetic"
          aria-hidden="true"
        />
        <span className="text-xs font-bold uppercase text-kinetic-on-surface">
          {state === "scanning"
            ? "Align QR code within frame"
            : "Ready to scan"}
        </span>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 min-h-5 text-center"
      >
        {message ? (
          <p className="text-sm font-semibold text-kinetic">{message}</p>
        ) : null}
      </div>

      {result ? (
        <div className="admin-glass-card admin-glow-active mt-8 w-full max-w-md overflow-hidden rounded-xl border-t-2 border-t-kinetic">
          <div className="flex items-center gap-4 border-b border-white/10 p-6">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border border-white/5 bg-kinetic-surface-variant  text-xl font-bold text-kinetic-primary">
              {getInitials(result)}
            </div>
            <div className="flex-1">
              <h3 className=" text-xl font-bold text-kinetic-primary">
                {result.first_name} {result.last_name}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-kinetic-on-surface-variant">
                ID: {result.registration_id}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-kinetic-surface/50 px-6 py-4">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase text-kinetic-on-surface-variant">
                Phone
              </span>
              <span className=" text-lg font-bold text-kinetic-on-surface">
                {result.phone}
              </span>
            </div>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase text-kinetic-on-surface-variant">
                Status
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-kinetic">
                <span className="size-2 rounded-full bg-kinetic" />
                {result.checked_in ? "Checked in" : "Clear"}
              </span>
            </div>
          </div>
          <div className="p-6">
            <Button
              type="button"
              variant="coral"
              fullWidth
              disabled={result.checked_in}
              onClick={() => void submitCheckIn(result.registration_id)}
              className="rounded-lg py-4 normal-case"
            >
              <CheckCircle2 className="size-5" aria-hidden="true" />
              Confirm check-in
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
