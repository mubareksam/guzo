import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { shapes } from "@/db/schema";
import type { LatLng } from "@/lib/transit";

export type Shape = { coords: Array<[number, number]>; distanceM: number; durationS: number };
export type Profile = "driving" | "foot";

const memory = new Map<string, Shape | null>();
const ENDPOINTS: Record<Profile, string[]> = {
  driving: [
    "https://router.project-osrm.org/route/v1/driving",
    "https://routing.openstreetmap.de/routed-car/route/v1/driving",
  ],
  foot: ["https://routing.openstreetmap.de/routed-foot/route/v1/foot"],
};

export function shapeKey(profile: Profile, points: LatLng[]) {
  return `${profile}:${points.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join(";")}`;
}

async function fetchOsrm(profile: Profile, points: LatLng[], timeoutMs: number): Promise<Shape | null> {
  const coords = points.map((p) => `${p.lng.toFixed(6)},${p.lat.toFixed(6)}`).join(";");
  for (const base of ENDPOINTS[profile]) {
    try {
      const response = await fetch(`${base}/${coords}?overview=full&geometries=geojson&continue_straight=false`, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { "User-Agent": "Guzo/1.0 (Addis Ababa transit map)" },
        cache: "no-store",
      });
      if (!response.ok) continue;
      const data = (await response.json()) as {
        code: string;
        routes?: Array<{ distance: number; duration: number; geometry: { coordinates: Array<[number, number]> } }>;
      };
      const route = data.routes?.[0];
      if (data.code !== "Ok" || !route) continue;
      const line = route.geometry.coordinates;
      // Thin very dense geometries to keep payloads small.
      const step = line.length > 600 ? Math.ceil(line.length / 600) : 1;
      const thinned = line.filter((_, i) => i % step === 0 || i === line.length - 1).map(([lng, lat]) => [
        Number(lat.toFixed(5)),
        Number(lng.toFixed(5)),
      ]) as Array<[number, number]>;
      return { coords: thinned, distanceM: route.distance, durationS: route.duration };
    } catch {
      // try next endpoint
    }
  }
  return null;
}

/** Batch-resolve shapes: memory → database → OSRM (with concurrency and a total time budget). */
export async function getShapes(
  requests: Array<{ profile: Profile; points: LatLng[] }>,
  opts: { budgetMs?: number; concurrency?: number } = {},
): Promise<Map<string, Shape | null>> {
  const result = new Map<string, Shape | null>();
  const pending = new Map<string, { profile: Profile; points: LatLng[] }>();
  for (const request of requests) {
    if (request.points.length < 2) continue;
    const key = shapeKey(request.profile, request.points);
    if (memory.has(key)) result.set(key, memory.get(key) ?? null);
    else pending.set(key, request);
  }
  if (pending.size === 0) return result;

  try {
    const rows = await db.select().from(shapes).where(inArray(shapes.key, Array.from(pending.keys())));
    for (const row of rows) {
      const shape = { coords: row.coords, distanceM: row.distanceM, durationS: row.durationS };
      memory.set(row.key, shape);
      result.set(row.key, shape);
      pending.delete(row.key);
    }
  } catch {
    // cache table unavailable — fall through to network
  }

  const deadline = Date.now() + (opts.budgetMs ?? 6000);
  const queue = Array.from(pending.entries());
  const concurrency = opts.concurrency ?? 6;

  async function worker() {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) return;
      const [key, request] = next;
      const remaining = deadline - Date.now();
      if (remaining < 400) {
        result.set(key, null);
        continue;
      }
      const shape = await fetchOsrm(request.profile, request.points, Math.min(4500, remaining));
      result.set(key, shape);
      if (shape) {
        memory.set(key, shape);
        db.insert(shapes)
          .values({ key, coords: shape.coords, distanceM: shape.distanceM, durationS: shape.durationS })
          .onConflictDoNothing()
          .catch(() => undefined);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  return result;
}

export async function getShape(profile: Profile, points: LatLng[], budgetMs = 5000) {
  const map = await getShapes([{ profile, points }], { budgetMs, concurrency: 1 });
  return map.get(shapeKey(profile, points)) ?? null;
}
