"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPES = [
  { value: "new_station", label: "New station", hint: "A tera we have not mapped yet" },
  { value: "moved_station", label: "Station moved", hint: "The stand is now somewhere else" },
  { value: "route", label: "Route change", hint: "A line was added, removed or rerouted" },
  { value: "fare", label: "Fare update", hint: "The price riders pay changed" },
  { value: "correction", label: "Correction", hint: "Fix a detail on an existing station" },
];

export default function ContributeForm({
  initialStationName,
  isLoggedIn,
}: {
  initialStationName?: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [type, setType] = useState("new_station");
  const [stationName, setStationName] = useState(initialStationName ?? "");
  const [area, setArea] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage("This browser cannot share a location. Type the coordinates instead.");
      setState("error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(5));
        setLng(position.coords.longitude.toFixed(5));
        setLocating(false);
      },
      () => {
        setLocating(false);
        setMessage("Location permission was not granted. You can still submit the text update.");
        setState("error");
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage(null);
    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, stationName, area, lat, lng, details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Could not submit the update.");
      setState("done");
      setMessage(data.message);
      setStationName("");
      setArea("");
      setLat("");
      setLng("");
      setDetails("");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage((error as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-forest/10 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Tell us what changed</h2>
          <p className="mt-1 text-xs text-ink/55">Reviewed by community moderators. Approved updates earn badges.</p>
        </div>
        <span className="shrink-0 rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-900">
          +12 pts
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            className={`rounded-2xl border px-3 py-2.5 text-left transition ${
              type === option.value ? "border-forest bg-forest/5" : "border-forest/10 hover:border-forest/25"
            }`}
          >
            <span className="block text-xs font-semibold text-ink">{option.label}</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-ink/50">{option.hint}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Station name *</span>
          <input
            value={stationName}
            onChange={(event) => setStationName(event.target.value)}
            required
            maxLength={90}
            placeholder="e.g. Ayat Zone 5 Tera"
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/40"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Area / neighbourhood</span>
          <input
            value={area}
            onChange={(event) => setArea(event.target.value)}
            maxLength={60}
            placeholder="e.g. Ayat"
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/40"
          />
        </label>
      </div>

      <div className="mt-3 rounded-2xl border border-forest/10 bg-cream/50 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Pin the exact spot (optional)</p>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="rounded-full border border-forest/20 bg-white px-3 py-1 text-[11px] font-semibold text-forest disabled:opacity-60"
          >
            {locating ? "Locating…" : "📍 Use my location"}
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            inputMode="decimal"
            placeholder="Latitude"
            className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/35"
          />
          <input
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            inputMode="decimal"
            placeholder="Longitude"
            className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </div>
      </div>

      <label className="mt-3 block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">What changed? *</span>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          required
          rows={4}
          maxLength={900}
          placeholder="Which lines leave from here, where exactly is the stand, what fares are charged, when did it move?"
          className="mt-1.5 w-full resize-y rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/40"
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
        className="mt-4 w-full rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-cream transition hover:bg-forest/90 disabled:opacity-60"
      >
        {state === "saving" ? "Submitting…" : "Submit contribution"}
      </button>

      {!isLoggedIn ? (
        <p className="mt-2 text-center text-[11px] text-ink/50">
          <Link href="/login" className="font-semibold text-forest hover:underline">Log in</Link> to earn points,
          badges and see your submission history.
        </p>
      ) : null}
    </form>
  );
}
