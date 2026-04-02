import Link from "next/link";
import type { AiUsageByUser } from "@/lib/queries";

const FEATURE_LABELS: Record<string, string> = {
  coach_chat: "Coach Chat",
  motivation: "Motivation",
  quick_workout: "Quick Workout",
  plan_generation: "Plan Gen",
  completion_notes: "Completion Notes",
  user_comparison: "Comparison",
};

export function AiUsageUserTable({ data }: { data: AiUsageByUser[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Usage by User
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4 text-right">Calls</th>
              <th className="pb-3 pr-4 text-right">Tokens</th>
              <th className="pb-3 pr-4 text-right">Cost</th>
              <th className="pb-3">Top Feature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.map((row) => (
              <tr
                key={row.userId}
                className="text-gray-300 hover:bg-gray-800/50"
              >
                <td className="py-2.5 pr-4">
                  <Link
                    href={`/users/${row.userId}`}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {row.fullName || row.email}
                  </Link>
                  {row.fullName && (
                    <div className="text-xs text-gray-500">{row.email}</div>
                  )}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.calls.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.totalTokens.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs text-primary">
                  ${row.totalCost.toFixed(4)}
                </td>
                <td className="py-2.5 text-xs text-gray-500">
                  {row.topFeature
                    ? FEATURE_LABELS[row.topFeature] ?? row.topFeature
                    : "—"}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-600">
                  No AI usage data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
