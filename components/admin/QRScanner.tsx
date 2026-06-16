"use client";

import { Html5Qrcode } from "html5-qrcode";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CheckInResponse } from "@/types";

type ScanState = "idle" | "scanning" | "submitting";

export function QRScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      void scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  async function submitCheckIn(registrationId: string) {
    setState("submitting");
    const response = await fetch("/api/admin/checkin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ registration_id: registrationId })
    });

    if (!response.ok) {
      setMessage("Could not check in this registration.");
      setState("idle");
      return;
    }

    const payload = (await response.json()) as CheckInResponse;
    setMessage(payload.already_checked_in ? "Already checked in." : "Check-in confirmed.");
    setState("idle");
  }

  async function startScanner() {
    setMessage(null);
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    setState("scanning");
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText) => {
        void scanner.stop().finally(() => submitCheckIn(decodedText));
      },
      undefined
    );
  }

  return (
    <section className="surface rounded-md p-5">
      <h2 className="text-2xl font-black">QR scan</h2>
      <div id="qr-reader" className="mt-4 min-h-72 overflow-hidden rounded-md bg-muted" />
      {message ? <p className="mt-4 font-semibold">{message}</p> : null}
      <Button className="mt-5" disabled={state !== "idle"} onClick={startScanner}>
        {state === "submitting" ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
        Start camera
      </Button>
    </section>
  );
}
