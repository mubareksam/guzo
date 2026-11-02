"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";

export default function ReviewActions({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "approve" | "reject") {
    setBusy(action);
    setError(null);
    const r = await fetch("/api/admin/contributions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    let d: { error?: string } = {};
    try { d = await r.json(); } catch { if (r.ok) { router.refresh(); return; } }
    setBusy(null);
    if (!r.ok) setError(d.error ?? `Failed (${r.status})`);
    else router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button type="button" disabled={!!busy} onClick={() => act("approve")} className="inline-flex items-center gap-1 rounded-full bg-forest px-3.5 py-2 text-xs font-bold text-cream disabled:opacity-50">
          <Check size={14} /> {busy === "approve" ? "…" : "Approve"}
        </button>
        <button type="button" disabled={!!busy} onClick={() => act("reject")} className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold text-brick ring-1 ring-brick/30 disabled:opacity-50">
          <X size={14} /> {busy === "reject" ? "…" : "Reject"}
        </button>
      </div>
      {error ? <p className="text-[11px] text-brick">{error}</p> : null}
    </div>
  );
}
