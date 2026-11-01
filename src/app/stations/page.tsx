import Link from "next/link";
import { Navigation, Search, X } from "lucide-react";
import MapCanvas from "@/app/components/MapCanvas";
import type { MarkerKind } from "@/app/components/MapView";
import { CrowdPill, ModeTile, StationKindBadge, StationModes } from "@/app/components/ui";
import { getStationSummaries } from "@/lib/data";
import { normalize } from "@/lib/geocode";
import { MODE_INFO, MODES, STATION_KIND_INFO, type Mode } from "@/lib/transit";

export const dynamic = "force-dynamic";

export default async function StationsPage({ searchParams }: { searchParams: Promise<{ q?: string; mode?: string; kind?: string; area?: string }> }) {
  const params = await searchParams;
  const q = normalize(params.q ?? "");
  const mode = (MODES as string[]).includes(params.mode ?? "") ? (params.mode as Mode) : null;
  const kind = params.kind && STATION_KIND_INFO[params.kind] ? params.kind : null;
  const area = params.area ?? "";

  const all = await getStationSummaries();
  const areas = Array.from(new Set(all.map((s) => s.area))).sort();
  const list = all.filter((s) => {
    if (q && ![s.name, s.nameAm ?? "", s.area, s.landmark ?? "", ...s.destinations].some((t) => normalize(t).includes(q) || t.includes(params.q ?? "\u0000"))) return false;
    if (mode && !s.departModes.includes(mode) && !s.passModes.includes(mode)) return false;
    if (kind && s.kind !== kind) return false;
    if (area && s.area !== area) return false;
    return true;
  });

  const href = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams();
    const merged = { q: params.q ?? null, mode, kind, area: area || null, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/stations?${s}` : "/stations";
  };

  const counts = Object.fromEntries(MODES.map((m) => [m, all.filter((s) => s.departModes.includes(m) || s.passModes.includes(m)).length]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-moss">Station directory · ተራዎች</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Every stand, platform and bus station</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/65">
            {all.length} stations across Addis Ababa. Solid icons show what departs from a station; dashed icons show lines that pass by and can be flagged there.
          </p>
        </div>
        <Link href="/plan" className="inline-flex items-center gap-2 self-start rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest/90">
          <Navigation size={15} /> Plan a trip
        </Link>
      </div>

      <form className="mt-5 flex flex-col gap-2 rounded-2xl border border-forest/10 bg-white p-2.5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-cream/70 px-3 py-2.5">
          <Search size={16} className="text-ink/40" />
          <input type="search" name="q" defaultValue={params.q ?? ""} placeholder="Search station, area, landmark, destination or Amharic name…" className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35" />
          {mode ? <input type="hidden" name="mode" value={mode} /> : null}
          {kind ? <input type="hidden" name="kind" value={kind} /> : null}
        </div>
        <select name="area" defaultValue={area} className="rounded-xl border border-forest/15 bg-cream/70 px-3 py-2.5 text-sm text-ink outline-none">
          <option value="">All sub-cities</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-cream">
          Search
        </button>
      </form>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        <Link href={href({ mode: null })} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ring-1 ${!mode ? "bg-forest text-cream ring-forest" : "bg-white text-ink/70 ring-forest/15"}`}>
          All modes
        </Link>
        {MODES.map((m) => (
          <Link key={m} href={href({ mode: mode === m ? null : m })} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-semibold ring-1 ${mode === m ? "bg-ink text-cream ring-ink" : "bg-white text-ink/75 ring-forest/15"}`}>
            <ModeTile mode={m} size={24} />
            {MODE_INFO[m].short}
            <span className="opacity-50">{counts[m]}</span>
          </Link>
        ))}
        {Object.entries(STATION_KIND_INFO).filter(([k]) => k !== "bus_terminal").map(([k, info]) => (
          <Link key={k} href={href({ kind: kind === k ? null : k })} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ring-1 ${kind === k ? "bg-ink text-cream ring-ink" : "bg-white text-ink/70 ring-forest/15"}`}>
            {info.label}
          </Link>
        ))}
        {params.q || mode || kind || area ? (
          <Link href="/stations" className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-brick">
            <X size={13} /> Clear
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">
            {list.length} result{list.length === 1 ? "" : "s"}
          </p>
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-forest/20 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-ink">No station matches</p>
              <p className="mt-1 text-xs text-ink/60">Try another filter — or add the missing stand for everyone.</p>
              <Link href="/contribute" className="mt-3 inline-block rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream">
                Add a station
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((s) => (
                <article key={s.id} className="flex flex-col rounded-3xl border border-forest/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_14px_34px_rgba(13,32,24,0.08)]">
                  <div className="flex items-start justify-between gap-2">
                    <StationKindBadge kind={s.kind} />
                    {s.verified ? <span className="text-[10px] font-bold text-emerald-700">✓ verified</span> : null}
                  </div>
                  <h2 className="mt-2 text-[15px] font-bold leading-snug text-ink">{s.name}</h2>
                  <p className="text-xs text-ink/50">
                    {s.nameAm} · {s.area}
                  </p>
                  {s.landmark ? <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/65">{s.landmark}</p> : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StationModes depart={s.departModes} pass={s.passModes} size={24} />
                    {s.crowd ? <CrowdPill crowd={s.crowd} small /> : null}
                  </div>
                  {s.destinations.length ? (
                    <p className="mt-2 line-clamp-1 text-[11px] text-ink/55">
                      <span className="font-semibold text-ink/70">To:</span> {s.destinations.join(" · ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-[11px] text-ink/45">Stop on passing lines</p>
                  )}
                  <div className="mt-auto flex items-center gap-2 pt-3 text-xs font-semibold">
                    <Link href={`/stations/${s.id}`} className="rounded-full bg-forest px-3 py-1.5 text-cream hover:bg-forest/90">
                      Open
                    </Link>
                    <Link href={`/plan?station=${s.id}`} className="rounded-full px-3 py-1.5 text-forest ring-1 ring-forest/15 hover:bg-forest/5">
                      Plan from here
                    </Link>
                    {s.departures ? <span className="ml-auto text-[11px] font-medium text-ink/45">{s.departures} lines · from {s.minFare} birr</span> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="order-1 lg:sticky lg:top-20 lg:order-2 lg:self-start">
          <div className="h-[320px] overflow-hidden rounded-3xl border border-forest/10 shadow-[0_18px_50px_rgba(13,32,24,0.08)] sm:h-[420px] lg:h-[calc(100vh-7rem)]">
            <MapCanvas
              markers={list.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.name, sublabel: s.landmark ?? s.area, kind: s.kind as MarkerKind, href: `/stations/${s.id}` }))}
              center={[9.0, 38.765]}
              zoom={12}
              fitKey={params.q || mode || kind || area ? `f-${list.length}-${mode}-${kind}-${area}` : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
