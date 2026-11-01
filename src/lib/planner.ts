import type { LineStop } from "@/db/schema";
import {
  addisHour,
  crowdFromWait,
  expectedWait,
  fareFor,
  haversineM,
  isServiceRunning,
  modeInfo,
  PERIOD_INFO,
  rideHailFare,
  rideMinutes,
  trafficPeriod,
  walkMetersEstimate,
  walkMinutes,
  type LatLng,
  type Mode,
} from "@/lib/transit";

// ── Types ──────────────────────────────────────────────────────────────
export type NetLine = {
  id: number;
  stationId: number;
  stationName: string;
  stationNameAm: string | null;
  stationLandmark: string | null;
  mode: Mode;
  name: string | null;
  toLabel: string;
  toLabelAm: string | null;
  popularity: number;
  stops: LineStop[];
};

export type NetStation = {
  id: number;
  name: string;
  nameAm: string | null;
  landmark: string | null;
  kind: string;
  area: string;
  lat: number;
  lng: number;
};

export type LiveWait = { stationId: number; liveWait: number | null; crowd: string | null; reportCount: number };

export type Priority = "best" | "fastest" | "cheapest" | "less_walking";

export type Leg = {
  kind: "walk" | "ride";
  from: LatLng;
  to: LatLng;
  fromName: string;
  toName: string;
  minutes: number;
  meters: number;
  path: Array<[number, number]>;
  roadSnapped: boolean;
  instruction: string;
  // ride only
  mode?: Mode;
  lineId?: number;
  lineName?: string | null;
  stationId?: number;
  stationName?: string;
  landmark?: string | null;
  sign?: string;
  signAm?: string | null;
  alightName?: string;
  alightAm?: string;
  stopsPassed?: Array<{ name: string; am: string; lat: number; lng: number }>;
  stopCount?: number;
  km?: number;
  waitMinutes?: number;
  fare?: { min: number; max: number };
  popularity?: number;
  crowd?: string | null;
  live?: boolean;
  midRoute?: boolean;
};

export type TripOption = {
  id: string;
  kind: "transit" | "walk" | "ride_hail";
  legs: Leg[];
  totalMinutes: number;
  fare: { min: number; max: number };
  transfers: number;
  walkMeters: number;
  modes: Mode[];
  tags: string[];
  cost: number;
  popularity: number;
  summary: string;
  warnings: string[];
};

export type NearbyStation = {
  station: NetStation;
  meters: number;
  minutes: number;
  modes: Mode[];
  lineCount: number;
  crowd: string | null;
  live: boolean;
};

export type PlanContext = {
  hour: number;
  period: string;
  periodLabel: string;
  periodNote: string;
  directKm: number;
  closedModes: Mode[];
};

export type PlanResult = {
  options: TripOption[];
  rideHail: TripOption | null;
  nearOrigin: NearbyStation[];
  nearDestination: NearbyStation[];
  context: PlanContext;
};

// ── Internal search structures ─────────────────────────────────────────
type Seg =
  | { t: "walk"; from: LatLng; to: LatLng; fromName: string; toName: string; meters: number }
  | { t: "ride"; line: number; i: number; j: number; wait: number; ride: number; km: number; fare: { min: number; max: number }; mid: boolean };

type Label = {
  segs: Seg[];
  time: number;
  walkM: number;
  fareMin: number;
  fareMax: number;
  rides: number;
  mids: number;
  pop: number;
  atLine: number;
  atStop: number;
};

const MID_BOARD: Record<Mode, boolean> = { minibus: true, city_bus: true, train: true, bajaj: true, intercity_bus: false };
const TRANSFER_M = 650;

type Prepared = { lines: NetLine[]; cumKm: number[][]; transfers: Map<string, Array<{ l: number; i: number; m: number }>> };
let preparedCache: { signature: string; data: Prepared } | null = null;

function prepare(lines: NetLine[]): Prepared {
  const signature = `${lines.length}:${lines.reduce((s, l) => s + l.id * 7 + l.stops.length, 0)}`;
  if (preparedCache?.signature === signature) return preparedCache.data;

  const cumKm = lines.map((line) => {
    const acc = [0];
    for (let k = 1; k < line.stops.length; k++) acc.push(acc[k - 1] + walkMetersEstimate(line.stops[k - 1], line.stops[k]) / 1000);
    return acc;
  });

  const boardPoints: Array<{ l: number; i: number; p: LineStop }> = [];
  lines.forEach((line, l) =>
    line.stops.forEach((p, i) => {
      if (i < line.stops.length - 1 && (i === 0 || MID_BOARD[line.mode])) boardPoints.push({ l, i, p });
    }),
  );

  const transfers = new Map<string, Array<{ l: number; i: number; m: number }>>();
  lines.forEach((line, l) => {
    for (let j = 1; j < line.stops.length; j++) {
      const a = line.stops[j];
      const list: Array<{ l: number; i: number; m: number }> = [];
      for (const bp of boardPoints) {
        if (bp.l === l) continue;
        const m = walkMetersEstimate(a, bp.p);
        if (m <= TRANSFER_M) list.push({ l: bp.l, i: bp.i, m });
      }
      transfers.set(`${l}:${j}`, list);
    }
  });

  const data = { lines, cumKm, transfers };
  preparedCache = { signature, data };
  return data;
}

function generalizedCost(label: { time: number; walkM: number; rides: number; fareMin: number; mids: number; pop: number }, priority: Priority) {
  const walkMin = label.walkM / 75;
  const transfers = Math.max(0, label.rides - 1);
  const popBonus = label.rides > 0 ? (label.pop / label.rides - 3) * 2 : 0;
  switch (priority) {
    case "fastest":
      return label.time + transfers * 2 + label.mids;
    case "cheapest":
      return label.fareMin + label.time * 0.15 + transfers * 2;
    case "less_walking":
      return label.time + walkMin * 3 + transfers * 5 + label.mids * 3;
    default:
      return label.time + walkMin * 0.5 + transfers * 7 + label.fareMin * 0.06 + label.mids * 4 - popBonus;
  }
}

// ── Planner ────────────────────────────────────────────────────────────
export function planJourney(input: {
  origin: LatLng & { label: string };
  destination: LatLng & { label: string };
  lines: NetLine[];
  stations: NetStation[];
  waits: LiveWait[];
  departAt: Date;
  priority?: Priority;
  modes?: Mode[];
}): PlanResult {
  const priority = input.priority ?? "best";
  const hour = addisHour(input.departAt);
  const period = trafficPeriod(hour);
  const allowed = new Set<Mode>(input.modes && input.modes.length > 0 ? input.modes : ["minibus", "city_bus", "train", "bajaj", "intercity_bus"]);
  const liveByStation = new Map(input.waits.map((w) => [w.stationId, w]));
  const closedModes = (["minibus", "city_bus", "train", "bajaj", "intercity_bus"] as Mode[]).filter((m) => !isServiceRunning(m, hour));

  const origin = input.origin;
  const dest = input.destination;
  const directKm = haversineM(origin, dest) / 1000;

  const runSearch = (ignoreHours: boolean, accessMax: number, egressMax: number) => {
    const usable = input.lines.filter((l) => allowed.has(l.mode) && (ignoreHours || isServiceRunning(l.mode, hour)));
    const prep = prepare(usable);
    const { lines, cumKm, transfers } = prep;
    const complete: Label[] = [];

    const waitFor = (l: number, i: number, atMinute: number) => {
      const line = lines[l];
      const live = i === 0 ? liveByStation.get(line.stationId) : undefined;
      return expectedWait(line.mode, line.popularity, (hour + atMinute / 60) % 24, {
        midRoute: i > 0,
        liveWait: live && live.reportCount > 0 ? live.liveWait : null,
      });
    };

    const rideFrom = (base: Label, l: number, i: number, walk: Seg | null, walkM: number, out: Label[]) => {
      const line = lines[l];
      const startTime = base.time + walkMinutes(walkM);
      const wait = waitFor(l, i, startTime);
      const mid = i > 0 && (line.mode === "minibus" || line.mode === "bajaj");
      for (let j = i + 1; j < line.stops.length; j++) {
        const km = cumKm[l][j] - cumKm[l][i];
        const ride = rideMinutes(line.mode, km, (hour + startTime / 60) % 24);
        const fare = fareFor(line.mode, km, hour);
        const segs = [...base.segs];
        if (walk) segs.push(walk);
        segs.push({ t: "ride", line: l, i, j, wait, ride, km, fare, mid });
        out.push({
          segs,
          time: startTime + wait + ride,
          walkM: base.walkM + walkM,
          fareMin: base.fareMin + fare.min,
          fareMax: base.fareMax + fare.max,
          rides: base.rides + 1,
          mids: base.mids + (mid ? 1 : 0),
          pop: base.pop + line.popularity,
          atLine: l,
          atStop: j,
        });
      }
    };

    const tryEgress = (label: Label) => {
      const stop = lines[label.atLine].stops[label.atStop];
      const m = walkMetersEstimate(stop, dest);
      if (m > egressMax) return;
      complete.push({
        ...label,
        segs: [...label.segs, { t: "walk", from: stop, to: dest, fromName: stop.name, toName: dest.label, meters: m }],
        time: label.time + walkMinutes(m),
        walkM: label.walkM + m,
      });
    };

    const empty: Label = { segs: [], time: 0, walkM: 0, fareMin: 0, fareMax: 0, rides: 0, mids: 0, pop: 0, atLine: -1, atStop: -1 };

    // Round 1 — access + first ride
    let frontier: Label[] = [];
    lines.forEach((line, l) => {
      const candidates: Array<{ i: number; m: number; score: number }> = [];
      line.stops.forEach((stop, i) => {
        if (i >= line.stops.length - 1) return;
        if (i > 0 && !MID_BOARD[line.mode]) return;
        const m = walkMetersEstimate(origin, stop);
        if (m > accessMax) return;
        const midPenalty = i > 0 && (line.mode === "minibus" || line.mode === "bajaj") ? 8 : 0;
        candidates.push({ i, m, score: m / 75 + midPenalty });
      });
      candidates.sort((a, b) => a.score - b.score);
      for (const c of candidates.slice(0, 2)) {
        const stop = line.stops[c.i];
        const walk: Seg = {
          t: "walk",
          from: origin,
          to: stop,
          fromName: origin.label,
          toName: c.i === 0 ? line.stationName : `${stop.name} roadside stop`,
          meters: c.m,
        };
        rideFrom(empty, l, c.i, walk, c.m, frontier);
      }
    });
    frontier.forEach(tryEgress);

    // Rounds 2 & 3 — transfers
    for (let round = 2; round <= 3; round++) {
      const best = complete.length ? Math.min(...complete.map((c) => c.time)) : Infinity;
      const limit = Number.isFinite(best) ? best * (round === 2 ? 1.5 : 1.25) + 10 : 240;
      const byNode = new Map<string, Label[]>();
      for (const label of frontier) {
        if (label.time > limit) continue;
        const key = lines[label.atLine].stops[label.atStop].key;
        const list = byNode.get(key) ?? [];
        list.push(label);
        byNode.set(key, list);
      }
      const seeds: Label[] = [];
      for (const list of byNode.values()) {
        list.sort((a, b) => a.time - b.time);
        seeds.push(...list.slice(0, round === 2 ? 3 : 2));
      }
      seeds.sort((a, b) => a.time - b.time);
      const next: Label[] = [];
      for (const label of seeds.slice(0, round === 2 ? 350 : 160)) {
        const usedLines = new Set(label.segs.filter((s): s is Extract<Seg, { t: "ride" }> => s.t === "ride").map((s) => s.line));
        const options = transfers.get(`${label.atLine}:${label.atStop}`) ?? [];
        const alight = lines[label.atLine].stops[label.atStop];
        for (const opt of options) {
          if (usedLines.has(opt.l)) continue;
          const target = lines[opt.l];
          // skip lines that just return toward where we came from
          if (walkMetersEstimate(target.stops[target.stops.length - 1], dest) > walkMetersEstimate(alight, dest) + 1500) continue;
          const boardStop = target.stops[opt.i];
          const walk: Seg = {
            t: "walk",
            from: alight,
            to: boardStop,
            fromName: alight.name,
            toName: opt.i === 0 ? target.stationName : `${boardStop.name} roadside stop`,
            meters: opt.m,
          };
          rideFrom(label, opt.l, opt.i, opt.m > 40 ? walk : null, opt.m, next);
        }
      }
      next.forEach(tryEgress);
      frontier = next;
    }

    return { complete, lines };
  };

  let search = runSearch(false, 1300, 1300);
  if (search.complete.length === 0) search = runSearch(false, 2600, 2600);
  let ignoredHours = false;
  if (search.complete.length === 0 && closedModes.length > 0) {
    search = runSearch(true, 2600, 2600);
    ignoredHours = search.complete.length > 0;
  }
  if (search.complete.length === 0) search = runSearch(ignoredHours, 4200, 3500);

  const { complete, lines } = search;

  // ── Turn labels into rider-facing options ──
  const toOption = (label: Label): TripOption => {
    const legs: Leg[] = [];
    const warnings: string[] = [];
    for (const seg of label.segs) {
      if (seg.t === "walk") {
        const meters = Math.round(seg.meters);
        legs.push({
          kind: "walk",
          from: seg.from,
          to: seg.to,
          fromName: seg.fromName,
          toName: seg.toName,
          meters,
          minutes: walkMinutes(meters),
          path: [
            [seg.from.lat, seg.from.lng],
            [seg.to.lat, seg.to.lng],
          ],
          roadSnapped: false,
          instruction: "",
        });
        continue;
      }
      const line = lines[seg.line];
      const board = line.stops[seg.i];
      const alight = line.stops[seg.j];
      const passed = line.stops.slice(seg.i, seg.j + 1);
      const live = seg.i === 0 ? liveByStation.get(line.stationId) : undefined;
      const crowd = live && live.reportCount > 0 ? live.crowd : seg.i === 0 ? crowdFromWait(seg.wait) : null;
      if (seg.mid) warnings.push(`Minibuses passing ${board.name} are often full in rush hour — boarding at the tera is more reliable.`);
      legs.push({
        kind: "ride",
        from: board,
        to: alight,
        fromName: seg.i === 0 ? line.stationName : board.name,
        toName: alight.name,
        minutes: seg.ride,
        meters: Math.round(seg.km * 1000),
        km: Number(seg.km.toFixed(1)),
        path: passed.map((p) => [p.lat, p.lng] as [number, number]),
        roadSnapped: false,
        instruction: "",
        mode: line.mode,
        lineId: line.id,
        lineName: line.name,
        stationId: seg.i === 0 ? line.stationId : undefined,
        stationName: seg.i === 0 ? line.stationName : `${board.name} (roadside)`,
        landmark: seg.i === 0 ? line.stationLandmark : null,
        sign: line.toLabel,
        signAm: line.toLabelAm,
        alightName: alight.name,
        alightAm: alight.am,
        stopsPassed: passed.map((p) => ({ name: p.name, am: p.am, lat: p.lat, lng: p.lng })),
        stopCount: seg.j - seg.i,
        waitMinutes: seg.wait,
        fare: seg.fare,
        popularity: line.popularity,
        crowd,
        live: Boolean(live && live.reportCount > 0),
        midRoute: seg.mid,
      });
    }
    // Drop zero-length walking at the start/end (already at the stand)
    const trimmed = legs.filter((leg, idx) => !(leg.kind === "walk" && leg.meters < 40 && (idx === 0 || idx === legs.length - 1)));
    const option = finalizeOption(trimmed, priority, hour);
    option.warnings = Array.from(new Set(warnings));
    if (ignoredHours) option.warnings.unshift("Some of these services are closed at this hour — times assume the next morning service.");
    return option;
  };

  let options = complete.map(toOption);

  // Collapse duplicates (same line sequence) keeping the best scoring version
  const bySig = new Map<string, TripOption>();
  for (const option of options) {
    const sig = option.legs.filter((l) => l.kind === "ride").map((l) => l.lineId).join(">");
    const existing = bySig.get(sig);
    if (!existing || option.cost < existing.cost) bySig.set(sig, option);
  }
  options = Array.from(bySig.values());

  // Pareto filter on (time, fare, transfers, walking)
  options = options.filter(
    (a) =>
      !options.some(
        (b) =>
          b !== a &&
          b.totalMinutes <= a.totalMinutes - 3 &&
          b.fare.min <= a.fare.min &&
          b.transfers <= a.transfers &&
          b.walkMeters <= a.walkMeters + 150,
      ),
  );
  options.sort((a, b) => a.cost - b.cost);
  options = options.slice(0, 7);

  // Walking-only option for short trips
  const walkM = walkMetersEstimate(origin, dest);
  if (walkM <= 2600) {
    const walkLeg: Leg = {
      kind: "walk",
      from: origin,
      to: dest,
      fromName: origin.label,
      toName: dest.label,
      meters: Math.round(walkM),
      minutes: walkMinutes(walkM),
      path: [
        [origin.lat, origin.lng],
        [dest.lat, dest.lng],
      ],
      roadSnapped: false,
      instruction: "",
    };
    const w = finalizeOption([walkLeg], priority, hour);
    w.kind = "walk";
    options.push(w);
  }

  // Ride-hailing comparison
  const hailKm = (haversineM(origin, dest) * 1.35) / 1000;
  const hailFare = rideHailFare(hailKm);
  const hailMinutes = rideMinutes("minibus", hailKm, hour) + 6;
  const rideHail: TripOption = {
    id: "ride-hail",
    kind: "ride_hail",
    legs: [],
    totalMinutes: hailMinutes,
    fare: hailFare,
    transfers: 0,
    walkMeters: 0,
    modes: [],
    tags: ["Door to door"],
    cost: Infinity,
    popularity: 0,
    summary: "Ride-hailing taxi (RIDE, Feres, ZayRide) straight to your destination",
    warnings: [],
  };

  retag(options);

  const nearOrigin = nearbyStations(origin, input.stations, input.lines, liveByStation, 5);
  const nearDestination = nearbyStations(dest, input.stations, input.lines, liveByStation, 3);

  return {
    options,
    rideHail,
    nearOrigin,
    nearDestination,
    context: {
      hour,
      period,
      periodLabel: PERIOD_INFO[period].label,
      periodNote: PERIOD_INFO[period].note,
      directKm: Number(directKm.toFixed(1)),
      closedModes,
    },
  };
}

// ── Helpers shared with enrichment ─────────────────────────────────────
export function writeInstructions(legs: Leg[]) {
  legs.forEach((leg, idx) => {
    const next = legs[idx + 1];
    if (leg.kind === "walk") {
      const dist = leg.meters < 1000 ? `${Math.round(leg.meters / 10) * 10} m` : `${(leg.meters / 1000).toFixed(1)} km`;
      if (next?.kind === "ride" && next.stationId) {
        leg.instruction = `Walk ${dist} (${leg.minutes} min) to ${next.stationName}.${next.landmark ? ` ${next.landmark}` : ""}`;
      } else if (next?.kind === "ride") {
        leg.instruction = `Walk ${dist} (${leg.minutes} min) to the main road at ${next.from && next.stopsPassed?.[0]?.name}. Stand on the side heading to ${next.sign} and wave at a passing ${modeInfo(next.mode ?? "minibus").short.toLowerCase()}.`;
      } else {
        leg.instruction = `Walk ${dist} (${leg.minutes} min) to ${leg.toName}.`;
      }
      return;
    }
    const info = modeInfo(leg.mode ?? "minibus");
    const via = (leg.stopsPassed ?? []).slice(1, -1).map((s) => s.name);
    const viaText = via.length ? ` via ${via.slice(0, 4).join(", ")}${via.length > 4 ? "…" : ""}` : "";
    const fare = leg.fare ? (leg.fare.min === leg.fare.max ? `${leg.fare.min} birr` : `${leg.fare.min}–${leg.fare.max} birr`) : "";
    const dropAtEnd = leg.alightName === leg.sign;
    switch (leg.mode) {
      case "train":
        leg.instruction = `Take the ${leg.lineName ?? "light rail"} toward ${leg.sign}${viaText}. Get off at ${leg.alightName} after ${leg.stopCount} stop${leg.stopCount === 1 ? "" : "s"}. Ticket ${fare} at the platform kiosk.`;
        break;
      case "city_bus":
        leg.instruction = `Take the ${leg.lineName ?? "city"} bus toward ${leg.sign}${viaText}. Get off at ${leg.alightName} (${leg.stopCount} stop${leg.stopCount === 1 ? "" : "s"}). Fare ${fare}.`;
        break;
      case "bajaj":
        leg.instruction = `Take a bajaj heading to ${leg.sign}${dropAtEnd ? "" : ` and ask to be dropped at ${leg.alightName}`}. Agree the price first — about ${fare}.`;
        break;
      case "intercity_bus":
        leg.instruction = `Buy a ticket for the bus to ${leg.sign}${dropAtEnd ? "" : ` and tell the assistant you are getting off at ${leg.alightName}`}. About ${fare}.`;
        break;
      default:
        leg.instruction = `Board a ${info.short.toLowerCase()} whose redat (conductor) calls “${leg.sign}”${leg.signAm ? ` (${leg.signAm})` : ""}${viaText}. ${
          dropAtEnd ? `Ride to the end at ${leg.alightName}.` : `Get off at ${leg.alightName} — tell the redat “ወራጅ አለ” (woraj alle) before the stop.`
        } Fare ${fare}.`;
    }
  });
}

export function finalizeOption(legs: Leg[], priority: Priority, hour: number): TripOption {
  let time = 0;
  let walk = 0;
  let fareMin = 0;
  let fareMax = 0;
  let rides = 0;
  let mids = 0;
  let pop = 0;
  for (const leg of legs) {
    if (leg.kind === "walk") {
      time += leg.minutes;
      walk += leg.meters;
    } else {
      time += (leg.waitMinutes ?? 0) + leg.minutes;
      fareMin += leg.fare?.min ?? 0;
      fareMax += leg.fare?.max ?? 0;
      rides += 1;
      mids += leg.midRoute ? 1 : 0;
      pop += leg.popularity ?? 3;
    }
  }
  writeInstructions(legs);
  const rideLegs = legs.filter((l) => l.kind === "ride");
  const modes = Array.from(new Set(rideLegs.map((l) => l.mode as Mode)));
  const summary =
    rideLegs.length === 0
      ? `Walk to ${legs[legs.length - 1]?.toName ?? "destination"}`
      : rideLegs.map((l) => `${modeInfo(l.mode ?? "minibus").short} ${l.fromName.split(" — ")[0].replace(/ Tera$/, "")} → ${l.alightName}`).join(" · ");
  void hour;
  return {
    id: rideLegs.length ? rideLegs.map((l) => `${l.lineId}-${l.stopCount}`).join("_") : `walk`,
    kind: rideLegs.length ? "transit" : "walk",
    legs,
    totalMinutes: Math.round(time),
    fare: { min: fareMin, max: fareMax },
    transfers: Math.max(0, rides - 1),
    walkMeters: Math.round(walk),
    modes,
    tags: [],
    cost: generalizedCost({ time, walkM: walk, rides, fareMin, mids, pop }, priority),
    popularity: rides ? pop / rides : 0,
    summary,
    warnings: [],
  };
}

export function retag(options: TripOption[]) {
  options.forEach((o) => (o.tags = []));
  const transit = options.filter((o) => o.kind === "transit");
  if (options.length === 0) return;
  const pick = (list: TripOption[], fn: (o: TripOption) => number) =>
    list.length ? list.reduce((best, o) => (fn(o) < fn(best) ? o : best), list[0]) : null;
  const add = (o: TripOption | null, tag: string) => o && !o.tags.includes(tag) && o.tags.push(tag);

  add(pick(options, (o) => o.cost), "Recommended");
  add(pick(options, (o) => o.totalMinutes * 100 + o.transfers), "Fastest");
  add(pick(transit, (o) => o.fare.min * 1000 + o.totalMinutes), "Cheapest");
  add(pick(transit, (o) => o.transfers * 1000 + o.totalMinutes), "Fewest transfers");
  add(pick(options, (o) => o.walkMeters * 10 + o.totalMinutes), "Least walking");
  const popular = pick(transit, (o) => -o.popularity * 100 + o.totalMinutes / 10);
  if (popular && popular.popularity >= 4) add(popular, "Most used route");
  for (const o of options) {
    if (o.modes.includes("train")) add(o, "Skips traffic");
    if (o.legs.some((l) => l.live)) add(o, "Live queue data");
  }
}

function nearbyStations(
  point: LatLng,
  stations: NetStation[],
  lines: NetLine[],
  live: Map<number, LiveWait>,
  limit: number,
): NearbyStation[] {
  return stations
    .map((station) => ({ station, meters: walkMetersEstimate(point, station) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, limit)
    .map(({ station, meters }) => {
      const serving = lines.filter(
        (l) => l.stationId === station.id || l.stops.some((s, i) => i > 0 && i < l.stops.length - 1 && haversineM(s, station) < 250),
      );
      const w = live.get(station.id);
      return {
        station,
        meters: Math.round(meters),
        minutes: walkMinutes(meters),
        modes: Array.from(new Set(serving.map((l) => l.mode))),
        lineCount: serving.filter((l) => l.stationId === station.id).length,
        crowd: w && w.reportCount > 0 ? w.crowd : null,
        live: Boolean(w && w.reportCount > 0),
      };
    });
}
