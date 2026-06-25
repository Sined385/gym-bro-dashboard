import type { UserKPIData } from "@/lib/queries";

const cards: { key: keyof UserKPIData; label: string; format: (v: number) => string }[] = [
  { key: "workoutCount", label: "Workouts", format: (v) => v.toLocaleString() },
  { key: "totalDurationMinutes", label: "Total Duration", format: (v) => `${Math.round(v / 60)}h` },
  { key: "avgDurationMinutes", label: "Avg Duration", format: (v) => `${v} min` },
  { key: "totalCalories", label: "Calories", format: (v) => v.toLocaleString() },
  { key: "coachMessages", label: "Coach Messages", format: (v) => v.toLocaleString() },
  { key: "postCount", label: "Posts", format: (v) => v.toLocaleString() },
  { key: "reactionsReceived", label: "Reactions", format: (v) => v.toLocaleString() },
  { key: "followerCount", label: "Followers", format: (v) => v.toLocaleString() },
];

export function UserKPICards({ data }: { data: UserKPIData }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-xl border border-gray-800 bg-gray-900 p-4"
        >
          <p className="text-xs text-gray-400">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">
            {card.format(data[card.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
