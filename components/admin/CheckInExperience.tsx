"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { ManualSearch } from "@/components/admin/ManualSearch";
import { QRScanner } from "@/components/admin/QRScanner";
import type { Registration } from "@/types";

type CheckInTab = "scan" | "search";

interface CheckInExperienceProps {
  registrations: Registration[];
}

const tabs: { id: CheckInTab; label: string }[] = [
  { id: "scan", label: "Scan QR" },
  { id: "search", label: "Manual Search" },
];

export function CheckInExperience({ registrations }: CheckInExperienceProps) {
  const [activeTab, setActiveTab] = useState<CheckInTab>("scan");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    setActiveTab(tabs[nextIndex]?.id ?? "scan");
    focusTab(nextIndex);
  }

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    if (index >= 0) {
      tabRefs.current[index]?.setAttribute("tabindex", "0");
      tabRefs.current.forEach((tab, tabIndex) => {
        if (tab && tabIndex !== index) {
          tab.setAttribute("tabindex", "-1");
        }
      });
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col">
      <div
        role="tablist"
        aria-label="Check-in method"
        className="mx-auto mb-8 w-full max-w-md rounded-full border border-white/5 bg-kinetic-surface-variant p-1"
      >
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab, index) => (
            <Button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`checkin-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`checkin-panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              variant="neutral"
              active={activeTab === tab.id}
              className={`rounded-full px-4 py-2 text-sm normal-case ${
                activeTab !== tab.id
                  ? "border-transparent bg-transparent text-kinetic-on-surface-variant shadow-none hover:bg-transparent hover:text-kinetic-primary"
                  : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`checkin-panel-${activeTab}`}
        aria-labelledby={`checkin-tab-${activeTab}`}
        tabIndex={0}
      >
        {activeTab === "scan" ? (
          <QRScanner registrations={registrations} />
        ) : (
          <ManualSearch registrations={registrations} />
        )}
      </div>
    </div>
  );
}
