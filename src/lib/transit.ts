/**
 * Transit knowledge shared by the planner (server) and the UI (client).
 * Fares, speeds and waits are calibrated estimates for Addis Ababa and are
 * blended with live rider reports at plan time.
 */

export type Mode = "minibus" | "city_bus" | "train" | "bajaj" | "intercity_bus";
export const MODES: Mode[] = ["minibus", "city_bus", "train", "bajaj", "intercity_bus"];

export const MODE_INFO: Record<
  Mode,
  { label: string; am: string; short: string; color: string; soft: string; text: string; blurb: string; hours: [number, number] }
> = {
  minibus: {
    label: "Minibus taxi",
    am: "ሚኒባስ ታክሲ",
    short: "Minibus",
    color: "#e0a526",
    soft: "bg-amber-50",
    text: "text-amber-700",
    blurb: "Blue-and-white 12-seaters. Leave the tera when full; the redat (conductor) calls the destination.",
    hours: [5.5, 22.5],
  },
  city_bus: {
    label: "City bus",
    am: "የከተማ አውቶቡስ",
    short: "Bus",
    color: "#16a34a",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    blurb: "Anbessa (red-yellow) and Sheger (blue) buses on fixed numbered routes. Cheapest way across town.",
    hours: [6, 21],
  },
  train: {
    label: "Light rail",
    am: "ቀላል ባቡር",
    short: "LRT",
    color: "#0284c7",
    soft: "bg-sky-50",
    text: "text-sky-700",
    blurb: "Addis Ababa LRT — East–West (Ayat ↔ Torhailoch) and North–South (Menelik II ↔ Kality). Not stuck in traffic.",
    hours: [6, 22],
  },
  bajaj: {
    label: "Bajaj",
    am: "ባጃጅ",
    short: "Bajaj",
    color: "#db2777",
    soft: "bg-pink-50",
    text: "text-pink-700",
    blurb: "Three-wheelers for short hops in outer neighbourhoods. Not allowed in the city centre.",
    hours: [6, 21],
  },
  intercity_bus: {
    label: "Intercity bus",
    am: "የአገር አቋራጭ አውቶቡስ",
    short: "Intercity",
    color: "#7c3aed",
    soft: "bg-violet-50",
    text: "text-violet-700",
    blurb: "Buses and highroof minibuses from Autobus Tera, Asko, Kality and Lamberet to nearby towns.",
    hours: [5, 18],
  },
};

export function modeInfo(mode: string) {
  return MODE_INFO[(mode in MODE_INFO ? mode : "minibus") as Mode];
}

export const STATION_KIND_INFO: Record<string, { label: string; am: string; icon?: string }> = {
  tera: { label: "Taxi stand", am: "ታክሲ ተራ" },
  lrt: { label: "Light-rail station", am: "የባቡር ጣቢያ" },
  intercity: { label: "Bus station", am: "መናኸሪያ" },
  bus_terminal: { label: "Bus terminal", am: "የአውቶቡስ ማቆሚያ" },
  bus_stop: { label: "Bus stop", am: "የአውቶቡስ ማቆሚያ" },
  bajaj_stand: { label: "Taxi & bajaj stand", am: "ታክሲ እና ባጃጅ ተራ" },
};

// ── Geometry ───────────────────────────────────────────────────────────
export type LatLng = { lat: number; lng: number };

export function haversineM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Street distance is ~35% longer than the straight line in Addis' grid-less network. */
export const ROAD_FACTOR = 1.35;
export const WALK_M_PER_MIN = 75;

export function walkMetersEstimate(a: LatLng, b: LatLng) {
  return haversineM(a, b) * ROAD_FACTOR;
}

/** More accurate road distance estimate accounting for Addis terrain and road network. */
export function roadDistanceKm(a: LatLng, b: LatLng): number {
  const direct = haversineM(a, b);
  // Short trips have more circuitous routes (more turns, one-way streets)
  const factor = direct < 500 ? 1.6 : direct < 2000 ? 1.4 : direct < 5000 ? 1.35 : 1.3;
  return (direct * factor) / 1000;
}

export function walkMinutes(meters: number) {
  return Math.max(1, Math.round(meters / WALK_M_PER_MIN));
}

// ── Time of day (Addis Ababa = UTC+3, no DST) ──────────────────────────
export function addisHour(date: Date): number {
  const utc = date.getUTCHours() + date.getUTCMinutes() / 60;
  return (utc + 3) % 24;
}

export type TrafficPeriod = "morning_peak" | "midday" | "evening_peak" | "evening" | "night";

export function trafficPeriod(hour: number): TrafficPeriod {
  if (hour >= 6.5 && hour < 9.5) return "morning_peak";
  if (hour >= 9.5 && hour < 16.5) return "midday";
  if (hour >= 16.5 && hour < 19.75) return "evening_peak";
  if (hour >= 19.75 && hour < 22) return "evening";
  return "night";
}

export const PERIOD_INFO: Record<TrafficPeriod, { label: string; factor: number; queue: number; note: string }> = {
  morning_peak: { label: "Morning rush", factor: 0.6, queue: 1.7, note: "Heavy traffic and long queues at big teras until about 9:30." },
  midday: { label: "Midday", factor: 0.82, queue: 1, note: "Normal traffic. Minibuses fill steadily." },
  evening_peak: { label: "Evening rush", factor: 0.56, queue: 1.9, note: "The heaviest period — expect long lines at Megenagna, Piassa, Meskel and Mexico." },
  evening: { label: "Evening", factor: 0.95, queue: 1.4, note: "Roads clear but fewer minibuses run; fares can be higher after 8pm." },
  night: { label: "Night", factor: 1.1, queue: 2.4, note: "Very limited service. Light rail is closed after 10pm — consider a ride-hailing taxi." },
};

const BASE_SPEED_KMH: Record<Mode, number> = {
  minibus: 25,
  city_bus: 19,
  train: 27,
  bajaj: 20,
  intercity_bus: 48,
};

/** In-vehicle minutes for a road distance at a given hour. */
export function rideMinutes(mode: Mode, km: number, hour: number): number {
  const period = trafficPeriod(hour);
  let factor = mode === "train" ? 1 : PERIOD_INFO[period].factor;
  if (mode === "intercity_bus") factor = Math.sqrt(factor); // most of the trip is outside city traffic
  // Very short trips (< 1km) are slower due to loading/unloading
  const shortTripPenalty = km < 1 ? 3 : km < 2 ? 1.5 : 0;
  const speed = BASE_SPEED_KMH[mode] * factor;
  const dwell = mode === "train" ? 0 : mode === "city_bus" ? 0.35 * km : 0.1 * km; // stops for passengers
  // Transfer time between vehicles
  const boardTime = 0.5; // boarding time
  return Math.max(2, Math.round((km / speed) * 60 + dwell + shortTripPenalty + boardTime));
}

export function isServiceRunning(mode: Mode, hour: number) {
  const [start, end] = MODE_INFO[mode].hours;
  return hour >= start && hour < end;
}

/** Expected minutes from arriving at the stop to departing. */
export function expectedWait(
  mode: Mode,
  popularity: number,
  hour: number,
  opts: { midRoute: boolean; liveWait?: number | null },
): number {
  const period = trafficPeriod(hour);
  const queue = PERIOD_INFO[period].queue;
  let base: number;
  switch (mode) {
    case "train":
      base = period === "morning_peak" || period === "evening_peak" ? 5 : 7;
      break;
    case "city_bus":
      base = 14 - popularity * 1.2;
      break;
    case "bajaj":
      base = 4;
      break;
    case "intercity_bus":
      base = 25;
      break;
    default: {
      const byPop = [18, 13, 9, 6, 4];
      base = byPop[Math.min(4, Math.max(0, popularity - 1))];
      if (opts.midRoute) base = base * 1.4 + 4; // flagging a passing, often full, minibus
    }
  }
  let wait = mode === "train" ? base : base * (mode === "minibus" ? queue : Math.sqrt(queue));
  if (opts.liveWait !== null && opts.liveWait !== undefined && !opts.midRoute) {
    wait = wait * 0.3 + opts.liveWait * 0.7;
  }
  return Math.max(1, Math.round(wait));
}

// ── Fares (birr) ───────────────────────────────────────────────────────
export function fareFor(mode: Mode, km: number, hour = 12): { min: number; max: number } {
  const late = hour >= 20 || hour < 6;
  switch (mode) {
    case "minibus": {
      const bands: Array<[number, number]> = [
        [2.5, 10],
        [5, 15],
        [8, 20],
        [11, 25],
        [14, 30],
        [17, 35],
        [20, 40],
      ];
      let fare = 40 + 5 * Math.ceil(Math.max(0, km - 20) / 4);
      for (const [limit, price] of bands) {
        if (km <= limit) {
          fare = price;
          break;
        }
      }
      return { min: fare, max: fare + (late ? 10 : km > 8 ? 5 : 0) };
    }
    case "city_bus": {
      const fare = km <= 6 ? 6 : km <= 12 ? 10 : km <= 20 ? 15 : 20;
      return { min: fare, max: fare };
    }
    case "train": {
      const fare = km <= 6 ? 10 : km <= 12 ? 15 : 20;
      return { min: fare, max: fare };
    }
    case "bajaj": {
      const fare = Math.min(60, 15 + 5 * Math.ceil(Math.max(0, km - 2) / 1.5));
      return { min: fare, max: fare + 5 };
    }
    case "intercity_bus": {
      const fare = Math.round((20 + km * 2.1) / 5) * 5;
      return { min: fare, max: Math.round((fare * 1.15) / 5) * 5 };
    }
  }
}

/** Ride-hailing (RIDE, Feres, ZayRide) estimate for comparison. */
export function rideHailFare(km: number) {
  const min = Math.round((90 + km * 26) / 10) * 10;
  return { min, max: Math.round((min * 1.3) / 10) * 10 };
}

export function crowdFromWait(wait: number): "empty" | "moderate" | "packed" | "overflowing" {
  if (wait <= 5) return "empty";
  if (wait <= 14) return "moderate";
  if (wait <= 28) return "packed";
  return "overflowing";
}
