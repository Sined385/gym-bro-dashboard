import type { RetentionCohort } from "@/lib/queries";

function cellStyle(pct: number | null) {
  if (pct === null) return {};
  // Brand coral, opacity scaled by retention strength
  return { backgroundColor: `rgba(232, 106, 117, ${0.08 + (pct / 100) * 0.72})` };
}

export function RetentionTable({ cohorts }: { cohorts: RetentionCohort[] }) {
  const weekCount = cohorts[0]?.weeks.length ?? 8;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-1 text-sm font-medium text-gray-400">
        Weekly Retention Cohorts
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        % of each signup cohort with any app activity in week N after signup.
      </p>

      {cohorts.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No signups yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2 pr-3 font-medium">Cohort week</th>
                <th className="pb-2 pr-3 font-medium">Users</th>
                {Array.from({ length: weekCount }, (_, i) => (
                  <th key={i} className="pb-2 text-center font-medium">
                    W{i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => (
                <tr key={c.cohortWeek} className="border-t border-gray-800">
                  <td className="py-1.5 pr-3 text-gray-300">{c.cohortWeek}</td>
                  <td className="py-1.5 pr-3 text-gray-400">{c.size}</td>
                  {c.weeks.map((pct, i) => (
                    <td key={i} className="px-0.5 py-1.5">
                      <div
                        className="rounded px-1 py-0.5 text-center text-xs"
                        style={cellStyle(pct)}
                      >
                        {pct === null ? (
                          <span className="text-gray-700">·</span>
                        ) : (
                          `${pct}%`
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
