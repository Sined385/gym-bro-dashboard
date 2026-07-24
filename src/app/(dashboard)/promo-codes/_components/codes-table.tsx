"use client";

import { useTransition } from "react";
import type { PromoCodeRow } from "@/lib/queries";
import { deactivatePromoCode } from "../actions";

const DURATION_LABELS: Record<number, string> = {
  7: "1 week",
  30: "1 month",
  90: "3 months",
  365: "1 year",
};

function statusOf(row: PromoCodeRow): "active" | "expired" | "deactivated" {
  if (!row.is_active) return "deactivated";
  if (new Date(row.expires_at) < new Date()) return "expired";
  return "active";
}

// Deterministic YYYY-MM-DD from the PG ::text timestamp — locale-aware
// formatting here hydration-mismatches (server locale != browser locale).
function dateOnly(ts: string | null): string {
  return ts ? ts.slice(0, 10) : "—";
}

const STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  expired: "bg-amber-500/15 text-amber-400",
  deactivated: "bg-gray-700/50 text-gray-400 border border-gray-700",
};

export function CodesTable({ codes }: { codes: PromoCodeRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">Codes</h2>
      {codes.length === 0 ? (
        <p className="text-sm text-gray-500">No promo codes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                <th className="pb-3 pr-4">Code</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Duration</th>
                <th className="pb-3 pr-4">Redeemable until</th>
                <th className="pb-3 pr-4">Redemptions</th>
                <th className="pb-3 pr-4">Last redeemed</th>
                <th className="pb-3 pr-4">Created</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {codes.map((row) => {
                const status = statusOf(row);
                return (
                  <tr
                    key={row.id}
                    className="text-gray-300 hover:bg-gray-800/50"
                  >
                    <td className="py-2.5 pr-4 font-mono text-gray-100">
                      {row.code}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGES[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      {DURATION_LABELS[row.duration_days] ??
                        `${row.duration_days}d`}
                    </td>
                    <td className="py-2.5 pr-4">
                      {dateOnly(row.expires_at)}
                    </td>
                    <td className="py-2.5 pr-4 font-mono">
                      {row.redemption_count}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500">
                      {dateOnly(row.last_redeemed_at)}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500">
                      {dateOnly(row.created_at)}
                    </td>
                    <td className="py-2.5 text-right">
                      {status === "active" && (
                        <button
                          disabled={isPending}
                          onClick={() => {
                            if (
                              confirm(
                                `Deactivate ${row.code}? Users who already redeemed keep their premium.`
                              )
                            ) {
                              startTransition(async () => {
                                await deactivatePromoCode(row.id);
                              });
                            }
                          }}
                          className="rounded-lg border border-gray-700 px-3 py-1 text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200 disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
