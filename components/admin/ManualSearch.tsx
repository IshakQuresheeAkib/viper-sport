"use client";

import { CheckCircle2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { KineticInput } from "@/components/ui/Input";
import { matchesPhoneSearch } from "@/lib/phone";
import type { CheckInResponse, Registration } from "@/types";

function getInitials(registration: Registration) {
  return `${registration.first_name[0] ?? ""}${registration.last_name[0] ?? ""}`.toUpperCase();
}

export function ManualSearch({
  registrations,
}: {
  registrations: Registration[];
}) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localRegistrations, setLocalRegistrations] = useState(registrations);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return localRegistrations
      .filter((registration) => {
        const name =
          `${registration.first_name} ${registration.last_name}`.toLowerCase();
        return (
          name.includes(normalized) ||
          matchesPhoneSearch(registration.phone, normalized) ||
          registration.registration_id.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 6);
  }, [query, localRegistrations]);

  const selected =
    matches.find((registration) => registration.id === selectedId) ??
    (matches.length === 1 ? matches[0] : null);

  async function checkIn(registrationId: string) {
    const response = await fetch("/api/admin/checkin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registration_id: registrationId }),
    });

    if (!response.ok) {
      setMessage("Could not check in this registration.");
      return;
    }

    const payload = (await response.json()) as CheckInResponse;
    setMessage(
      payload.already_checked_in
        ? "Already checked in."
        : "Check-in confirmed.",
    );
    setLocalRegistrations((current) =>
      current.map((registration) =>
        registration.registration_id === registrationId
          ? {
              ...registration,
              checked_in: true,
              checked_in_at: payload.checked_in_at,
            }
          : registration,
      ),
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6">
      <KineticInput
        id="manual-search"
        label="Search registrations"
        icon={<Search className="size-5" />}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedId(null);
          setMessage(null);
        }}
        placeholder="Search by phone, name, or ID..."
        type="search"
        value={query}
      />

      <div aria-live="polite" aria-atomic="true" className="min-h-5">
        {message ? (
          <p className="text-center text-sm font-semibold text-kinetic">
            {message}
          </p>
        ) : null}
      </div>

      {query.trim() ? (
        <div className="flex flex-col gap-2">
          {matches.length === 0 ? (
            <p className="py-8 text-center text-sm text-kinetic-on-surface-variant">
              No matching registrations found.
            </p>
          ) : (
            matches.map((registration) => (
              <button
                key={registration.id}
                type="button"
                aria-pressed={selected?.id === registration.id}
                onClick={() => setSelectedId(registration.id)}
                className={`flex w-full cursor-pointer items-center justify-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  selected?.id === registration.id
                    ? "admin-glow-active border-kinetic/30 bg-white/10"
                    : "border-white/5 bg-kinetic-surface-container hover:bg-white/10"
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-full border border-white/60 bg-kinetic-surface-bright  text-sm font-bold text-kinetic-primary">
                  {getInitials(registration)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-kinetic-on-surface">
                    {registration.first_name} {registration.last_name}
                  </p>
                  <p className="truncate text-xs text-kinetic-on-surface-variant">
                    {registration.phone} · {registration.registration_id}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}

      {selected ? (
        <div className="admin-glass-card admin-glow-active overflow-hidden rounded-xl border-t-2 border-t-kinetic">
          <div className="flex items-center gap-4 border-b border-white/10 p-6">
            <div className="flex size-16 items-center justify-center rounded-full border border-white/5 bg-kinetic-surface-variant  text-xl font-bold text-kinetic-primary">
              {getInitials(selected)}
            </div>
            <div className="flex-1">
              <h3 className=" text-xl font-bold text-kinetic-primary">
                {selected.first_name} {selected.last_name}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-kinetic-on-surface-variant">
                ID: {selected.registration_id}
              </p>
            </div>
          </div>
          <div className="sm:grid grid-cols-2 justify-between gap-4 bg-kinetic-surface/50 px-6 py-4">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase text-kinetic-on-surface-variant">
                Phone
              </span>
              <span className=" text-lg font-bold text-kinetic-on-surface">
                {selected.phone}
              </span>
            </div>
            <div className="w-fit">
              <span className="mb-1 block text-xs font-bold uppercase text-kinetic-on-surface-variant">
                Status
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-kinetic">
                <span className="size-2 rounded-full bg-kinetic" />
                {selected.checked_in ? "Checked in" : "Clear"}
              </span>
            </div>
          </div>
          <div className="p-6">
            <Button
              type="button"
              variant="coral"
              fullWidth
              disabled={selected.checked_in}
              onClick={() => void checkIn(selected.registration_id)}
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
