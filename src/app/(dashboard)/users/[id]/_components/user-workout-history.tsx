import type { UserWorkout } from "@/lib/queries";

export function UserWorkoutHistory({ workouts }: { workouts: UserWorkout[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Recent Workouts
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4 text-right">Duration</th>
              <th className="pb-3 text-right">Calories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {workouts.map((w) => (
              <tr key={w.id} className="text-gray-300">
                <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-gray-500">
                  {new Date(w.completed_at).toLocaleDateString()}
                </td>
                <td className="py-2.5 pr-4 font-medium">{w.title}</td>
                <td className="py-2.5 pr-4 text-xs text-gray-400">{w.type}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {w.duration_minutes ? `${w.duration_minutes}m` : "—"}
                </td>
                <td className="py-2.5 text-right font-mono text-xs">
                  {w.calories ?? "—"}
                </td>
              </tr>
            ))}
            {workouts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-600">
                  No workouts yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
