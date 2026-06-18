import { ClipboardCheck, Clock3, Users } from "lucide-react";
import type { Registration } from "@/types";

function formatStatValue(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(value);
}

export function StatsCards({
  registrations,
}: {
  registrations: Registration[];
}) {
  const total = registrations.length;
  const checkedIn = registrations.filter(
    (registration) => registration.checked_in,
  ).length;
  const remaining = total - checkedIn;
  const checkedInPercent =
    total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const cards = [
    {
      label: "Total Registered",
      value: formatStatValue(total),
      icon: Users,
      progress: 100,
      progressClass: "bg-kinetic-secondary-fixed-dim",
      active: false,
    },
    {
      label: "Checked In",
      value: formatStatValue(checkedIn),
      suffix: total > 0 ? `${checkedInPercent}%` : undefined,
      icon: ClipboardCheck,
      progress: checkedInPercent,
      progressClass:
        "bg-linear-to-r from-kinetic-primary-container to-kinetic-primary-fixed shadow-[0_0_10px_rgba(211,237,134,0.8)]",
      active: true,
    },
    {
      label: "Remaining",
      value: formatStatValue(remaining),
      icon: Clock3,
      progress: total > 0 ? Math.round((remaining / total) * 100) : 0,
      progressClass: "bg-kinetic-secondary-fixed-dim",
      active: false,
      footer: "Awaiting arrival",
    },
  ] as const;

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`admin-glass-card relative flex flex-col justify-between overflow-hidden rounded-xl p-4 md:p-6 ${
              card.active
                ? "admin-glow-active border-kinetic-primary-container/50"
                : ""
            } ${card.label === "Remaining" ? "col-span-2 md:col-span-1" : "col-span-1"}`}
          >
            {card.active ? (
              <div className="pointer-events-none absolute inset-0 z-0 bg-kinetic-primary-container/5" />
            ) : null}
            <div className="absolute right-0 top-0 p-3 opacity-20">
              <Icon
                className="size-10 text-kinetic-surface-bright md:size-[60px]"
                aria-hidden="true"
              />
            </div>
            <div className="relative z-10">
              <p
                className={`mb-1 text-xs font-bold uppercase ${
                  card.active
                    ? "flex items-center gap-2 text-kinetic-primary-container"
                    : "text-kinetic-on-surface-variant"
                }`}
              >
                {card.label}
                {card.active ? (
                  <span className="size-2 motion-safe:animate-pulse rounded-full bg-kinetic-primary-container" />
                ) : null}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold tracking-tighter text-kinetic-primary md:text-6xl">
                  {card.value}
                </span>
                {"suffix" in card && card.suffix ? (
                  <span className="text-sm font-bold text-kinetic-primary-container/80">
                    {card.suffix}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="relative z-10 mt-4 h-1 overflow-hidden rounded-full bg-kinetic-surface-bright">
              <div
                role="progressbar"
                aria-label={`${card.label} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={card.progress}
                className={`h-full ${card.progressClass}`}
                style={{ width: `${card.progress}%` }}
              />
            </div>
            {"footer" in card && card.footer ? (
              <p className="relative z-10 mt-3 text-xs font-bold uppercase text-kinetic-on-surface-variant">
                {card.footer}
              </p>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
