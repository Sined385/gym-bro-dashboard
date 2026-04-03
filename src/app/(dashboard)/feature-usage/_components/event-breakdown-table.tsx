import type { EventBreakdown } from "@/lib/queries";

export function EventBreakdownTable({ data }: { data: EventBreakdown[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        By Event
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">Event</th>
              <th className="pb-3 pr-4 text-right">Count</th>
              <th className="pb-3 pr-4 text-right">Users</th>
              <th className="pb-3 text-right">7d</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.map((row) => (
              <tr key={row.eventName} className="text-gray-300">
                <td className="py-2.5 pr-4 font-medium font-mono text-xs">
                  {row.eventName}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.count.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {row.uniqueUsers.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-mono text-xs text-green-400">
                  {row.last7d.toLocaleString()}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-600">
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
