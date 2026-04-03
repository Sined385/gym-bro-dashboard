import type { FeatureUsageKPIs } from "@/lib/queries";

export function FeatureUsageKPICards({ data }: { data: FeatureUsageKPIs }) {
  const cards = [
    { label: "Total Events", value: data.totalEvents.toLocaleString() },
    { label: "Unique Users", value: data.uniqueUsers.toLocaleString() },
    { label: "Events (7d)", value: data.events7d.toLocaleString() },
    { label: "Users (7d)", value: data.uniqueUsers7d.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-800 bg-gray-900 p-5"
        >
          <p className="text-sm text-gray-400">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
