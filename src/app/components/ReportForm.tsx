"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CROWDS = [
  { value: "empty", label: "Empty", hint: "No queue", icon: "🟢" },
  { value: "moderate", label: "Moderate", hint: "Moving", icon: "🟡" },
  { value: "packed", label: "Packed", hint: "Long queue", icon: "🟠" },
  { value: "overflowing", label: "Overflowing", hint: "Avoid if you can", icon: "🔴" },
];

const MODES = [
  { value: "minibus", label: "Minibus" },
  { value: "city_bus", label: "City bus" },
  { value: "train", label: "Light rail" },
  { value: "taxi", label: "Taxi" },
  { value: "bajaj", label: "Bajaj" },
];

export default function ReportForm({
  stationId,
  stationName,
  isLoggedIn,
}: {
  stationId: number;
  stationName: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [crowd, setCrowd] = useState("moderate");
  const [waitMinutes, setWaitMinutes] = useState(10);
  const [mode, setMode] = useState("minibus");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage(null);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId, crowd, waitMinutes, mode, note }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Could not save the report.");
      setState("done");
      setMessage(data.message);
      setNote("");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage((error as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-forest/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Report the queue at {stationName}</h2>
          <p className="mt-0.5 text-xs text-ink/55">Helps the next rider decide in seconds. Live for 3 hours.</p>
        </div>
        <span className="shrink-0 rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-900">
          +2 pts
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CROWDS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setCrowd(option.value)}
            className={`rounded-2xl border px-2.5 py-2.5 text-left transition ${
              crowd === option.value ? "border-forest bg-forest/5" : "border-forest/10 hover:border-forest/25"
            }`}
          >
            <span className="text-base" aria-hidden>{option.icon}</span>
            <span className="mt-1 block text-xs font-semibold text-ink">{option.label}</span>
            <span className="block text-[10px] text-ink/50">{option.hint}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
            Waiting time · {waitMinutes} min
          </span>
          <input
            type="range"
            min={0}
            max={120}
            step={5}
            value={waitMinutes}
            onChange={(event) => setWaitMinutes(Number(event.target.value))}
            className="mt-2 w-full accent-forest"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Transport</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none"
          >
            {MODES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Note (optional)</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          maxLength={400}
          placeholder="e.g. extra minibuses arrived, the queue is only for Kality…"
          className="mt-1.5 w-full resize-none rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35"
        />
      </label>

      {message ? (
        <p
          className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium ${
            state === "error" ? "bg-brick/10 text-brick" : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "saving"}
        className="mt-4 w-full rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest/90 disabled:opacity-60"
      >
        {state === "saving" ? "Saving report…" : "Share queue report"}
      </button>

      {!isLoggedIn ? (
        <p className="mt-2 text-center text-[11px] text-ink/50">
          Reporting as a guest.{" "}
          <Link href="/login" className="font-semibold text-forest hover:underline">Log in</Link> to earn points and badges.
        </p>
      ) : null}
    </form>
  );
}
