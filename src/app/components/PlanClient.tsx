"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
  CarFront,
  ChevronDown,
  Clock3,
  ExternalLink,
  Footprints,
  Info,
  Loader2,
  MapPin,
  Navigation,
  Repeat2,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Wallet,
} from "lucide-react";
import MapCanvas from "@/app/components/MapCanvas";
import type { MapLine, MapMarker, MarkerKind } from "@/app/components/MapView";
import PlaceInput, { type PlaceValue } from "@/app/components/PlaceInput";
import { CrowdPill, ModeTile, StationModes } from "@/app/components/ui";
import { ModeIcon } from "@/app/components/icons";
import type { Leg, NearbyStation, PlanResult, Priority, TripOption } from "@/lib/planner";
import { MODE_INFO, MODES, modeInfo, type Mode } from "@/lib/transit";

type StationPin = { id: number; name: string; lat: number; lng: number; kind: string; area: string; landmark: string | null };

type PlanResponse = PlanResult & {
  origin: PlaceValue;
  destination: PlaceValue;
  departAt: string;
  priority: Priority;
};

const PRIORITIES: Array<{ value: Priority; label: string }> = [
  { value: "best", label: "Best" },
  { value: "fastest", label: "Fastest" },
  { value: "cheapest", label: "Cheapest" },
  { value: "less_walking", label: "Less walking" },
];

function fmtMin(m: number) {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60 ? `${m % 60} min` : ""}`.trim();
}
function fmtDist(m: number) {
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
}
function fmtFare(f: { min: number; max: number }) {
  if (f.max === 0) return "Free";
  return f.min === f.max ? `${f.min} birr` : `${f.min}–${f.max} birr`;
}
function clock(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Addis_Ababa" });
}
/** Ethiopian clock: the day starts at 6:00 (ሰዓት 12). */
function ethClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: false, timeZone: "Africa/Addis_Ababa" }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  const eth = ((h - 6 + 24) % 12) || 12;
  const period = h >= 6 && h < 18 ? "ቀን" : "ማታ";
  return `${eth}:${m} ${period}`;
}
function gmapsWalk(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`;
}
function legColor(leg: Leg) {
  return leg.kind === "walk" ? "#2f7d5b" : MODE_INFO[leg.mode ?? "minibus"].color;
}

export default function PlanClient({
  stations,
  initialFrom,
  initialTo,
  popular,
}: {
  stations: StationPin[];
  initialFrom: PlaceValue | null;
  initialTo: PlaceValue | null;
  popular: Array<{ label: string; lat: number; lng: number }>;
}) {
  const [from, setFrom] = useState<PlaceValue | null>(initialFrom);
  const [to, setTo] = useState<PlaceValue | null>(initialTo);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [picking, setPicking] = useState<"from" | "to" | null>(null);

  const [departMode, setDepartMode] = useState<"now" | "later">("now");
  const [departAt, setDepartAt] = useState("");
  const [priority, setPriority] = useState<Priority>("best");
  const [modes, setModes] = useState<Mode[]>([...MODES]);
  const [showOptions, setShowOptions] = useState(false);

  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [walkPreview, setWalkPreview] = useState<{ id: string; coords: Array<[number, number]>; station: StationPin; meters: number | null } | null>(null);
  const [recent, setRecent] = useState<Array<{ from: PlaceValue; to: PlaceValue }>>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("guzo:recent") ?? "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  const useMyLocation = useCallback((target: "from" | "to" = "from") => {
    if (!navigator.geolocation) {
      setGeoError("This browser cannot share a location. Type your starting point instead.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let label = "My location";
        try {
          const r = await fetch(`/api/places?lat=${lat}&lng=${lng}`);
          const d = (await r.json()) as { location: { label: string } };
          label = `My location · ${d.location.label.toLowerCase()}`;
        } catch {
          /* keep default */
        }
        const value = { label, lat, lng, source: "gps" as const };
        if (target === "from") setFrom(value);
        else setTo(value);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is off. Type where you are (an area, landmark or station) instead."
            : "We could not read your location. Type where you are instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);

  const onMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (!picking) return;
      let label = "Dropped pin";
      try {
        const r = await fetch(`/api/places?lat=${lat}&lng=${lng}`);
        const d = (await r.json()) as { location: { label: string } };
        label = `Pin · ${d.location.label.toLowerCase()}`;
      } catch {
        /* ignore */
      }
      const value = { label, lat, lng, source: "map" as const };
      if (picking === "from") setFrom(value);
      else setTo(value);
      setPicking(null);
    },
    [picking],
  );

  const runPlan = useCallback(
    async (overrideFrom?: PlaceValue | null, overrideTo?: PlaceValue | null) => {
      const f = overrideFrom ?? from;
      const t = overrideTo ?? to;
      setError(null);
      if (!f && !fromText.trim()) {
        setError("Add a starting point — share your location or type where you are.");
        return;
      }
      if (!t && !toText.trim()) {
        setError("Where do you want to go? Type a destination.");
        return;
      }
      setLoading(true);
      setWalkPreview(null);
      try {
        const body = {
          origin: f ? { lat: f.lat, lng: f.lng, label: f.label } : { query: fromText },
          destination: t ? { lat: t.lat, lng: t.lng, label: t.label } : { query: toText },
          departAt: departMode === "later" && departAt ? new Date(departAt).toISOString() : undefined,
          priority,
          modes: modes.length === MODES.length ? [] : modes,
        };
        const r = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error ?? "Could not plan this trip.");
        const result = data as PlanResponse;
        setPlan(result);
        if (!f) setFrom({ ...result.origin, source: "search" });
        if (!t) setTo({ ...result.destination, source: "search" });
        setSelectedId(result.options[0]?.id ?? null);
        const entry = { from: { ...result.origin }, to: { ...result.destination } };
        const next = [entry, ...recent.filter((x) => !(x.from.label === entry.from.label && x.to.label === entry.to.label))].slice(0, 5);
        setRecent(next);
        localStorage.setItem("guzo:recent", JSON.stringify(next));
        if (window.innerWidth < 1024) setTimeout(() => document.getElementById("trip-map")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      } catch (e) {
        setError((e as Error).message);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    },
    [from, to, fromText, toText, departMode, departAt, priority, modes, recent],
  );

  // Auto-run when arriving with both ends in the URL
  useEffect(() => {
    if (initialFrom && initialTo) void runPlan(initialFrom, initialTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected: TripOption | null = plan?.options.find((o) => o.id === selectedId) ?? plan?.options[0] ?? null;

  async function previewWalk(n: NearbyStation, origin: { lat: number; lng: number }) {
    const st = stations.find((s) => s.id === n.station.id);
    if (!st) return;
    setWalkPreview({ id: `w-${st.id}`, coords: [[origin.lat, origin.lng], [st.lat, st.lng]], station: st, meters: null });
    try {
      const r = await fetch(`/api/shape?profile=foot&points=${origin.lat},${origin.lng};${st.lat},${st.lng}`);
      const d = (await r.json()) as { coords: Array<[number, number]>; distanceM: number | null };
      setWalkPreview({ id: `w-${st.id}-ok`, coords: d.coords, station: st, meters: d.distanceM });
    } catch {
      /* keep straight preview */
    }
    if (window.innerWidth < 1024) document.getElementById("trip-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const { markers, lines, fitKey } = useMemo(() => {
    const mk: MapMarker[] = [];
    const ln: MapLine[] = [];
    if (walkPreview && from) {
      ln.push({ id: walkPreview.id, points: walkPreview.coords, color: "#2f7d5b", dashed: true, weight: 5 });
      mk.push({ id: "o", lat: from.lat, lng: from.lng, label: from.label, kind: "origin" });
      mk.push({ id: walkPreview.station.id, lat: walkPreview.station.lat, lng: walkPreview.station.lng, label: walkPreview.station.name, sublabel: walkPreview.station.landmark ?? undefined, kind: "selected", href: `/stations/${walkPreview.station.id}` });
      return { markers: mk, lines: ln, fitKey: walkPreview.id };
    }
    if (selected && plan) {
      selected.legs.forEach((leg, i) => {
        ln.push({ id: `${selected.id}-${i}`, points: leg.path, color: legColor(leg), dashed: leg.kind === "walk", weight: leg.kind === "walk" ? 4 : 6 });
        if (leg.kind === "ride") {
          const color = MODE_INFO[leg.mode ?? "minibus"].color;
          mk.push({
            id: `b-${i}`,
            lat: leg.from.lat,
            lng: leg.from.lng,
            label: `Board: ${leg.stationName}`,
            sublabel: leg.landmark ?? `${modeInfo(leg.mode ?? "minibus").label} toward ${leg.sign}`,
            kind: "board" as MarkerKind,
            color,
            href: leg.stationId ? `/stations/${leg.stationId}` : undefined,
          });
          (leg.stopsPassed ?? []).slice(1, -1).forEach((s, k) => mk.push({ id: `s-${i}-${k}`, lat: s.lat, lng: s.lng, label: `${s.name} · ${s.am}`, kind: "stop", color }));
          mk.push({ id: `a-${i}`, lat: leg.to.lat, lng: leg.to.lng, label: `Get off: ${leg.alightName}`, sublabel: leg.alightAm ?? undefined, kind: "alight" });
        }
      });
      mk.push({ id: "o", lat: plan.origin.lat, lng: plan.origin.lng, label: plan.origin.label, sublabel: "Start", kind: "origin" });
      mk.push({ id: "d", lat: plan.destination.lat, lng: plan.destination.lng, label: plan.destination.label, sublabel: "Destination", kind: "destination" });
      return { markers: mk, lines: ln, fitKey: `${plan.departAt}-${selected.id}` };
    }
    for (const s of stations) mk.push({ id: s.id, lat: s.lat, lng: s.lng, label: s.name, sublabel: s.landmark ?? s.area, kind: s.kind as MarkerKind, href: `/stations/${s.id}` });
    if (from) mk.push({ id: "o", lat: from.lat, lng: from.lng, label: from.label, kind: "origin" });
    if (to) mk.push({ id: "d", lat: to.lat, lng: to.lng, label: to.label, kind: "destination" });
    return { markers: mk, lines: ln, fitKey: from || to ? `pts-${from?.lat}-${to?.lat}` : undefined };
  }, [selected, plan, stations, from, to, walkPreview]);

  async function share() {
    if (!plan) return;
    const url = `${window.location.origin}/plan?from=${encodeURIComponent(plan.origin.label)}&fromLat=${plan.origin.lat}&fromLng=${plan.origin.lng}&to=${encodeURIComponent(plan.destination.label)}&toLat=${plan.destination.lat}&toLng=${plan.destination.lng}`;
    const text = selected ? `${plan.origin.label} → ${plan.destination.label}: ${selected.summary} (${fmtMin(selected.totalMinutes)}, ${fmtFare(selected.fare)})` : "";
    try {
      if (navigator.share) await navigator.share({ title: "Guzo trip", text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  }

  const departDate = plan ? new Date(plan.departAt) : new Date();

  return (
    <div className="mx-auto max-w-[1440px] lg:grid lg:h-[calc(100vh-4rem)] lg:grid-cols-[minmax(380px,460px)_1fr]">
      {/* ── Left panel ── */}
      <section className="scroll-thin flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-6 lg:overflow-y-auto lg:border-r lg:border-forest/10 lg:px-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-moss">Trip planner · የጉዞ እቅድ</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">Where are you going?</h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runPlan();
          }}
          className="rounded-3xl border border-forest/10 bg-cream/60 p-3 shadow-[0_18px_50px_rgba(13,32,24,0.06)] sm:p-4"
        >
          <div className="relative space-y-2">
            <PlaceInput
              id="from"
              label="From"
              dotClass="bg-emerald-600 ring-emerald-100"
              value={from}
              onChange={(v, raw) => {
                setFrom(v);
                if (raw !== undefined) setFromText(raw);
              }}
              placeholder="Type where you are, or use location"
              onUseLocation={() => useMyLocation("from")}
              locating={locating}
              onPickOnMap={() => setPicking("from")}
              picking={picking === "from"}
            />
            <PlaceInput
              id="to"
              label="To"
              dotClass="bg-brick ring-red-100"
              value={to}
              onChange={(v, raw) => {
                setTo(v);
                if (raw !== undefined) setToText(raw);
              }}
              placeholder="Destination — area, landmark, station"
              onPickOnMap={() => setPicking("to")}
              picking={picking === "to"}
            />
            <button
              type="button"
              aria-label="Swap start and destination"
              onClick={() => {
                setFrom(to);
                setTo(from);
                setFromText(toText);
                setToText(fromText);
              }}
              className="absolute right-12 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-forest/15 bg-white text-forest shadow-sm hover:bg-cream"
            >
              <ArrowDownUp size={16} />
            </button>
          </div>

          {!from ? (
            <button
              type="button"
              onClick={() => useMyLocation("from")}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
            >
              {locating ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
              {locating ? "Finding you…" : "Allow location access"}
            </button>
          ) : null}
          {geoError ? <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">{geoError}</p> : null}
          {picking ? (
            <p className="mt-2 flex items-center gap-2 rounded-xl bg-forest px-3 py-2 text-xs font-medium text-cream">
              <MapPin size={14} /> Tap the map to set your {picking === "from" ? "starting point" : "destination"}.
              <button type="button" onClick={() => setPicking(null)} className="ml-auto underline">
                Cancel
              </button>
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <div className="no-scrollbar flex flex-1 gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-forest/10">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${priority === p.value ? "bg-forest text-cream" : "text-ink/60 hover:text-ink"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowOptions((v) => !v)}
              aria-expanded={showOptions}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-forest/10 ${showOptions ? "bg-forest text-cream" : "bg-white text-forest"}`}
              aria-label="More options"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showOptions ? (
            <div className="animate-rise mt-3 space-y-3 rounded-2xl bg-white p-3 ring-1 ring-forest/10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Departure</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {(["now", "later"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDepartMode(m)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${departMode === m ? "bg-forest text-cream ring-forest" : "ring-forest/15 text-ink/70"}`}
                    >
                      {m === "now" ? "Leave now" : "Leave at…"}
                    </button>
                  ))}
                  {departMode === "later" ? (
                    <input
                      type="datetime-local"
                      value={departAt}
                      onChange={(e) => setDepartAt(e.target.value)}
                      className="rounded-xl border border-forest/15 bg-cream/60 px-2.5 py-1.5 text-xs text-ink"
                    />
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">Transport I&apos;m happy to use</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {MODES.map((m) => {
                    const on = modes.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModes((cur) => (on ? (cur.length > 1 ? cur.filter((x) => x !== m) : cur) : [...cur, m]))}
                        className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-xs font-semibold ring-1 transition ${on ? "bg-white text-ink ring-forest/25" : "bg-stone-50 text-ink/40 ring-stone-200"}`}
                        aria-pressed={on}
                      >
                        <ModeTile mode={m} size={22} dim={!on} />
                        {MODE_INFO[m].short}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {error ? <p className="mt-3 flex items-start gap-2 rounded-xl bg-brick/10 px-3 py-2 text-xs font-medium text-brick"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-4 py-3.5 text-sm font-bold text-cream shadow-[0_12px_28px_rgba(18,69,50,0.28)] transition hover:bg-forest/90 disabled:opacity-60"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
            {loading ? "Finding every way and snapping to roads…" : "Find routes"}
          </button>
        </form>

        {!plan && !loading ? (
          <div className="space-y-4">
            {recent.length ? (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Recent trips</p>
                <div className="space-y-1.5">
                  {recent.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFrom(r.from);
                        setTo(r.to);
                        void runPlan(r.from, r.to);
                      }}
                      className="flex w-full items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-left text-sm ring-1 ring-forest/10 hover:ring-forest/25"
                    >
                      <Clock3 size={15} className="shrink-0 text-ink/40" />
                      <span className="truncate font-medium text-ink">{r.from.label}</span>
                      <ArrowRight size={14} className="shrink-0 text-ink/35" />
                      <span className="truncate font-medium text-ink">{r.to.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Popular destinations</p>
              <div className="flex flex-wrap gap-1.5">
                {popular.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setTo({ label: p.label, lat: p.lat, lng: p.lng, source: "search" })}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/75 ring-1 ring-forest/15 hover:text-ink hover:ring-forest/35"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-forest/10 bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Info size={16} className="text-moss" /> How Guzo plans your trip</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink/65">
                <li>• Checks every tera, light-rail platform and bus stop you can walk to.</li>
                <li>• Lets you drop at any stop a line passes — not only where it ends.</li>
                <li>• Adds transfers when no single line goes there, up to two changes.</li>
                <li>• Uses time-of-day traffic, queue reports and route popularity.</li>
                <li>• Draws every leg on the real road network.</li>
              </ul>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl bg-white ring-1 ring-forest/10" />
            ))}
          </div>
        ) : null}

        {plan && !loading ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-forest px-4 py-3 text-cream">
              <Timer size={18} className="mt-0.5 shrink-0 text-gold" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold">
                  {plan.context.periodLabel} · leaving {clock(departDate)} <span className="text-cream/60">({ethClock(departDate)})</span>
                </p>
                <p className="text-cream/75">{plan.context.periodNote}</p>
                {plan.context.closedModes.length ? (
                  <p className="mt-1 text-gold">Not running now: {plan.context.closedModes.map((m) => MODE_INFO[m].short).join(", ")}</p>
                ) : null}
              </div>
            </div>

            {plan.options.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-forest/20 bg-white p-5 text-center">
                <p className="text-sm font-semibold text-ink">No public transport route found</p>
                <p className="mt-1 text-xs text-ink/60">Try a nearby landmark, allow more transport modes, or compare a ride-hailing taxi below.</p>
              </div>
            ) : (
              <p className="px-1 text-xs font-medium text-ink/55">
                {plan.options.length} way{plan.options.length > 1 ? "s" : ""} · {plan.context.directKm} km straight line
              </p>
            )}

            {plan.options.map((option, idx) => (
              <OptionCard
                key={option.id}
                option={option}
                index={idx}
                active={selected?.id === option.id}
                departAt={departDate}
                onSelect={() => {
                  setSelectedId(option.id);
                  setWalkPreview(null);
                }}
                origin={plan.origin}
                onShare={share}
                copied={copied}
              />
            ))}

            {plan.rideHail ? (
              <div className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><CarFront size={20} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">Ride-hailing taxi</p>
                  <p className="text-[11px] text-ink/55">RIDE, Feres or ZayRide · door to door · estimate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">{fmtMin(plan.rideHail.totalMinutes)}</p>
                  <p className="text-[11px] font-semibold text-indigo-700">{fmtFare(plan.rideHail.fare)}</p>
                </div>
              </div>
            ) : null}

            <NearbyList title="Closest stations to your start" items={plan.nearOrigin} onWalk={(n) => previewWalk(n, plan.origin)} origin={plan.origin} />
            <NearbyList title="Stations near your destination" items={plan.nearDestination} />
          </div>
        ) : null}
      </section>

      {/* ── Map ── */}
      <section id="trip-map" className="relative h-[52vh] min-h-[340px] scroll-mt-16 border-y border-forest/10 lg:h-auto lg:border-0">
        <MapCanvas markers={markers} lines={lines} fitKey={fitKey} center={[9.0108, 38.7613]} zoom={12} onMapClick={picking ? onMapClick : undefined} legend />
        {selected && plan && !walkPreview ? (
          <div className="pointer-events-none absolute left-3 top-3 z-[500] flex max-w-[calc(100%-5rem)] items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur">
            <ModeChain legs={selected.legs} size={22} />
            <span className="text-sm font-bold text-ink">{fmtMin(selected.totalMinutes)}</span>
            <span className="hidden text-xs font-semibold text-forest sm:inline">{fmtFare(selected.fare)}</span>
          </div>
        ) : null}
        {walkPreview ? (
          <div className="absolute left-3 top-3 z-[500] max-w-[calc(100%-5rem)] rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-black/5">
            <p className="text-xs font-bold text-ink">Walking to {walkPreview.station.name}</p>
            <p className="text-[11px] text-ink/60">{walkPreview.meters ? `${fmtDist(walkPreview.meters)} · ~${Math.max(1, Math.round(walkPreview.meters / 75))} min on foot` : "Loading street route…"}</p>
            <button type="button" onClick={() => setWalkPreview(null)} className="mt-1 text-[11px] font-semibold text-forest underline">
              Back to trip
            </button>
          </div>
        ) : null}
        {picking ? (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] mx-auto w-fit rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream shadow-lg">
            Tap to set {picking === "from" ? "start" : "destination"}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ModeChain({ legs, size = 26 }: { legs: Leg[]; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {legs.map((leg, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 ? <ChevronDown size={11} className="-rotate-90 text-ink/30" /> : null}
          {leg.kind === "walk" ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-moss">
              <Footprints size={Math.round(size * 0.6)} />
              {leg.minutes}
            </span>
          ) : (
            <ModeTile mode={leg.mode ?? "minibus"} size={size} />
          )}
        </span>
      ))}
    </div>
  );
}

function OptionCard({
  option,
  index,
  active,
  onSelect,
  departAt,
  origin,
  onShare,
  copied,
}: {
  option: TripOption;
  index: number;
  active: boolean;
  onSelect: () => void;
  departAt: Date;
  origin: { lat: number; lng: number; label: string };
  onShare: () => void;
  copied: boolean;
}) {
  const arrive = new Date(departAt.getTime() + option.totalMinutes * 60000);
  const waitTotal = option.legs.reduce((s, l) => s + (l.waitMinutes ?? 0), 0);
  return (
    <article className={`animate-rise overflow-hidden rounded-3xl border bg-white transition ${active ? "border-forest/45 shadow-[0_18px_44px_rgba(13,32,24,0.12)]" : "border-forest/10 hover:border-forest/25"}`} style={{ animationDelay: `${index * 40}ms` }}>
      <button type="button" onClick={onSelect} className="w-full px-4 pb-3 pt-3.5 text-left" aria-expanded={active}>
        <div className="flex flex-wrap gap-1">
          {option.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                tag === "Recommended" ? "bg-forest text-cream" : tag === "Fastest" ? "bg-emerald-100 text-emerald-800" : tag === "Cheapest" ? "bg-gold/25 text-yellow-900" : tag === "Most used route" ? "bg-amber-100 text-amber-900" : "bg-forest/5 text-forest"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <ModeChain legs={option.legs} />
          <div className="text-right">
            <p className="text-xl font-bold leading-none text-ink">{fmtMin(option.totalMinutes)}</p>
            <p className="mt-1 text-[11px] text-ink/50">arrive {clock(arrive)}</p>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug text-ink/80">{option.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-ink/55">
          <span className="inline-flex items-center gap-1 font-semibold text-forest"><Wallet size={12} />{fmtFare(option.fare)}</span>
          <span className="inline-flex items-center gap-1"><Footprints size={12} />{fmtDist(option.walkMeters)}</span>
          <span className="inline-flex items-center gap-1"><Repeat2 size={12} />{option.transfers === 0 ? "Direct" : `${option.transfers} transfer${option.transfers > 1 ? "s" : ""}`}</span>
          {waitTotal ? <span className="inline-flex items-center gap-1"><Clock3 size={12} />~{waitTotal} min waiting</span> : null}
        </div>
      </button>

      {active ? (
        <div className="border-t border-forest/5 bg-cream/40 px-4 pb-4 pt-3">
          <ol className="relative">
            <TimelineEnd label={origin.label} sub={`Leave ${clock(departAt)}`} color="#2f7d5b" />
            {option.legs.map((leg, i) => (
              <LegStep key={i} leg={leg} />
            ))}
            <TimelineEnd label={option.legs[option.legs.length - 1]?.toName ?? "Destination"} sub={`Arrive about ${clock(arrive)} · ${ethClock(arrive)}`} color="#b4493c" last />
          </ol>
          {option.warnings.length ? (
            <div className="mt-3 space-y-1.5">
              {option.warnings.map((w) => (
                <p key={w} className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-900">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  {w}
                </p>
              ))}
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-xs font-semibold text-cream">
              <Share2 size={13} /> {copied ? "Copied!" : "Share trip"}
            </button>
            {option.legs
              .filter((l) => l.kind === "ride" && l.stationId)
              .slice(0, 2)
              .map((l) => (
                <Link key={l.stationId} href={`/stations/${l.stationId}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-forest ring-1 ring-forest/15">
                  Queue at {l.stationName?.split(" — ")[0]} <ArrowRight size={12} />
                </Link>
              ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function TimelineEnd({ label, sub, color, last }: { label: string; sub: string; color: string; last?: boolean }) {
  return (
    <li className={`relative flex gap-3 ${last ? "" : "pb-3"}`}>
      <span className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] bg-white" style={{ borderColor: color }} />
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="text-[11px] text-ink/50">{sub}</p>
      </div>
    </li>
  );
}

function LegStep({ leg }: { leg: Leg }) {
  const [openStops, setOpenStops] = useState(false);
  const color = legColor(leg);
  if (leg.kind === "walk") {
    return (
      <li className="relative flex gap-3 pb-3">
        <span className="absolute left-[6px] top-0 h-full border-l-2 border-dotted" style={{ borderColor: color }} />
        <span className="relative z-10 grid h-3.5 w-3.5 shrink-0" />
        <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-forest/10">
          <p className="flex items-center gap-1.5 text-xs font-bold text-moss">
            <Footprints size={14} /> Walk {fmtDist(leg.meters)} · {leg.minutes} min
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink/75">{leg.instruction}</p>
          <a href={gmapsWalk(leg.from, leg.to)} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:underline">
            Turn-by-turn walking directions <ExternalLink size={11} />
          </a>
        </div>
      </li>
    );
  }
  const info = modeInfo(leg.mode ?? "minibus");
  const via = (leg.stopsPassed ?? []).slice(1, -1);
  return (
    <li className="relative flex gap-3 pb-3">
      <span className="absolute left-[5px] top-0 h-full w-[4px] rounded-full" style={{ background: color }} />
      <span className="relative z-10 grid h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white ring-1 ring-forest/10">
        <div className="flex items-center gap-2 px-3 py-2 text-white" style={{ background: color }}>
          <ModeIcon mode={leg.mode ?? "minibus"} size={16} strokeWidth={2.4} />
          <span className="text-xs font-bold">
            {info.label}
            {leg.lineName ? ` · ${leg.lineName}` : ""}
          </span>
          <span className="ml-auto text-[11px] font-semibold opacity-90">{info.am}</span>
        </div>
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-cream">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">To</span>
            <span className="truncate text-sm font-bold">{leg.sign}</span>
            {leg.signAm ? <span className="truncate text-sm text-cream/70">{leg.signAm}</span> : null}
          </div>
          <p className="mt-2 text-[12px] font-semibold text-ink">
            Board at {leg.stationName}
            {leg.midRoute ? <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[9px] font-bold uppercase text-amber-900">roadside</span> : null}
          </p>
          {leg.landmark ? <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{leg.landmark}</p> : null}
          <p className="mt-2 text-[12px] leading-relaxed text-ink/75">{leg.instruction}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="rounded-full bg-cream px-2 py-0.5 font-semibold text-ink/70">~{leg.waitMinutes} min wait</span>
            <span className="rounded-full bg-cream px-2 py-0.5 font-semibold text-ink/70">{leg.minutes} min ride · {leg.km} km</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800">{leg.fare ? fmtFare(leg.fare) : ""}</span>
            {leg.crowd ? <CrowdPill crowd={leg.crowd} small /> : null}
            {leg.live ? <span className="rounded-full bg-sky-50 px-2 py-0.5 font-semibold text-sky-800">live report</span> : null}
          </div>
          {via.length ? (
            <button type="button" onClick={() => setOpenStops((v) => !v)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-forest">
              <ChevronDown size={13} className={openStops ? "rotate-180" : ""} /> {leg.stopCount} stop{leg.stopCount === 1 ? "" : "s"} — passes {via.length} place{via.length > 1 ? "s" : ""}
            </button>
          ) : null}
          {openStops ? (
            <ul className="mt-1.5 space-y-1 border-l-2 pl-3" style={{ borderColor: color }}>
              {via.map((s) => (
                <li key={s.name} className="text-[11px] text-ink/65">
                  {s.name} <span className="text-ink/40">· {s.am}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-brick/5 px-2.5 py-1.5 text-[12px] font-bold text-brick">
            <MapPin size={13} /> Get off at {leg.alightName} <span className="font-medium text-brick/70">· {leg.alightAm}</span>
          </p>
        </div>
      </div>
    </li>
  );
}

function NearbyList({
  title,
  items,
  onWalk,
  origin,
}: {
  title: string;
  items: NearbyStation[];
  onWalk?: (n: NearbyStation) => void;
  origin?: { lat: number; lng: number };
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-2 divide-y divide-forest/5">
        {items.map((n) => (
          <li key={n.station.id} className="py-2.5">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <Link href={`/stations/${n.station.id}`} className="block truncate text-[13px] font-semibold text-ink hover:underline">
                  {n.station.name}
                </Link>
                <p className="line-clamp-1 text-[11px] text-ink/50">{n.station.landmark ?? n.station.area}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <StationModes depart={n.modes} size={20} />
                  {n.crowd ? <CrowdPill crowd={n.crowd} small /> : null}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-forest">{fmtDist(n.meters)}</p>
                <p className="text-[10px] text-ink/45">~{n.minutes} min walk</p>
                {onWalk && origin ? (
                  <div className="mt-1 flex flex-col items-end gap-1">
                    <button type="button" onClick={() => onWalk(n)} className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10px] font-bold text-cream">
                      <Footprints size={11} /> Show walk
                    </button>
                    <a href={gmapsWalk(origin, n.station)} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-forest underline">
                      Google Maps
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
