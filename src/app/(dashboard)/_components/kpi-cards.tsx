import type { KPIs } from "@/lib/queries";

const cards: { key: keyof KPIs; label: string; suffix: string }[] = [
  { key: "totalUsers", label: "Total Users", suffix: "" },
  { key: "activeWorkout7d", label: "Active Workout (7d)", suffix: "" },
  { key: "activeApp7d", label: "Active App (7d)", suffix: "" },
  { key: "totalWorkouts", label: "Total Workouts", suffix: "" },
  { key: "premiumOrganic", label: "Premium (Organic)", suffix: "" },
  { key: "premiumAdmin", label: "Premium (Admin)", suffix: "" },
  { key: "premiumRate", label: "Premium %", suffix: "%" },
];

export function KPICards({ data }: { data: KPIs }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-xl border border-gray-800 bg-gray-900 p-5"
        >
          <p className="text-sm text-gray-400">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-100">
            {data[card.key].toLocaleString()}
            <span className="text-lg font-normal text-gray-500">
              {card.suffix}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
