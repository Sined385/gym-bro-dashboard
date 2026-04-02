import type { UserAiUsageRow } from "@/lib/queries";

const FEATURE_LABELS: Record<string, string> = {
  coach_chat: "Coach Chat",
  motivation: "Motivation",
  quick_workout: "Quick Workout",
  plan_generation: "Plan Generation",
  completion_notes: "Completion Notes",
  user_comparison: "User Comparison",
};

export function UserAiUsage({ data }: { data: UserAiUsageRow[] }) {
  if (data.length === 0) return null;

  const totalCost = data.reduce((sum, r) => sum + r.totalCost, 0);
  const totalCalls = data.reduce((sum, r) => sum + r.calls, 0);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400">AI Usage</h2>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>
            {totalCalls} calls / ${totalCost.toFixed(4)}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">Feature</th>
              <th className="pb-3 pr-4 text-right">Calls</th>
              <th className="pb-3 pr-4 text-right">Tokens</th>
              <th className="pb-3 text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.map((row) => (
              <tr key={row.feature} className="text-gray-300">
                <td className="py-2.5 pr-4 font-medium">
                  {FEATURE_LABELS[row.feature] ?? row.feature}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.calls.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.totalTokens.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-mono text-xs text-primary">
                  ${row.totalCost.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
