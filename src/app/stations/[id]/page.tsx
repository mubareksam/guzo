import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, Clock3, ExternalLink, MapPin, Navigation, PencilLine } from "lucide-react";
import MapCanvas from "@/app/components/MapCanvas";
import type { MapLine, MapMarker, MarkerKind } from "@/app/components/MapView";
import ReportForm from "@/app/components/ReportForm";
import TimeAgo from "@/app/components/TimeAgo";
import { CrowdPill, ModeChip, ModeTile, TransitSign } from "@/app/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getStationDetail, getWaitInfo } from "@/lib/data";
import { crowdOf } from "@/lib/format";
import { getShapes, shapeKey } from "@/lib/osrm";
import { MODE_INFO, MODES, type Mode } from "@/lib/transit";

export const dynamic = "force-dynamic";

export default async function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stationId = Number(id);
  if (!Number.isInteger(stationId)) notFound();
  const [detail, waits, user] = await Promise.all([getStationDetail(stationId), getWaitInfo(), getCurrentUser()]);
  if (!detail) notFound();
  const { station, departures, passing, reports, nearby } = detail;
  const live = waits.find((w) => w.stationId === station.id);

  const departModes = MODES.filter((m) => departures.some((d) => d.line.mode === m));
  const passModes = MODES.filter((m) => !departModes.includes(m) && passing.some((p) => p.line.mode === m));

  // Road-snapped geometry of every departing line (cached after first load)
  const shapeReqs = departures.slice(0, 14).map((d) => ({ profile: "driving" as const, points: d.line.stops.map((s) => ({ lat: s.lat, lng: s.lng })) }));
  const shapes = await getShapes(shapeReqs, { budgetMs: 4500, concurrency: 6 });
  const lines: MapLine[] = departures.slice(0, 14).map((d) => {
    const pts = d.line.stops.map((s) => ({ lat: s.lat, lng: s.lng }));
    const shape = shapes.get(shapeKey("driving", pts));
    return { id: d.line.id, points: shape?.coords ?? pts.map((p) => [p.lat, p.lng] as [number, number]), color: MODE_INFO[d.line.mode].color, weight: 4, opacity: 0.85 };
  });
  const markers: MapMarker[] = [
    { id: station.id, lat: station.lat, lng: station.lng, label: station.name, sublabel: station.landmark ?? undefined, kind: "selected" },
    ...departures.slice(0, 14).map((d) => {
      const last = d.line.stops[d.line.stops.length - 1];
      return { id: `t-${d.line.id}`, lat: last.lat, lng: last.lng, label: `${d.line.toLabel} · ${d.line.toLabelAm ?? ""}`, sublabel: `${MODE_INFO[d.line.mode].label} terminus`, kind: "alight" as MarkerKind };
    }),
    ...nearby.map((n) => ({ id: n.id, lat: n.lat, lng: n.lng, label: n.name, sublabel: n.landmark ?? n.area, kind: n.kind as MarkerKind, href: `/stations/${n.id}` })),
  ];

  const grouped = MODES.map((m) => ({ mode: m, items: departures.filter((d) => d.line.mode === m) })).filter((g) => g.items.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="flex items-center gap-2 text-xs text-ink/50">
        <Link href="/stations" className="hover:text-ink">Stations</Link>
        <span>/</span>
        <span className="truncate font-medium text-ink/70">{station.name}</span>
      </nav>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <TransitSign name={station.name} am={station.nameAm} kind={station.kind} modes={departModes} passModes={passModes} />

          {/* ── Station Visual / Street View ────────────────────── */}
          <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white">
            <div className="relative h-[200px] bg-gradient-to-br from-forest via-moss to-forest sm:h-[240px]">
              {/* Illustration placeholder — pattern with station info */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #e3ae3c 1px, transparent 1px), radial-gradient(circle at 70% 60%, #6fbb8e 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cream/15 backdrop-blur-sm">
                  <MapPin size={28} className="text-gold" />
                </div>
                <p className="mt-3 text-lg font-bold">{station.name}</p>
                <p className="text-sm text-cream/70">{station.nameAm}</p>
                <p className="mt-1 text-xs text-cream/50">{station.area} · {station.kind.replace("_", " ")}</p>
              </div>
              {/* Google Street View link */}
              <a
                href={`https://www.google.com/maps/@${station.lat},${station.lng},3a,75y,90t/data=!3m6!1e1!3m4!1s!2e0!7i13312!8i6656`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-cream/20 px-3 py-1.5 text-[11px] font-semibold text-cream backdrop-blur-sm transition hover:bg-cream/30"
              >
                <Camera size={13} /> Street View
                <ExternalLink size={10} />
              </a>
              {/* Google Maps direction link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-cream/20 px-3 py-1.5 text-[11px] font-semibold text-cream backdrop-blur-sm transition hover:bg-cream/30"
              >
                <MapPin size={13} /> Google Maps
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gold/20 text-forest"><MapPin size={19} /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">How to find it</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/80">{station.landmark ?? station.description}</p>
                <p className="mt-1 text-xs text-ink/50">{station.area} · {station.city} · {station.lat.toFixed(5)}, {station.lng.toFixed(5)}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/plan?station=${station.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-cream"><Navigation size={15} /> Plan from here</Link>
              <Link href={`/plan?to=${encodeURIComponent(station.name)}&toLat=${station.lat}&toLng=${station.lng}`} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-forest ring-1 ring-forest/20">Get directions here</Link>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=walking`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ink/70 ring-1 ring-forest/15">Walk with Google Maps</a>
              <Link href={`/contribute?station=${encodeURIComponent(station.name)}`} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ink/70 ring-1 ring-forest/15"><PencilLine size={14} /> Suggest a fix</Link>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Departing lines", departures.length],
                ["Passing lines", passing.length],
                ["Cheapest", departures.length ? `${Math.min(...departures.map((d) => d.row.fareMin))} birr` : "—"],
                ["Live queue", live && live.reportCount ? `~${live.liveWait} min` : "—"],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded-2xl bg-cream/70 p-3">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/45">{k}</dt>
                  <dd className="text-lg font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-3xl border border-forest/10">
            <div className="h-[320px] sm:h-[400px]">
              <MapCanvas markers={markers} lines={lines} fitKey={`st-${station.id}`} legend />
            </div>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-base font-bold text-ink">Departures · ከዚህ የሚነሱ</h2>
            <p className="text-xs text-ink/55">Each line lists the places it passes, so you can get off before the end.</p>
            {grouped.length === 0 ? <p className="mt-3 rounded-2xl bg-cream/70 p-4 text-xs text-ink/60">No lines start here — see passing lines below.</p> : null}
            {grouped.map((g) => (
              <div key={g.mode} className="mt-4">
                <div className="flex items-center gap-2">
                  <ModeTile mode={g.mode as Mode} size={26} />
                  <p className="text-sm font-bold text-ink">{MODE_INFO[g.mode as Mode].label}</p>
                  <span className="text-xs text-ink/45">{MODE_INFO[g.mode as Mode].am}</span>
                </div>
                <ul className="mt-2 space-y-2">
                  {g.items.map(({ line, row }) => (
                    <li key={line.id} className="rounded-2xl border border-forest/10 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-ink px-2.5 py-1 text-sm font-bold text-cream">→ {line.toLabel}</span>
                          <span className="text-sm text-ink/55">{line.toLabelAm}</span>
                          {line.name ? <span className="rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold text-ink/60">{line.name}</span> : null}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-forest">{row.fareMin === row.fareMax ? `${row.fareMin}` : `${row.fareMin}–${row.fareMax}`} birr</span>
                          <span className="inline-flex items-center gap-1 text-ink/55"><Clock3 size={12} />~{row.durationMin} min</span>
                          <span className="text-ink/45">{row.distanceKm.toFixed(1)} km</span>
                          <span title="How busy this route usually is" className="tracking-tighter text-gold">{"●".repeat(line.popularity)}<span className="text-ink/15">{"●".repeat(5 - line.popularity)}</span></span>
                        </div>
                      </div>
                      <div className="no-scrollbar mt-2.5 flex items-center gap-1 overflow-x-auto pb-1">
                        {line.stops.map((s, i) => (
                          <span key={`${line.id}-${i}`} className="flex shrink-0 items-center gap-1">
                            {i > 0 ? <span className="h-0.5 w-4 rounded" style={{ background: MODE_INFO[line.mode].color }} /> : null}
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${i === 0 ? "bg-forest text-cream" : i === line.stops.length - 1 ? "bg-ink text-cream" : "bg-cream text-ink/70"}`}>{s.name}</span>
                          </span>
                        ))}
                      </div>
                      <Link href={`/plan?station=${station.id}&to=${encodeURIComponent(line.toLabel)}`} className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:underline">
                        Plan this trip <ArrowRight size={11} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {passing.length ? (
            <div className="rounded-3xl border border-forest/10 bg-white p-5">
              <h2 className="text-base font-bold text-ink">Lines passing by · በዚህ የሚያልፉ</h2>
              <p className="text-xs text-ink/55">These vehicles don&apos;t start here, but you can wave one down on the main road or get off here.</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {passing.map(({ line }) => (
                  <li key={line.id} className="flex items-center gap-2.5 rounded-2xl bg-cream/60 px-3 py-2">
                    <ModeTile mode={line.mode} size={26} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-ink">{line.stationName.split(" — ")[0]} → {line.toLabel}</p>
                      <p className="text-[11px] text-ink/50">{MODE_INFO[line.mode].label}{line.name ? ` · ${line.name}` : ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-base font-bold text-ink">Queue history</h2>
            {reports.length === 0 ? (
              <p className="mt-3 rounded-2xl bg-cream/70 p-4 text-xs text-ink/60">No reports yet. Be the first to tell riders what the queue looks like.</p>
            ) : (
              <ul className="mt-2 divide-y divide-forest/5">
                {reports.map((r) => (
                  <li key={r.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${crowdOf(r.crowd).dot}`} />
                        <span className="text-sm font-semibold text-ink">{crowdOf(r.crowd).label}</span>
                        <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-ink/60">~{r.waitMinutes} min</span>
                        {r.mode ? <ModeChip mode={r.mode} small /> : null}
                      </div>
                      <span className="text-[11px] text-ink/45">{r.userName ?? "Guest"} · <TimeAgo iso={r.createdAt.toISOString()} /></span>
                    </div>
                    {r.note ? <p className="mt-1 pl-4 text-xs text-ink/60">{r.note}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {live && live.reportCount ? (
            <div className="rounded-3xl bg-forest p-5 text-cream">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Live right now</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold">~{live.liveWait} min</p>
                <CrowdPill crowd={live.crowd} />
              </div>
              <p className="mt-1 text-xs text-cream/70">From {live.reportCount} rider report{live.reportCount > 1 ? "s" : ""} in the last 3 hours (recent ones weigh more).</p>
            </div>
          ) : null}
          <ReportForm stationId={station.id} stationName={station.name} isLoggedIn={Boolean(user)} />
          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-sm font-bold text-ink">Nearby stations</h2>
            <ul className="mt-2 divide-y divide-forest/5">
              {nearby.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link href={`/stations/${n.id}`} className="block truncate text-[13px] font-semibold text-ink hover:underline">{n.name}</Link>
                    <p className="truncate text-[11px] text-ink/50">{n.landmark ?? n.area}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-forest">{n.meters < 1000 ? `${n.meters} m` : `${(n.meters / 1000).toFixed(1)} km`}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
