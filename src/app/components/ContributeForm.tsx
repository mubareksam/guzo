"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed, Search, X } from "lucide-react";
import dynamic from "next/dynamic";

const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-cream/50" /> });

const TYPES = [
  { value: "new_station", label: "New station", icon: "📍", hint: "A tera we don't have yet" },
  { value: "moved_station", label: "Station moved", icon: "↗️", hint: "The stand is somewhere else now" },
  { value: "route", label: "Route change", icon: "🔄", hint: "A line was added or removed" },
  { value: "fare", label: "Fare update", icon: "💰", hint: "The price has changed" },
  { value: "correction", label: "Correction", icon: "✏️", hint: "Fix name, location or detail" },
];

type StationOption = { id: number; name: string; area: string };

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
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [stations, setStations] = useState<StationOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStationList, setShowStationList] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/places?q=")
      .then((r) => r.json())
      .then((data: { hits: Array<{ id: string; label: string; sublabel: string; kind: string; stationId?: number }> }) => {
        const stationHits = data.hits
          .filter((h) => h.stationId)
          .map((h) => ({ id: h.stationId!, name: h.label, area: h.sublabel.split("·")[1]?.trim() ?? "" }));
        setStations(stationHits);
      })
      .catch(() => {});
  }, []);

  const filteredStations = stations.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function selectStation(s: StationOption) {
    setStationName(s.name);
    setArea(s.area);
    setShowStationList(false);
    setSearchQuery("");
  }

  function handleMapClick(latLng: number, lngVal: number) {
    setLat(latLng);
    setLng(lngVal);
    setShowMap(false);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage("Location is not available on this device.");
      setState("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => setMessage("Could not get your location. Tap the map instead."),
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
        body: JSON.stringify({
          type,
          stationName,
          area,
          lat: lat?.toFixed(5) ?? "",
          lng: lng?.toFixed(5) ?? "",
          details,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Could not submit.");
      setState("done");
      setMessage(data.message);
      setStationName("");
      setArea("");
      setLat(null);
      setLng(null);
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
          <h2 className="text-lg font-semibold text-ink">Help improve the map</h2>
          <p className="mt-1 text-xs text-ink/55">Tell us what changed — no coordinates needed.</p>
        </div>
        <span className="shrink-0 rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-900">
          +12 pts
        </span>
      </div>

      {/* ── Step 1: What changed? ──────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            className={`rounded-2xl border px-3 py-3 text-left transition ${
              type === option.value ? "border-forest bg-forest/5 ring-2 ring-forest/20" : "border-forest/10 hover:border-forest/25"
            }`}
          >
            <span className="text-lg">{option.icon}</span>
            <span className="mt-1 block text-xs font-semibold text-ink">{option.label}</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-ink/50">{option.hint}</span>
          </button>
        ))}
      </div>

      {/* ── Step 2: Which station? ─────────────────────────────────── */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Which station? *</span>
        <div className="relative mt-1.5">
          <div className="flex items-center gap-2 rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 focus-within:border-forest/40">
            <Search size={16} className="shrink-0 text-ink/40" />
            <input
              value={showStationList ? searchQuery : stationName}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setStationName(e.target.value);
                setShowStationList(true);
              }}
              onFocus={() => setShowStationList(true)}
              required
              maxLength={90}
              placeholder="Type station name or area — e.g. Megenagna, Bole, Shola"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
            />
            {stationName ? (
              <button type="button" onClick={() => { setStationName(""); setArea(""); }} className="text-ink/40 hover:text-ink">
                <X size={16} />
              </button>
            ) : null}
          </div>
          {showStationList && filteredStations.length > 0 ? (
            <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-forest/15 bg-white shadow-lg">
              {filteredStations.slice(0, 12).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectStation(s)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-cream/70"
                >
                  <MapPin size={14} className="shrink-0 text-forest" />
                  <span className="truncate font-medium text-ink">{s.name}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-ink/45">{s.area}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Step 3: Where is it? (optional, simple) ────────────────── */}
      <div className="mt-4 rounded-2xl border border-forest/10 bg-cream/50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
          Pin the location (optional — helps moderators verify faster)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
              lat ? "bg-forest text-cream" : "border border-forest/20 bg-white text-forest hover:bg-forest/5"
            }`}
          >
            <MapPin size={13} />
            {lat ? `${lat.toFixed(4)}, ${lng?.toFixed(4)}` : "Tap on map"}
          </button>
          <button
            type="button"
            onClick={useMyLocation}
            className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-white px-3 py-2 text-xs font-semibold text-forest hover:bg-forest/5"
          >
            <LocateFixed size={13} /> Use my location
          </button>
          {lat ? (
            <button
              type="button"
              onClick={() => { setLat(null); setLng(null); }}
              className="inline-flex items-center gap-1 rounded-full px-2 py-2 text-xs text-ink/50 hover:text-ink"
            >
              <X size={12} /> Clear
            </button>
          ) : null}
        </div>
        {showMap ? (
          <div ref={mapRef} className="mt-3 h-[250px] overflow-hidden rounded-xl border border-forest/15">
            <MapCanvas
              markers={lat && lng ? [{ id: "pin", lat, lng, label: "Your pin", kind: "selected" }] : []}
              center={lat && lng ? [lat, lng] : [9.02, 38.76]}
              zoom={lat ? 16 : 12}
              onMapClick={handleMapClick}
            />
          </div>
        ) : null}
        {lat ? (
          <p className="mt-2 text-[11px] text-ink/50">📍 Pinned: {lat.toFixed(5)}, {lng?.toFixed(5)}</p>
        ) : null}
      </div>

      {/* ── Step 4: What happened? ─────────────────────────────────── */}
      <label className="mt-4 block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">What do you want us to know? *</span>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          required
          rows={4}
          maxLength={900}
          placeholder="Tell us in your own words — which lines leave from here, what the fare is, when did it change, where exactly is the stand? Type in English or Amharic."
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
          <Link href="/login" className="font-semibold text-forest hover:underline">Log in</Link> to earn points and badges.
        </p>
      ) : null}
    </form>
  );
}
