import type { UserActivity } from "@/lib/queries";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function UserActivityTable({ users }: { users: UserActivity[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4 text-right">Workouts</th>
              <th className="pb-3 pr-4">Last Active</th>
              <th className="pb-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {users.map((u) => (
              <tr key={u.id} className="text-gray-300">
                <td className="py-2.5 pr-4 font-medium">
                  {u.full_name || (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="py-2.5 pr-4 text-xs text-gray-400">
                  {u.email}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs">
                  {u.workout_count > 0 ? (
                    <span className="text-primary">{u.workout_count}</span>
                  ) : (
                    <span className="text-gray-600">0</span>
                  )}
                </td>
                <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-gray-500">
                  {timeAgo(u.last_active)}
                </td>
                <td className="whitespace-nowrap py-2.5 text-xs text-gray-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-600">
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
