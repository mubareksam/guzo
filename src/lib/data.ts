import { desc, eq, gt, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { contributions, feedback, reports, routes, stations, users, type LineStop } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import type { LiveWait, NetLine, NetStation } from "@/lib/planner";
import { haversineM, MODES, type Mode } from "@/lib/transit";

export async function bootstrap() {
  await ensureSeeded();
}

type StationRow = typeof stations.$inferSelect;
type RouteRow = typeof routes.$inferSelect;

let networkCache: { at: number; stations: StationRow[]; routes: RouteRow[] } | null = null;

export function invalidateNetwork() {
  networkCache = null;
}

async function loadNetwork() {
  await bootstrap();
  if (networkCache && Date.now() - networkCache.at < 60_000) return networkCache;
  const [stationRows, routeRows] = await Promise.all([
    db.select().from(stations).orderBy(stations.name),
    db.select().from(routes).where(eq(routes.active, true)),
  ]);
  networkCache = { at: Date.now(), stations: stationRows, routes: routeRows };
  return networkCache;
}

export async function getNetwork(): Promise<{ stations: NetStation[]; lines: NetLine[]; raw: StationRow[] }> {
  const { stations: stationRows, routes: routeRows } = await loadNetwork();
  const byId = new Map(stationRows.map((s) => [s.id, s]));
  const lines: NetLine[] = routeRows
    .filter((r) => (r.stops as LineStop[]).length >= 2)
    .map((r) => {
      const st = byId.get(r.stationId);
      return {
        id: r.id,
        stationId: r.stationId,
        stationName: st?.name ?? "Station",
        stationNameAm: st?.nameAm ?? null,
        stationLandmark: st?.landmark ?? null,
        mode: r.mode as Mode,
        name: r.name,
        toLabel: r.toLabel,
        toLabelAm: r.toLabelAm,
        popularity: r.popularity,
        stops: r.stops as LineStop[],
      };
    });
  return {
    stations: stationRows.map((s) => ({
      id: s.id,
      name: s.name,
      nameAm: s.nameAm,
      landmark: s.landmark,
      kind: s.kind,
      area: s.area,
      lat: s.lat,
      lng: s.lng,
    })),
    lines,
    raw: stationRows,
  };
}

export async function getWaitInfo(): Promise<LiveWait[]> {
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const rows = await db
    .select({ stationId: reports.stationId, waitMinutes: reports.waitMinutes, crowd: reports.crowd, createdAt: reports.createdAt })
    .from(reports)
    .where(gte(reports.createdAt, since))
    .orderBy(desc(reports.createdAt));

  // Recency-weighted average: a 10-minute-old report counts far more than a 2-hour-old one
  const byStation = new Map<number, { weighted: number; weights: number; crowd: string; count: number }>();
  for (const row of rows) {
    const ageMin = (Date.now() - row.createdAt.getTime()) / 60000;
    const w = Math.exp(-ageMin / 60);
    const cur = byStation.get(row.stationId);
    if (!cur) byStation.set(row.stationId, { weighted: row.waitMinutes * w, weights: w, crowd: row.crowd, count: 1 });
    else {
      cur.weighted += row.waitMinutes * w;
      cur.weights += w;
      cur.count += 1;
    }
  }
  return Array.from(byStation.entries()).map(([stationId, v]) => ({
    stationId,
    liveWait: Math.round(v.weighted / v.weights),
    crowd: v.crowd,
    reportCount: v.count,
  }));
}

export type StationSummary = NetStation & {
  verified: boolean;
  departModes: Mode[];
  passModes: Mode[];
  departures: number;
  destinations: string[];
  minFare: number;
  crowd: string | null;
  liveWait: number | null;
};

function servingLines(station: { id: number; lat: number; lng: number }, lines: NetLine[]) {
  const depart = lines.filter((l) => l.stationId === station.id);
  const pass = lines.filter(
    (l) => l.stationId !== station.id && l.stops.some((s, i) => i > 0 && haversineM(s, station) < 260),
  );
  return { depart, pass };
}

export async function getStationSummaries(): Promise<StationSummary[]> {
  const [{ stations: list, lines, raw }, waits] = await Promise.all([getNetwork(), getWaitInfo()]);
  const fares = new Map<number, number>();
  const { routes: routeRows } = await loadNetwork();
  for (const r of routeRows) fares.set(r.stationId, Math.min(fares.get(r.stationId) ?? Infinity, r.fareMin));
  const waitBy = new Map(waits.map((w) => [w.stationId, w]));
  const verified = new Map(raw.map((s) => [s.id, s.verified]));
  return list.map((st) => {
    const { depart, pass } = servingLines(st, lines);
    const departModes = MODES.filter((m) => depart.some((l) => l.mode === m));
    const passModes = MODES.filter((m) => !departModes.includes(m) && pass.some((l) => l.mode === m));
    const w = waitBy.get(st.id);
    return {
      ...st,
      verified: verified.get(st.id) ?? false,
      departModes,
      passModes,
      departures: depart.length,
      destinations: Array.from(new Set(depart.map((l) => l.toLabel))),
      minFare: Number.isFinite(fares.get(st.id) ?? Infinity) ? (fares.get(st.id) as number) : 0,
      crowd: w?.crowd ?? null,
      liveWait: w?.liveWait ?? null,
    };
  });
}

export async function getStationDetail(id: number) {
  const { stations: list, lines, raw } = await getNetwork();
  const station = raw.find((s) => s.id === id);
  if (!station) return null;
  const { routes: routeRows } = await loadNetwork();
  const { depart, pass } = servingLines(station, lines);
  const routeById = new Map(routeRows.map((r) => [r.id, r]));
  const departures = depart
    .map((l) => ({ line: l, row: routeById.get(l.id)! }))
    .sort((a, b) => b.line.popularity - a.line.popularity || a.row.durationMin - b.row.durationMin);
  const passing = pass.map((l) => {
    const idx = l.stops.findIndex((s, i) => i > 0 && haversineM(s, station) < 260);
    return { line: l, stopIndex: idx, row: routeById.get(l.id)! };
  });

  const recentReports = await db
    .select({
      id: reports.id,
      crowd: reports.crowd,
      waitMinutes: reports.waitMinutes,
      mode: reports.mode,
      note: reports.note,
      createdAt: reports.createdAt,
      userName: users.name,
    })
    .from(reports)
    .leftJoin(users, eq(users.id, reports.userId))
    .where(eq(reports.stationId, id))
    .orderBy(desc(reports.createdAt))
    .limit(12);

  const nearby = list
    .filter((s) => s.id !== id)
    .map((s) => ({ ...s, meters: Math.round(haversineM(station, s)) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, 5);

  return { station, departures, passing, reports: recentReports, nearby };
}

export async function getPopularDestinations(limit = 8) {
  const { lines } = await getNetwork();
  const { routes: routeRows } = await loadNetwork();
  const fareById = new Map(routeRows.map((r) => [r.id, r.fareMin]));
  const map = new Map<string, { label: string; am: string | null; lat: number; lng: number; departures: number; minFare: number }>();
  for (const l of lines) {
    const last = l.stops[l.stops.length - 1];
    const cur = map.get(l.toLabel);
    const fare = fareById.get(l.id) ?? 10;
    if (!cur) map.set(l.toLabel, { label: l.toLabel, am: l.toLabelAm, lat: last.lat, lng: last.lng, departures: 1, minFare: fare });
    else {
      cur.departures += 1;
      cur.minFare = Math.min(cur.minFare, fare);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.departures - a.departures)
    .slice(0, limit);
}

export async function getNetworkStats() {
  await bootstrap();
  const [[s], [r], [rep], [u], [c]] = await Promise.all([
    db.select({ value: sql<number>`count(*)::int` }).from(stations),
    db.select({ value: sql<number>`count(*)::int` }).from(routes),
    db.select({ value: sql<number>`count(*)::int` }).from(reports),
    db.select({ value: sql<number>`count(*)::int` }).from(users),
    db.select({ value: sql<number>`count(*)::int` }).from(contributions),
  ]);
  const { lines } = await getNetwork();
  const stopKeys = new Set(lines.flatMap((l) => l.stops.map((s) => s.key)));
  return {
    stations: s?.value ?? 0,
    routes: r?.value ?? 0,
    reports: rep?.value ?? 0,
    contributors: u?.value ?? 0,
    contributions: c?.value ?? 0,
    places: stopKeys.size,
  };
}

export async function getLeaderboard(limit = 10) {
  await bootstrap();
  return db
    .select({
      id: users.id,
      name: users.name,
      points: users.points,
      homeArea: users.homeArea,
      approved: sql<number>`count(distinct case when ${contributions.status} = 'approved' then ${contributions.id} end)::int`,
      submitted: sql<number>`count(distinct ${contributions.id})::int`,
    })
    .from(users)
    .leftJoin(contributions, eq(contributions.userId, users.id))
    .where(eq(users.isAdmin, false))
    .groupBy(users.id)
    .orderBy(desc(users.points))
    .limit(limit);
}

export async function getUserRank(userId: number) {
  await bootstrap();
  const [me] = await db.select({ points: users.points }).from(users).where(eq(users.id, userId)).limit(1);
  if (!me) return null;
  const [[ahead], [total]] = await Promise.all([
    db.select({ value: sql<number>`count(*)::int` }).from(users).where(gt(users.points, me.points)),
    db.select({ value: sql<number>`count(*)::int` }).from(users),
  ]);
  return { rank: (ahead?.value ?? 0) + 1, total: total?.value ?? 1 };
}

export async function getRecentContributions(limit = 8, status?: string) {
  await bootstrap();
  const query = db
    .select({
      id: contributions.id,
      type: contributions.type,
      stationName: contributions.stationName,
      area: contributions.area,
      lat: contributions.lat,
      lng: contributions.lng,
      status: contributions.status,
      details: contributions.details,
      createdAt: contributions.createdAt,
      userName: users.name,
      userId: contributions.userId,
    })
    .from(contributions)
    .leftJoin(users, eq(users.id, contributions.userId));
  const filtered = status ? query.where(eq(contributions.status, status)) : query;
  return filtered.orderBy(desc(contributions.createdAt)).limit(limit);
}

export async function getUserContributions(userId: number) {
  return db.select().from(contributions).where(eq(contributions.userId, userId)).orderBy(desc(contributions.createdAt));
}

export async function getUserReports(userId: number) {
  return db
    .select({
      id: reports.id,
      crowd: reports.crowd,
      waitMinutes: reports.waitMinutes,
      note: reports.note,
      createdAt: reports.createdAt,
      stationName: stations.name,
      stationId: stations.id,
    })
    .from(reports)
    .innerJoin(stations, eq(stations.id, reports.stationId))
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.createdAt))
    .limit(10);
}

export async function getPublicFeedback(limit = 12) {
  await bootstrap();
  return db
    .select({
      id: feedback.id,
      name: feedback.name,
      category: feedback.category,
      message: feedback.message,
      createdAt: feedback.createdAt,
      userName: users.name,
    })
    .from(feedback)
    .leftJoin(users, eq(users.id, feedback.userId))
    .where(eq(feedback.isPublic, true))
    .orderBy(desc(feedback.createdAt))
    .limit(limit);
}

export async function getRecentReports(limit = 6) {
  await bootstrap();
  return db
    .select({
      id: reports.id,
      crowd: reports.crowd,
      waitMinutes: reports.waitMinutes,
      note: reports.note,
      createdAt: reports.createdAt,
      stationName: stations.name,
      stationId: stations.id,
      userName: users.name,
    })
    .from(reports)
    .innerJoin(stations, eq(stations.id, reports.stationId))
    .leftJoin(users, eq(users.id, reports.userId))
    .orderBy(desc(reports.createdAt))
    .limit(limit);
}

let warming = false;
/** Pre-fetch road geometry for every line in the background so station pages render instantly. */
export async function warmLineShapes() {
  if (warming) return;
  warming = true;
  try {
    const { getShapes } = await import("@/lib/osrm");
    const { lines } = await getNetwork();
    for (let i = 0; i < lines.length; i += 4) {
      const batch = lines.slice(i, i + 4).map((l) => ({ profile: "driving" as const, points: l.stops.map((s) => ({ lat: s.lat, lng: s.lng })) }));
      await getShapes(batch, { budgetMs: 15000, concurrency: 2 });
      await new Promise((r) => setTimeout(r, 400));
    }
  } catch {
    warming = false;
  }
}
