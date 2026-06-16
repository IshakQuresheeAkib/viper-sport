"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createQrDataUrl } from "@/lib/qr";
import type { PublicRegistration } from "@/types";

export function SuccessCard() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const [registration, setRegistration] = useState<PublicRegistration | null>(null);
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

  if (!registrationId) {
    return (
      <div className="surface max-w-2xl rounded-md p-6">
        <h1 className="text-3xl font-black">Registration unavailable</h1>
        <p className="mt-3 text-muted-foreground">Missing registration ID.</p>
        <Link className="mt-6 inline-flex font-bold text-primary" href="/register">
          Back to registration
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface max-w-2xl rounded-md p-6">
        <h1 className="text-3xl font-black">Registration unavailable</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Link className="mt-6 inline-flex font-bold text-primary" href="/register">
          Back to registration
        </Link>
      </div>
    );
  }

  if (!registration) {
    return <p className="font-semibold">Loading registration...</p>;
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_280px]">
      <div className="surface rounded-md p-6">
        <Badge tone="green">Confirmed</Badge>
        <h1 className="mt-4 text-4xl font-black">You are registered.</h1>
        <div className="mt-6 grid gap-3 text-sm">
          <p>
            <span className="font-bold">Name:</span> {registration.first_name}{" "}
            {registration.last_name}
          </p>
          <p>
            <span className="font-bold">Registration ID:</span>{" "}
            <span className="font-mono">{registration.registration_id}</span>
          </p>
          <p>
            <span className="font-bold">Event:</span> Argentina vs Austria Live Show
          </p>
          <p>
            <span className="font-bold">Date:</span> 22 June 2026, 9:00 PM
          </p>
          <p>
            <span className="font-bold">Venue:</span> Shahi Eidgah Maidan, TV Gate,
            Sylhet
          </p>
        </div>
        <Button
          className="mt-6"
          onClick={() => window.print()}
          variant="secondary"
        >
          Save or print QR
        </Button>
      </div>
      <div className="surface grid place-items-center rounded-md p-6 text-center">
        {qrUrl ? (
          <Image
            src={qrUrl}
            alt={`QR code for ${registration.registration_id}`}
            width={224}
            height={224}
            unoptimized
            className="size-56 rounded-md bg-white p-3"
          />
        ) : (
          <div className="size-56 rounded-md bg-muted" />
        )}
        <p className="mt-4 text-sm font-bold">Show this at the gate.</p>
      </div>
    </div>
  );
}
