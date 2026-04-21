"use client";

import { useTransition } from "react";
import { grantPremium, revokePremium } from "../actions";

interface UserSubscriptionProps {
  userId: string;
  isPremium: boolean;
  premiumSource: string | null;
  premiumGrantedAt: string | null;
  premiumExpiresAt: string | null;
  storekitProductId: string | null;
  coachMessagesUsed: number;
}

export function UserSubscription({
  userId,
  isPremium,
  premiumSource,
  premiumGrantedAt,
  premiumExpiresAt,
  storekitProductId,
  coachMessagesUsed,
}: UserSubscriptionProps) {
  const [isPending, startTransition] = useTransition();

  const handleGrant = () => {
    startTransition(async () => {
      await grantPremium(userId);
    });
  };

  const handleRevoke = () => {
    startTransition(async () => {
      await revokePremium(userId);
    });
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Subscription</h2>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            isPremium
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-gray-700/50 text-gray-400 border border-gray-700"
          }`}
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Source</p>
          <p className="text-gray-200 font-medium">
            {premiumSource ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Granted</p>
          <p className="text-gray-200 font-medium">
            {premiumGrantedAt
              ? new Date(premiumGrantedAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Expires</p>
          <p className="text-gray-200 font-medium">
            {premiumExpiresAt
              ? new Date(premiumExpiresAt).toLocaleDateString()
              : isPremium
              ? "Never"
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Product ID</p>
          <p className="text-gray-200 font-medium font-mono text-xs">
            {storekitProductId ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Coach Messages Used</p>
          <p className="text-gray-200 font-medium">
            {coachMessagesUsed}
            {!isPremium && <span className="text-gray-500"> / 20</span>}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {!isPremium && (
          <button
            onClick={handleGrant}
            disabled={isPending}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Granting..." : "Grant Premium"}
          </button>
        )}
        {isPremium && premiumSource === "admin" && (
          <button
            onClick={handleRevoke}
            disabled={isPending}
            className="rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Revoking..." : "Revoke Premium"}
          </button>
        )}
        {isPremium && premiumSource === "storekit" && (
          <p className="text-xs text-gray-500 self-center">
            StoreKit subscription — cannot be revoked from dashboard
          </p>
        )}
      </div>
    </div>
  );
}
