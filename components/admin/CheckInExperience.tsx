"use client";

import { useState } from "react";
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
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold uppercase transition-all ${
              activeTab === "scan"
                ? "admin-glow-active bg-kinetic-primary-container text-kinetic-on-primary-container"
                : "text-kinetic-on-surface-variant hover:text-kinetic-primary"
            }`}
          >
            Scan QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold uppercase transition-all ${
              activeTab === "search"
                ? "admin-glow-active bg-kinetic-primary-container text-kinetic-on-primary-container"
                : "text-kinetic-on-surface-variant hover:text-kinetic-primary"
            }`}
          >
            Manual Search
          </button>
        </div>
      </div>

      {activeTab === "scan" ? <QRScanner /> : <ManualSearch registrations={registrations} />}
    </div>
  );
}
