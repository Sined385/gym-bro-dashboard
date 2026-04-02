import type { AiUsageKPIs } from "@/lib/queries";

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function AiUsageKPICards({ data }: { data: AiUsageKPIs }) {
  const cards = [
    { label: "Total Cost", value: `$${fmt(data.totalCost)}` },
    { label: "Total Tokens", value: data.totalTokens.toLocaleString() },
    { label: "Total Calls", value: data.totalCalls.toLocaleString() },
    { label: "Avg Cost/Call", value: `$${fmt(data.avgCostPerCall, 4)}` },
    { label: "Cost (7d)", value: `$${fmt(data.cost7d)}` },
    { label: "Calls (7d)", value: data.calls7d.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
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
