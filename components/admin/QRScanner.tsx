"use client";

import { createPortal } from "react-dom";
import { Html5Qrcode } from "html5-qrcode";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Focus,
  Loader2,
  QrCode,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CheckInResponse, Registration } from "@/types";

/**
 * ScanState machine:
 *
 * idle ──► scanning ──► submitting ──► modal-clear ──► modal-confirming ──► modal-success ──► scanning
 *                                  └──► modal-already-in ──► scanning
 *                                  └──► scanning (not found)
 * scanning ──► idle (stop camera)
 */
type ScanState =
  | "idle"
  | "scanning"
  | "submitting"
  | "modal-clear"
  | "modal-already-in"
  | "modal-confirming"
  | "modal-success";

interface QRScannerProps {
  registrations: Registration[];
}

function getInitials(
  registration: Pick<Registration, "first_name" | "last_name">,
): string {
  return `${registration.first_name[0] ?? ""}${registration.last_name[0] ?? ""}`.toUpperCase();
}

function formatCheckedInTime(timestamp: string | null): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function QRScanner({ registrations }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  // Guards against the html5-qrcode callback firing multiple times before
  // the scanner is fully stopped (can happen on slow Android devices).
  const isHandlingScanRef = useRef(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Registration | null>(null);

  useEffect(() => {
    return () => {
      void releaseScanner();
      if (successTimeoutRef.current !== null) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const dismissModal = useCallback((): void => {
    if (successTimeoutRef.current !== null) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    isHandlingScanRef.current = false;
    setResult(null);
    setErrorMessage(null);

    if (scannerRef.current) {
      try {
        scannerRef.current.resume();
      } catch {
        // Scanner may not be paused.
      }
      setState("scanning");
    } else {
      setState("idle");
    }
  }, []);

  // Close modal on Escape — but not while a PATCH is in flight or after success.
  useEffect(() => {
    if (state === "modal-clear" || state === "modal-already-in") {
      function onKeyDown(e: KeyboardEvent): void {
        if (e.key === "Escape") dismissModal();
      }
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
    return undefined;
  }, [state, dismissModal]);

  function pauseScanner(): void {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      scanner.pause(true);
    } catch {
      // Scanner may not be in a scanning state.
    }
  }

  function resumeScanner(): void {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      scanner.resume();
    } catch {
      // Scanner may not be paused.
    }
  }

  async function releaseScanner(): Promise<void> {
    const scanner = scannerRef.current;
    if (!scanner) return;

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

  async function fetchRegistration(
    registrationId: string,
  ): Promise<Registration | null> {
    const response = await fetch(
      `/api/admin/registrations?registration_id=${encodeURIComponent(registrationId)}`,
    );
    if (!response.ok) return null;
    return (await response.json()) as Registration;
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

    // Fast local lookup first — avoids a round-trip for pre-loaded rows.
    const localMatch = registrations.find(
      (item) => item.registration_id === normalized,
    );
    if (localMatch) return localMatch;

    return fetchRegistration(normalized);
  }

  function recoverFromFailedLookup(message: string): void {
    setErrorMessage(message);
    isHandlingScanRef.current = false;
    resumeScanner();
    setState("scanning");
  }

  async function handleScan(decodedText: string): Promise<void> {
    setState("submitting");
    setErrorMessage(null);

    try {
      const registration = await resolveRegistration(decodedText);

      if (!registration) {
        recoverFromFailedLookup("Registration not found for this QR code.");
        return;
      }

      setResult(registration);
      setState(registration.checked_in ? "modal-already-in" : "modal-clear");
    } catch {
      recoverFromFailedLookup(
        "Could not look up registration. Please try again.",
      );
    }
  }

  async function submitCheckIn(registrationId: string): Promise<void> {
    setState("modal-confirming");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/checkin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: registrationId }),
      });

      if (!response.ok) {
        setErrorMessage("Could not check in. Please try again.");
        setState("modal-clear");
        return;
      }

      const payload = (await response.json()) as CheckInResponse;

      setResult((current) =>
        current && current.registration_id === registrationId
          ? {
              ...current,
              checked_in: true,
              checked_in_at: payload.checked_in_at,
            }
          : current,
      );

      if (payload.already_checked_in) {
        // Race condition: someone else checked this person in between our
        // lookup and this confirm. Show the already-in state with fresh timestamp.
        setState("modal-already-in");
      } else {
        setState("modal-success");
        successTimeoutRef.current = setTimeout(() => {
          successTimeoutRef.current = null;
          dismissModal();
        }, 1500);
      }
    } catch {
      // Network failure or malformed response: recover to the retryable
      // confirm state instead of leaving the modal stuck in "confirming".
      setErrorMessage("Could not check in. Please try again.");
      setState("modal-clear");
    }
  }

  async function stopScanner(): Promise<void> {
    await releaseScanner();
    setState("idle");
  }

  async function startScanner(): Promise<void> {
    setErrorMessage(null);
    setResult(null);
    isHandlingScanRef.current = false;
    await releaseScanner();

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    setState("scanning");

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          // Guard: only process the very first successful decode.
          if (isHandlingScanRef.current) return;
          isHandlingScanRef.current = true;
          pauseScanner();
          void handleScan(decodedText);
        },
        undefined,
      );
    } catch {
      await releaseScanner();
      setErrorMessage("Could not access the camera.");
      setState("idle");
    }
  }

  const isModalOpen =
    state === "modal-clear" ||
    state === "modal-already-in" ||
    state === "modal-confirming" ||
    state === "modal-success";

  const statusLabel =
    state === "scanning"
      ? "Align QR code within frame"
      : state === "submitting"
        ? "Reading QR code…"
        : state === "idle"
          ? "Ready to scan"
          : "Review attendee";

  const modal =
    typeof window !== "undefined" && isModalOpen && result
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scan-modal-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-kinetic-surface/90 backdrop-blur-lg"
            onClick={(e) => {
              if (
                e.target === e.currentTarget &&
                state !== "modal-confirming" &&
                state !== "modal-success"
              ) {
                dismissModal();
              }
            }}
          >
            {state === "modal-success" ? (
              /* ── SUCCESS FLASH ── */
              <div className="modal-enter w-full max-w-sm overflow-hidden rounded-2xl bg-kinetic shadow-[0_0_60px_rgb(211_237_134/50%)]">
                <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
                  <CheckCircle2
                    className="size-16 animate-bounce text-kinetic-surface"
                    aria-hidden="true"
                  />
                  <div>
                    <p
                      id="scan-modal-title"
                      className="text-2xl font-bold uppercase tracking-tight text-kinetic-surface"
                    >
                      Check-in Confirmed!
                    </p>
                    <p className="mt-1 text-sm font-semibold text-kinetic-surface/70">
                      {result.first_name} {result.last_name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* ── CLEAR / ALREADY-IN / CONFIRMING ── */
              <div
                className={`modal-enter w-full max-w-md overflow-hidden rounded-2xl admin-glass-card border-t-4 ${
                  state === "modal-already-in"
                    ? "border-t-kinetic-coral"
                    : "border-t-kinetic"
                }`}
              >
                {/* Header: avatar + name + close button */}
                <div className="flex items-center gap-4 border-b border-white/10 p-5">
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold text-kinetic-primary ${
                      state === "modal-already-in"
                        ? "border-kinetic-coral bg-kinetic-coral/20"
                        : "border-kinetic bg-kinetic/20"
                    }`}
                  >
                    {getInitials(result)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      id="scan-modal-title"
                      className="truncate text-lg font-bold text-kinetic-primary"
                    >
                      {result.first_name} {result.last_name}
                    </p>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-kinetic-on-surface-variant">
                      {result.registration_id}
                    </p>
                  </div>

                  {state !== "modal-confirming" ? (
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={dismissModal}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-kinetic-on-surface-variant transition-colors hover:border-white/25 hover:text-kinetic-primary"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>

                {/* Data row: phone + status */}
                <div className="grid grid-cols-2 gap-4 bg-kinetic-surface/50 px-5 py-4">
                  <div>
                    <span className="mb-1 block text-xs font-bold uppercase text-kinetic-on-surface-variant">
                      Phone
                    </span>
                    <span className="text-base font-bold text-kinetic-on-surface">
                      {result.phone}
                    </span>
                  </div>
                  <div>
                    <span className="mb-1 block text-xs font-bold uppercase text-kinetic-on-surface-variant">
                      Status
                    </span>
                    {state === "modal-already-in" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-kinetic-coral">
                        <span className="size-2 rounded-full bg-kinetic-coral" />
                        Already In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-kinetic">
                        <span className="size-2 rounded-full bg-kinetic" />
                        Clear
                      </span>
                    )}
                  </div>
                </div>

                {/* Already checked in — show timestamp if available */}
                {state === "modal-already-in" && result.checked_in_at ? (
                  <div className="flex items-center gap-2 border-t border-kinetic-coral/20 bg-kinetic-coral/10 px-5 py-3">
                    <Clock
                      className="size-3.5 shrink-0 text-kinetic-coral"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-kinetic-coral">
                      Checked in at {formatCheckedInTime(result.checked_in_at)}
                    </span>
                  </div>
                ) : null}

                {/* Inline error banner (only shown when PATCH failed) */}
                {errorMessage ? (
                  <div className="flex items-center gap-2 border-t border-red-500/20 bg-red-900/20 px-5 py-3">
                    <AlertCircle
                      className="size-3.5 shrink-0 text-red-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-red-400">
                      {errorMessage}
                    </span>
                  </div>
                ) : null}

                {/* Footer actions */}
                <div className="p-5">
                  {state === "modal-already-in" ? (
                    <Button
                      type="button"
                      variant="neutral"
                      fullWidth
                      onClick={dismissModal}
                      className="rounded-xl py-3.5 normal-case"
                    >
                      <X className="size-4" aria-hidden="true" />
                      Close
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        type="button"
                        variant="coral"
                        fullWidth
                        loading={state === "modal-confirming"}
                        disabled={state === "modal-confirming"}
                        onClick={() =>
                          void submitCheckIn(result.registration_id)
                        }
                        className="rounded-xl py-3.5 normal-case"
                      >
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Confirm Check-in
                      </Button>
                      <button
                        type="button"
                        onClick={dismissModal}
                        disabled={state === "modal-confirming"}
                        className="py-1 text-xs font-semibold text-kinetic-on-surface-variant transition-colors hover:text-kinetic-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section className="flex flex-col items-center">
        <div className="admin-glass-card admin-glow-active relative size-72 overflow-hidden rounded-xl border border-kinetic/30 md:size-96">
          <div
            id="qr-reader"
            className="absolute inset-0 z-0 [&>video]:size-full [&>video]:object-cover"
          />

          {/* Idle overlay: prompt to start camera */}
          {state === "idle" ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-kinetic-surface-container/80 p-6 text-center">
              <QrCode
                className="mb-4 size-12 text-kinetic"
                aria-hidden="true"
              />
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

          {/* Scan frame corners — only while camera is active or processing */}
          {state === "scanning" || state === "submitting" ? (
            <div className="pointer-events-none absolute inset-4 z-20">
              <div className="absolute left-0 top-0 size-8 rounded-tl-lg border-l-2 border-t-2 border-kinetic" />
              <div className="absolute right-0 top-0 size-8 rounded-tr-lg border-r-2 border-t-2 border-kinetic" />
              <div className="absolute bottom-0 left-0 size-8 rounded-bl-lg border-b-2 border-l-2 border-kinetic" />
              <div className="absolute bottom-0 right-0 size-8 rounded-br-lg border-b-2 border-r-2 border-kinetic" />
            </div>
          ) : null}

          {/* Animated scan line — only while camera feed is live */}
          {state === "scanning" ? (
            <div className="scanner-line pointer-events-none absolute inset-x-0 z-20 h-1 bg-kinetic shadow-[0_0_15px_rgba(227,254,149,0.8)]" />
          ) : null}

          {/* Stop camera button */}
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

          {/* Processing spinner (QR decoded, waiting for lookup) */}
          {state === "submitting" ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-kinetic-surface/80">
              <Loader2
                className="size-10 animate-spin text-kinetic"
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Looking up…
              </span>
            </div>
          ) : null}
        </div>

        {/* Status pill */}
        <div className="mt-6 flex items-center gap-2 rounded-full border border-white/5 bg-kinetic-surface-variant/80 px-4 py-2">
          <Focus
            className="size-4 animate-pulse text-kinetic"
            aria-hidden="true"
          />
          <span className="text-xs font-bold uppercase text-kinetic-on-surface">
            {statusLabel}
          </span>
        </div>

        {/* Error message (only shown when no modal is open) */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 min-h-5 text-center"
        >
          {errorMessage && !isModalOpen ? (
            <p className="text-sm font-semibold text-kinetic-coral">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </section>

      {modal}
    </>
  );
}
