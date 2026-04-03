import type { CategoryBreakdown } from "@/lib/queries";

const CATEGORY_COLORS: Record<string, string> = {
  Calendar: "bg-blue-500/20 text-blue-400",
  Workout: "bg-red-500/20 text-red-400",
  Sharing: "bg-purple-500/20 text-purple-400",
  Community: "bg-green-500/20 text-green-400",
  Coach: "bg-amber-500/20 text-amber-400",
  Plan: "bg-indigo-500/20 text-indigo-400",
  Profile: "bg-pink-500/20 text-pink-400",
  Notifications: "bg-cyan-500/20 text-cyan-400",
  Other: "bg-gray-500/20 text-gray-400",
};

export function CategoryBreakdownTable({ data }: { data: CategoryBreakdown[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        By Category
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4 text-right">Events</th>
              <th className="pb-3 text-right">Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.map((row) => (
              <tr key={row.category} className="text-gray-300">
                <td className="py-2.5 pr-4">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[row.category] ?? CATEGORY_COLORS.Other}`}
                  >
                    {row.category}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.totalEvents.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-mono text-xs">
                  {row.uniqueUsers.toLocaleString()}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-600">
                  No event data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
