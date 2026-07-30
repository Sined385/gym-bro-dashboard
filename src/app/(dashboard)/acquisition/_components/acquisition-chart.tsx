"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AcquisitionPoint } from "@/lib/queries";

export function AcquisitionChart({ data }: { data: AcquisitionPoint[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Daily Acquisition (30d) — signups vs completed onboarding
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E86A75" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#E86A75" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
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
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="signups"
            name="Signups"
            stroke="#E86A75"
            fill="url(#signupGrad)"
          />
          <Area
            type="monotone"
            dataKey="completedOnboarding"
            name="Completed onboarding"
            stroke="#34D399"
            fill="url(#completedGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
