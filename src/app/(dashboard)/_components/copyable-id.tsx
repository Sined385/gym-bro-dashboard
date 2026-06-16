"use client";

import { useState } from "react";

export function CopyableId({
  id,
  truncate = false,
  label = "ID",
}: {
  id: string;
  truncate?: boolean;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore — clipboard unavailable (non-HTTPS, etc.)
    }
  };

  const display = truncate ? `${id.slice(0, 8)}…` : id;

  return (
    <button
      type="button"
      onClick={onCopy}
      title={copied ? "Copied" : `Copy ${label}: ${id}`}
      className="inline-flex items-center gap-1 rounded border border-gray-800 bg-gray-900/40 px-1.5 py-0.5 font-mono text-[11px] text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors"
    >
      <span className="select-all">{display}</span>
      <span className="text-[10px] text-gray-500">{copied ? "✓" : "⧉"}</span>
    </button>
  );
}
