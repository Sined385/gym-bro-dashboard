import type { RecentEvent } from "@/lib/queries";

const badgeColors: Record<string, string> = {
  user_registered: "bg-green-900/50 text-green-400 border-green-800",
  session_completed: "bg-blue-900/50 text-blue-400 border-blue-800",
};

function EventBadge({ name }: { name: string }) {
  const color =
    badgeColors[name] ?? "bg-gray-800 text-gray-400 border-gray-700";
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {name}
    </span>
  );
}

export function RecentEventsTable({ events }: { events: RecentEvent[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Recent Events
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">Event</th>
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Details</th>
              <th className="pb-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {events.map((e) => (
              <tr key={e.id} className="text-gray-300">
                <td className="py-2.5 pr-4">
                  <EventBadge name={e.event_name} />
                </td>
                <td className="py-2.5 pr-4">
                  <div className="text-sm">
                    {e.user_name || e.user_email || (
                      <span className="font-mono text-xs text-gray-500">
                        {e.user_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                  {e.user_name && e.user_email && (
                    <div className="text-xs text-gray-500">{e.user_email}</div>
                  )}
                </td>
                <td className="max-w-xs truncate py-2.5 pr-4 font-mono text-xs text-gray-500">
                  {Object.keys(e.properties).length > 0
                    ? JSON.stringify(e.properties)
                    : "—"}
                </td>
                <td className="whitespace-nowrap py-2.5 text-xs text-gray-500">
                  {new Date(e.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-600">
                  No events yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
