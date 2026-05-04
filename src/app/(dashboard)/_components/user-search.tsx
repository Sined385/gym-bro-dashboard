"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export function UserSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleChange(value: string) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set("q", value.trim());
        } else {
          params.delete("q");
        }
        router.push(`/?${params.toString()}`);
      });
    }, 300);
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search users..."
        defaultValue={defaultValue ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        className="w-56 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
      />
      {isPending && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-600 border-t-primary" />
        </div>
      )}
    </div>
  );
}
