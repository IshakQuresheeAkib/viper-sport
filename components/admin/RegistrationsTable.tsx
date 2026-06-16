"use client";

import { Download } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdminStore } from "@/store/useAdminStore";
import type { AdminStatusFilter, Registration } from "@/types";

const statusOptions: { label: string; value: AdminStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Checked in", value: "checked_in" },
  { label: "Pending", value: "pending" }
];

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
        registration.phone.includes(query);
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
    <section className="surface mt-6 rounded-md p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          className="lg:max-w-sm"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or phone"
          value={searchTerm}
        />
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              variant={statusFilter === option.value ? "primary" : "secondary"}
            >
              {option.label}
            </Button>
          ))}
          <Button onClick={exportCsv} variant="secondary">
            <Download size={17} /> CSV
          </Button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3 pr-3">#</th>
              <th className="py-3 pr-3">Name</th>
              <th className="py-3 pr-3">Phone</th>
              <th className="py-3 pr-3">Registration ID</th>
              <th className="py-3 pr-3">Registered At</th>
              <th className="py-3 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((registration, index) => (
              <tr key={registration.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-3">{index + 1}</td>
                <td className="py-3 pr-3 font-semibold">
                  {registration.first_name} {registration.last_name}
                </td>
                <td className="py-3 pr-3">{registration.phone}</td>
                <td className="py-3 pr-3 font-mono">{registration.registration_id}</td>
                <td className="py-3 pr-3">
                  {new Date(registration.created_at).toLocaleString()}
                </td>
                <td className="py-3 pr-3">
                  {registration.checked_in ? (
                    <Badge tone="green">Checked in</Badge>
                  ) : (
                    <Badge tone="amber">Pending</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
