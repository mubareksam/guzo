import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Footprints, LocateFixed, MapPinned, Navigation, Radio, Repeat2, Route, ShieldCheck, Signpost, Sparkles, Users } from "lucide-react";
import MapCanvas from "@/app/components/MapCanvas";
import type { MarkerKind } from "@/app/components/MapView";
import TimeAgo from "@/app/components/TimeAgo";
import { BadgeChip, CrowdPill, ModeTile, SectionHeading } from "@/app/components/ui";
import { getLeaderboard, getNetwork, getNetworkStats, getPopularDestinations, getRecentReports } from "@/lib/data";
import { badgeFor } from "@/lib/badges";
import { MODE_INFO, MODES } from "@/lib/transit";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, network, reports, leaders, popular] = await Promise.all([
    getNetworkStats(),
    getNetwork(),
    getRecentReports(5),
    getLeaderboard(5),
    getPopularDestinations(9),
  ]);

  const markers = network.stations.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.name, sublabel: s.landmark ?? s.area, kind: s.kind as MarkerKind, href: `/stations/${s.id}` }));

  return (
    <div>
      {/* Hero */}
      <section className="hero-pattern relative overflow-hidden border-b border-forest/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pb-16 lg:pt-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest">
              <Radio size={13} className="text-brick" /> Live in Addis Ababa
            </span>
            <h1 className="mt-4 text-[clamp(2.1rem,5.4vw,3.9rem)] font-semibold leading-[1.03] tracking-tight text-ink">
              Every tera. Every line.
              <br />
              <span className="text-moss">The right way home.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70 sm:text-base">
              Guzo knows where minibuses, Anbessa &amp; Sheger buses, the light rail and bajajs leave from — and every stop they pass. Tell it where you are and where
              you&apos;re going: it walks you to the right stand, tells you which sign to look for, where to get off and what to pay.
            </p>

            <form action="/plan" className="mt-6 rounded-3xl border border-forest/10 bg-white p-2.5 shadow-[0_24px_60px_rgba(13,32,24,0.10)]">
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2.5 rounded-2xl bg-cream/70 px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">From</span>
                    <input name="from" placeholder="e.g. Megenagna" className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink/35" />
                  </span>
                </label>
                <label className="flex items-center gap-2.5 rounded-2xl bg-cream/70 px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brick ring-4 ring-red-100" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">To</span>
                    <input name="to" placeholder="e.g. Edna Mall, Kality" className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink/35" />
                  </span>
                </label>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-5 py-3 text-sm font-bold text-cream hover:bg-forest/90">
                  <Sparkles size={16} /> Find routes
                </button>
              </div>
              <Link href="/plan" className="mt-2 inline-flex items-center gap-1.5 px-2 pb-1 text-xs font-semibold text-emerald-700 hover:underline">
                <LocateFixed size={13} /> Or start from my current location
              </Link>
            </form>

            <dl className="mt-6 grid max-w-lg grid-cols-3 gap-2.5">
              {[
                ["Stations", stats.stations],
                ["Lines", stats.routes],
                ["Named stops", stats.places],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded-2xl border border-forest/10 bg-white/70 px-3 py-2.5">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">{k}</dt>
                  <dd className="text-xl font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="h-[360px] overflow-hidden rounded-[28px] border border-forest/15 bg-white shadow-[0_30px_80px_rgba(13,32,24,0.18)] sm:h-[480px]">
              <MapCanvas markers={markers} center={[9.0, 38.775]} zoom={12} legend />
            </div>
            <div className="pointer-events-none absolute -bottom-4 left-4 right-4 z-[500] rounded-2xl bg-white/95 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur sm:left-auto sm:right-6 sm:w-80">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-moss">Example instruction</p>
              <div className="mt-1.5 flex items-center gap-2">
                <ModeTile mode="minibus" size={26} />
                <p className="text-[13px] font-semibold leading-snug text-ink">Board at Megenagna — Shola side, sign “Mexico · ሜክሲኮ”. Get off at Stadium.</p>
              </div>
              <p className="mt-1.5 text-[11px] text-ink/55">Say “ወራጅ አለ” before Stadium · 20 birr · ~6 min queue</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="How Guzo thinks" title="Smarter than “ask three people at the tera”" description="A real journey planner for Addis Ababa's informal and formal transport — calibrated for rush hour, queues and the way minibuses really work." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Footprints, title: "Walks you to the right stand", body: "Big junctions have several teras. Guzo tells you which one — by landmark — and draws the walking route on real streets." },
            { icon: Signpost, title: "Tells you the sign to look for", body: "See the destination the redat calls, in English and Amharic, plus how many stops you'll pass." },
            { icon: MapPinned, title: "Drop anywhere on the line", body: "Your destination isn't a terminus? Guzo finds lines that pass by and tells you exactly where to get off." },
            { icon: Repeat2, title: "Transfers when needed", body: "No direct taxi? It combines minibus, bus, light rail and bajaj with up to two changes, ranked by real travel time." },
          ].map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-3xl border border-forest/10 bg-white p-5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-gold"><Icon size={20} /></span>
              <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock3, title: "Rush-hour aware", body: "Speeds and queues change for the morning and evening peak, the evening and night." },
            { icon: Users, title: "Prefers busy routes", body: "Popular lines fill and leave faster, so they're ranked higher when times are close." },
            { icon: Route, title: "Road-snapped lines", body: "Every leg follows the real road network from OpenStreetMap — no straight lines." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl bg-sand/50 p-4">
              <Icon size={18} className="mt-0.5 shrink-0 text-moss" />
              <div>
                <p className="text-sm font-bold text-ink">{title}</p>
                <p className="text-xs leading-relaxed text-ink/65">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section className="border-y border-forest/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Transport signs" title="Five ways to move, one consistent set of icons" action={<Link href="/guide" className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline">Full riding guide <ArrowRight size={14} /></Link>} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {MODES.map((m) => (
              <Link key={m} href={`/stations?mode=${m}`} className="group rounded-3xl border border-forest/10 bg-cream/40 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                <ModeTile mode={m} size={46} />
                <h3 className="mt-3 text-sm font-bold text-ink">{MODE_INFO[m].label}</h3>
                <p className="text-xs font-medium text-ink/45">{MODE_INFO[m].am}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">{MODE_INFO[m].blurb}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-forest">See stations <ArrowRight size={11} className="transition group-hover:translate-x-0.5" /></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live + popular */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">Live from riders</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Queues right now</h2>
          <ul className="mt-5 space-y-2.5">
            {reports.map((r) => (
              <li key={r.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/stations/${r.stationId}`} className="block truncate text-sm font-semibold text-ink hover:underline">{r.stationName}</Link>
                    <p className="text-[11px] text-ink/50">{r.userName ?? "Guest rider"} · <TimeAgo iso={r.createdAt.toISOString()} /></p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <CrowdPill crowd={r.crowd} small />
                    <span className="text-[11px] font-bold text-forest">~{r.waitMinutes} min</span>
                  </div>
                </div>
                {r.note ? <p className="mt-1.5 text-xs text-ink/65">{r.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">Where Addis is heading</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Popular destinations</h2>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {popular.map((p) => (
              <Link key={p.label} href={`/plan?to=${encodeURIComponent(p.label)}&toLat=${p.lat}&toLng=${p.lng}`} className="flex items-center justify-between gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3 transition hover:border-forest/30">
                <div>
                  <p className="text-sm font-bold text-ink">{p.label}</p>
                  <p className="text-[11px] text-ink/50">{p.am} · {p.departures} lines</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-forest">from {p.minFare} birr</p>
                  <Navigation size={13} className="ml-auto mt-0.5 text-ink/35" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="grid gap-6 rounded-[32px] border border-forest/10 bg-white p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Built by riders" title="Stands move. The map moves with them." description="Report queues, pin a new tera, flag a moved stand or a new fare. Moderators verify it and the planner uses it for everyone. You earn points and badges." />
            <div className="mt-5 flex flex-wrap gap-2">
              {[0, 25, 75, 150, 300].map((p) => (
                <BadgeChip key={p} points={p} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/contribute" className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream"><BadgeCheck size={15} /> Contribute</Link>
              <Link href="/register" className="rounded-full px-5 py-2.5 text-sm font-semibold text-forest ring-1 ring-forest/20">Create account</Link>
            </div>
          </div>
          <div className="rounded-3xl bg-cream/60 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-ink"><ShieldCheck size={16} className="text-moss" /> Top contributors</p>
            <ul className="mt-2 divide-y divide-forest/5">
              {leaders.map((l, i) => (
                <li key={l.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-5 text-center text-xs font-bold text-ink/35">{i + 1}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-[11px] font-bold text-cream">{l.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{l.name}</p>
                    <p className="text-[11px] text-ink/45">{l.homeArea} · {l.approved} verified</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-ink">{l.points}</p>
                    <p className="text-[10px] text-ink/45">{badgeFor(l.points).name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
