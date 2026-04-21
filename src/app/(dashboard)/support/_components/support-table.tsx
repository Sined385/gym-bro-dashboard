"use client";

import { useState } from "react";
import type { SupportRequest } from "@/lib/queries";

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-900/50 text-red-300",
  feature: "bg-blue-900/50 text-blue-300",
  account: "bg-yellow-900/50 text-yellow-300",
  other: "bg-gray-800 text-gray-300",
};

export function SupportTable({ data }: { data: SupportRequest[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Support Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.map((row) => {
              const isExpanded = expandedId === row.id;
              return (
                <tr
                  key={row.id}
                  className="text-gray-300 hover:bg-gray-800/50 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : row.id)
                  }
                >
                  <td className="py-2.5 pr-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 pr-4 font-medium">{row.name}</td>
                  <td className="py-2.5 pr-4 text-xs text-gray-400">
                    {row.email}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[row.category] ?? CATEGORY_COLORS.other}`}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-gray-400 max-w-xs">
                    {isExpanded ? (
                      <span className="whitespace-pre-wrap">{row.message}</span>
                    ) : (
                      <span className="truncate block max-w-xs">
                        {row.message.length > 80
                          ? row.message.slice(0, 80) + "..."
                          : row.message}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-600">
                  No support requests yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
