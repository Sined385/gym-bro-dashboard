import type { UserCoachStatsData } from "@/lib/queries";

export function UserCoachStats({ data }: { data: UserCoachStatsData }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Coach Chat Stats
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Conversations</p>
          <p className="text-lg font-bold text-gray-100">{data.conversationCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Messages Sent</p>
          <p className="text-lg font-bold text-gray-100">{data.userMessages}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">AI Responses</p>
          <p className="text-lg font-bold text-gray-100">{data.aiMessages}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">First / Last Message</p>
          <p className="text-xs text-gray-300">
            {data.firstMessageAt
              ? new Date(data.firstMessageAt).toLocaleDateString()
              : "—"}{" "}
            →{" "}
            {data.lastMessageAt
              ? new Date(data.lastMessageAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
