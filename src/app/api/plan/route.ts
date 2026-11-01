import { getNetwork, getWaitInfo } from "@/lib/data";
import { describeLocation, resolvePlaceQuery } from "@/lib/geocode";
import { getShapes, shapeKey, type Profile } from "@/lib/osrm";
import { finalizeOption, planJourney, retag, type Priority, type TripOption } from "@/lib/planner";
import { addisHour, fareFor, MODES, rideMinutes, walkMinutes, type Mode } from "@/lib/transit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type PointInput = { lat?: unknown; lng?: unknown; label?: unknown; query?: unknown };

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

async function resolvePoint(input: PointInput | undefined, stations: Parameters<typeof resolvePlaceQuery>[1]) {
  if (!input) return null;
  const lat = num(input.lat);
  const lng = num(input.lng);
  const label = typeof input.label === "string" && input.label.trim() ? input.label.trim().slice(0, 80) : null;
  if (lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
    return { lat, lng, label: label ?? describeLocation({ lat, lng }).label };
  }
  if (typeof input.query === "string" && input.query.trim()) {
    const hit = await resolvePlaceQuery(input.query, stations);
    if (hit) return { lat: hit.lat, lng: hit.lng, label: hit.label };
  }
  return null;
}

/** Replace straight segments with real street geometry and refine times from road distance. */
async function snapToRoads(options: TripOption[], hour: number, priority: Priority) {
  const requests: Array<{ profile: Profile; points: Array<{ lat: number; lng: number }> }> = [];
  for (const option of options) {
    for (const leg of option.legs) {
      if (leg.kind === "walk") {
        if (leg.meters >= 60 && leg.meters <= 4500) requests.push({ profile: "foot", points: [leg.from, leg.to] });
      } else {
        const pts = (leg.stopsPassed ?? []).map((s) => ({ lat: s.lat, lng: s.lng }));
        if (pts.length >= 2) requests.push({ profile: "driving", points: pts });
      }
    }
  }
  const shapes = await getShapes(requests, { budgetMs: 7000, concurrency: 6 });

  return options.map((option) => {
    for (const leg of option.legs) {
      if (leg.kind === "walk") {
        const shape = shapes.get(shapeKey("foot", [leg.from, leg.to]));
        if (shape && shape.distanceM < leg.meters * 2.2 + 150) {
          leg.path = shape.coords;
          leg.meters = Math.round(shape.distanceM);
          leg.minutes = walkMinutes(shape.distanceM);
          leg.roadSnapped = true;
        }
      } else {
        const pts = (leg.stopsPassed ?? []).map((s) => ({ lat: s.lat, lng: s.lng }));
        const shape = shapes.get(shapeKey("driving", pts));
        if (shape) {
          leg.path = shape.coords;
          leg.roadSnapped = true;
          const km = shape.distanceM / 1000;
          if (km > 0.2 && km < (leg.km ?? 1) * 2.5 + 2) {
            leg.km = Number(km.toFixed(1));
            leg.meters = Math.round(shape.distanceM);
            leg.minutes = rideMinutes(leg.mode as Mode, km, hour);
            leg.fare = fareFor(leg.mode as Mode, km, hour);
          }
        }
      }
    }
    const refreshed = finalizeOption(option.legs, priority, hour);
    return { ...refreshed, kind: option.kind, warnings: option.warnings };
  });
}

export async function POST(request: Request) {
  let body: {
    origin?: PointInput;
    destination?: PointInput;
    departAt?: string;
    priority?: string;
    modes?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const network = await getNetwork();
  const [origin, destination] = await Promise.all([
    resolvePoint(body.origin, network.raw),
    resolvePoint(body.destination, network.raw),
  ]);
  if (!origin) return Response.json({ error: "We could not find your starting point. Share your location or type a place in Addis Ababa." }, { status: 400 });
  if (!destination) return Response.json({ error: "We could not find that destination in Addis Ababa. Try a landmark, area or station name." }, { status: 400 });

  const departAt = body.departAt && !Number.isNaN(Date.parse(body.departAt)) ? new Date(body.departAt) : new Date();
  const priority: Priority = ["best", "fastest", "cheapest", "less_walking"].includes(body.priority ?? "")
    ? (body.priority as Priority)
    : "best";
  const modes = (body.modes ?? []).filter((m): m is Mode => (MODES as string[]).includes(m));

  const waits = await getWaitInfo();
  const result = planJourney({
    origin,
    destination,
    lines: network.lines,
    stations: network.stations,
    waits,
    departAt,
    priority,
    modes,
  });

  const hour = addisHour(departAt);
  let options = await snapToRoads(result.options, hour, priority);
  options = options.sort((a, b) => a.cost - b.cost);
  retag(options);

  return Response.json({
    ok: true,
    origin,
    destination,
    departAt: departAt.toISOString(),
    priority,
    generatedAt: new Date().toISOString(),
    ...result,
    options,
  });
}
