"use client";

import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CheckInResponse, Registration } from "@/types";

export function ManualSearch({ registrations }: { registrations: Registration[] }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return registrations
      .filter((registration) => {
        const name = `${registration.first_name} ${registration.last_name}`.toLowerCase();
        return name.includes(normalized) || registration.phone.includes(normalized);
      })
      .slice(0, 6);
  }, [query, registrations]);

  async function checkIn(registrationId: string) {
    const response = await fetch("/api/admin/checkin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ registration_id: registrationId })
    });

    if (!response.ok) {
      setMessage("Could not check in this registration.");
      return;
    }

    const payload = (await response.json()) as CheckInResponse;
    setMessage(payload.already_checked_in ? "Already checked in." : "Check-in confirmed.");
  }

  return (
    <section className="surface rounded-md p-5">
      <h2 className="text-2xl font-black">Manual search</h2>
      <Input
        className="mt-4"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by phone or name"
        value={query}
      />
      {message ? <p className="mt-4 font-semibold">{message}</p> : null}
      <div className="mt-4 grid gap-3">
        {matches.map((registration) => (
          <div
            key={registration.id}
            className="flex flex-col gap-3 rounded-md border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold">
                {registration.first_name} {registration.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {registration.phone} · {registration.registration_id}
              </p>
              <div className="mt-2">
                {registration.checked_in ? (
                  <Badge tone="green">Checked in</Badge>
                ) : (
                  <Badge tone="amber">Pending</Badge>
                )}
              </div>
            </div>
            <Button onClick={() => checkIn(registration.registration_id)} variant="secondary">
              <CheckCircle2 size={17} /> Check in
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
