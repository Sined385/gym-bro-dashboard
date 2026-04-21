import type { SupportKPIs } from "@/lib/queries";

export function SupportKPICards({ data }: { data: SupportKPIs }) {
  const cards = [
    { label: "Total Requests", value: data.total.toLocaleString() },
    { label: "Last 7 Days", value: data.last7d.toLocaleString() },
    { label: "Today", value: data.today.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
