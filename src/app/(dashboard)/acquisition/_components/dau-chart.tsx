"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrendPoint } from "@/lib/queries";

export function DauChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Daily Active Users (30d)
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
          <YAxis tick={{ fill: "#9CA3AF" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
            }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="Active users"
            stroke="#A78BFA"
            fill="url(#dauGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
