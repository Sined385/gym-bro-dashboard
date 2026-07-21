import type { UserDeviceToken } from "@/lib/queries";
import { CopyableId } from "../../../_components/copyable-id";

export function UserDeviceTokens({ tokens }: { tokens: UserDeviceToken[] }) {
  if (tokens.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-300">
        Push devices
      </h3>
      <div className="space-y-2">
        {tokens.map((t) => (
          <div key={t.id} className="flex items-center gap-3 text-xs">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                t.is_active ? "bg-emerald-400" : "bg-gray-600"
              }`}
              title={t.is_active ? "Active" : "Inactive"}
            />
            <span className="w-10 shrink-0 uppercase text-gray-400">
              {t.platform ?? "?"}
            </span>
            <CopyableId id={t.token} label="FCM token" truncate />
            <span className="ml-auto shrink-0 text-gray-500">
              {new Date(t.updated_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
