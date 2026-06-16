import type { Registration } from "@/types";

export function StatsCards({ registrations }: { registrations: Registration[] }) {
  const total = registrations.length;
  const checkedIn = registrations.filter((registration) => registration.checked_in).length;
  const remaining = total - checkedIn;
  const cards = [
    { label: "Total registrations", value: total },
    { label: "Checked in", value: checkedIn },
    { label: "Remaining", value: remaining }
  ];

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="surface rounded-md p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-3 text-4xl font-black">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
