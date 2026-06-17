"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ManualSearch } from "@/components/admin/ManualSearch";
import { QRScanner } from "@/components/admin/QRScanner";
import type { Registration } from "@/types";

type CheckInTab = "scan" | "search";

interface CheckInExperienceProps {
  registrations: Registration[];
}

export function CheckInExperience({ registrations }: CheckInExperienceProps) {
  const [activeTab, setActiveTab] = useState<CheckInTab>("scan");

  return (
    <div className="flex flex-col">
      <div className="mx-auto mb-8 w-full max-w-md rounded-full border border-white/5 bg-kinetic-surface-variant p-1">
        <div className="grid grid-cols-2 gap-1">
          <Button
            type="button"
            variant="neutral"
            active={activeTab === "scan"}
            className={`rounded-full px-4 py-2 text-sm normal-case ${
              activeTab !== "scan"
                ? "border-transparent bg-transparent text-kinetic-on-surface-variant shadow-none hover:bg-transparent hover:text-kinetic-primary"
                : ""
            }`}
            onClick={() => setActiveTab("scan")}
          >
            Scan QR
          </Button>
          <Button
            type="button"
            variant="neutral"
            active={activeTab === "search"}
            className={`rounded-full px-4 py-2 text-sm normal-case ${
              activeTab !== "search"
                ? "border-transparent bg-transparent text-kinetic-on-surface-variant shadow-none hover:bg-transparent hover:text-kinetic-primary"
                : ""
            }`}
            onClick={() => setActiveTab("search")}
          >
            Manual Search
          </Button>
        </div>
      </div>

      {activeTab === "scan" ? (
        <QRScanner registrations={registrations} />
      ) : (
        <ManualSearch registrations={registrations} />
      )}
    </div>
  );
}
