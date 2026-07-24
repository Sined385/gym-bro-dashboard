"use client";

import { useActionState } from "react";
import { createPromoCode } from "../actions";

const DURATIONS = [
  { label: "1 week", value: 7 },
  { label: "1 month", value: 30 },
  { label: "3 months", value: 90 },
  { label: "1 year", value: 365 },
];

const inputClass =
  "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50";

export function CreateCodeForm() {
  const [error, formAction, isPending] = useActionState(createPromoCode, null);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Create promo code
      </h2>
      <form
        action={formAction}
        className="grid grid-cols-1 gap-4 md:grid-cols-4"
      >
        <div>
          <label
            htmlFor="code"
            className="mb-1 block text-xs uppercase text-gray-500"
          >
            Code
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="LAUNCH2026"
            className={`${inputClass} font-mono uppercase`}
          />
        </div>

        <div>
          <label
            htmlFor="duration_days"
            className="mb-1 block text-xs uppercase text-gray-500"
          >
            Premium duration
          </label>
          <select id="duration_days" name="duration_days" className={inputClass}>
            {DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="expires_at"
            className="mb-1 block text-xs uppercase text-gray-500"
          >
            Redeemable until
          </label>
          <input
            id="expires_at"
            name="expires_at"
            type="date"
            required
            className={inputClass}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Creating…" : "Create code"}
          </button>
        </div>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
