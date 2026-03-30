"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EffortBucket } from "@/lib/queries";

export function EffortChart({ data }: { data: EffortBucket[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Effort Level Distribution
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="level"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            label={{
              value: "Effort Level",
              position: "insideBottom",
              offset: -2,
              fill: "#6B7280",
              fontSize: 12,
            }}
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
          />
          <Bar dataKey="count" fill="#E86A75" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
