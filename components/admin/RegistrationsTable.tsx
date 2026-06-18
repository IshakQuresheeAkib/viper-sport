"use client";

import { Download, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminStore } from "@/store/useAdminStore";
import type { AdminStatusFilter, Registration } from "@/types";

const statusOptions: { label: string; value: AdminStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Checked-in", value: "checked_in" }
];

function getInitials(registration: Registration) {
  return `${registration.first_name[0] ?? ""}${registration.last_name[0] ?? ""}`.toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function StatusBadge({ checkedIn }: { checkedIn: boolean }) {
  if (checkedIn) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-kinetic-primary-container/30 bg-kinetic-primary-container/10 px-2.5 py-1 text-xs font-bold uppercase text-kinetic-primary-container">
        <span className="size-1.5 rounded-full bg-kinetic-primary-container" />
        Checked-in
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-kinetic-outline-variant bg-kinetic-surface-bright px-2.5 py-1 text-xs font-bold uppercase text-kinetic-on-surface-variant">
      <span className="size-1.5 rounded-full bg-kinetic-outline-variant" />
      Pending
    </span>
  );
}

export function RegistrationsTable({ registrations }: { registrations: Registration[] }) {
  const {
    registrations: storedRegistrations,
    searchTerm,
    statusFilter,
    setRegistrations,
    setSearchTerm,
    setStatusFilter
  } = useAdminStore();

  useEffect(() => {
    setRegistrations(registrations);
  }, [registrations, setRegistrations]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return storedRegistrations.filter((registration) => {
      const matchesQuery =
        !query ||
        `${registration.first_name} ${registration.last_name}`.toLowerCase().includes(query) ||
        registration.phone.includes(query) ||
        registration.registration_id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "checked_in" && registration.checked_in) ||
        (statusFilter === "pending" && !registration.checked_in);

      return matchesQuery && matchesStatus;
    });
  }, [searchTerm, statusFilter, storedRegistrations]);

  function exportCsv() {
    const headers = [
      "Name",
      "Phone",
      "Registration ID",
      "Registered At",
      "Checked In",
      "Checked In At"
    ];
    const rows = filtered.map((registration) => [
      `${registration.first_name} ${registration.last_name}`,
      registration.phone,
      registration.registration_id,
      registration.created_at,
      registration.checked_in ? "Yes" : "No",
      registration.checked_in_at ?? ""
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vipersport-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-2 flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-kinetic-surface-container-low lg:p-6">
      <div className="flex flex-col gap-3 border-b border-white/5 px-4 pb-4 lg:px-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[400px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-kinetic-on-surface-variant"
              aria-hidden="true"
            />
            <input
              className="w-full rounded-lg border border-kinetic-outline-variant bg-kinetic-surface-container-high py-2.5 pl-10 pr-4 text-kinetic-on-surface transition-colors placeholder:text-kinetic-on-surface-variant/50 focus:border-kinetic-primary-container focus:outline-none focus:ring-1 focus:ring-kinetic-primary-container"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name or phone..."
              value={searchTerm}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="neutral"
                  active={statusFilter === option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-xs normal-case whitespace-nowrap ${
                    statusFilter !== option.value
                      ? "border-kinetic-outline-variant bg-kinetic-surface-container-highest text-kinetic-on-surface-variant shadow-none hover:bg-kinetic-surface-bright"
                      : ""
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="neutral"
              onClick={exportCsv}
              className="rounded-full border-kinetic-outline-variant bg-kinetic-surface-container-highest px-4 py-2 text-sm normal-case text-kinetic-on-surface-variant hover:bg-kinetic-surface-bright"
            >
              <Download className="size-4" aria-hidden="true" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5  lg:hidden">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-kinetic-on-surface-variant">
            No registrations match your filters.
          </p>
        ) : (
          filtered.map((registration) => (
            <div
              key={registration.id}
              className={`relative grid grid-cols-1 items-center gap-1 px-1 sm:px-4 py-3 transition-colors md:grid-cols-12 md:gap-4 ${
                registration.checked_in
                  ? "admin-data-strip bg-kinetic-surface-container hover:bg-kinetic-surface-container-highest"
                  : "border-l-2 border-transparent bg-kinetic-surface-container hover:bg-kinetic-surface-container-highest"
              }`}
            >
              <div className="col-span-1 flex items-center gap-3 md:col-span-5">
                <div
                  className={`hidden sm:flex size-10 items-center justify-center rounded-full border border-kinetic-outline-variant bg-kinetic-surface-bright font-display text-sm font-bold ${
                    registration.checked_in ? "text-kinetic-primary" : "text-kinetic-on-surface-variant"
                  }`}
                >
                  {getInitials(registration)}
                </div>
                <div>
                  <h3 className="font-bold text-kinetic-on-surface">
                    {registration.first_name} {registration.last_name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-kinetic-on-surface-variant md:hidden">
                    {registration.phone}
                  </p>
                </div>
              </div>
              <div className="hidden md:col-span-4 md:block">
                <p className="font-mono text-sm text-kinetic-on-surface-variant">{registration.phone}</p>
              </div>
              <div className="absolute right-4 top-4 md:relative md:right-0 md:top-0 md:col-span-3 md:flex md:justify-end">
                <StatusBadge checkedIn={registration.checked_in} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-kinetic-surface-bright bg-kinetic-surface-container">
              <th className="rounded-tl-lg px-4 py-3 text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Athlete
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Contact
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Registration ID
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Reg. Date
              </th>
              <th className="rounded-tr-lg px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-kinetic-surface-container-highest bg-kinetic-surface">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-kinetic-on-surface-variant">
                  No registrations match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((registration) => (
                <tr
                  key={registration.id}
                  className={`transition-colors hover:bg-kinetic-surface-container-highest ${
                    registration.checked_in ? "admin-data-strip" : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full border border-kinetic-outline-variant bg-kinetic-surface-bright font-display text-sm font-bold ${
                          registration.checked_in
                            ? "text-kinetic-primary"
                            : "text-kinetic-on-surface-variant"
                        }`}
                      >
                        {getInitials(registration)}
                      </div>
                      <h3 className="font-bold text-kinetic-on-surface">
                        {registration.first_name} {registration.last_name}
                      </h3>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <p className="font-mono text-sm text-kinetic-on-surface-variant">
                      {registration.phone}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="rounded bg-kinetic-surface-bright px-2 py-1 font-mono text-sm text-kinetic-on-surface">
                      {registration.registration_id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-kinetic-on-surface-variant">
                    {formatDate(registration.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <StatusBadge checkedIn={registration.checked_in} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 ? (
        <div className="flex justify-center border-t border-kinetic-surface-bright py-4 lg:border-none">
          <p className="text-xs font-bold uppercase tracking-wider text-kinetic-on-surface-variant">
            Showing {filtered.length} registration{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
      ) : null}
    </section>
  );
}
