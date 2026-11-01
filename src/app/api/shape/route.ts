import { getShape } from "@/lib/osrm";

export const dynamic = "force-dynamic";

/** GET /api/shape?profile=foot&points=lat,lng;lat,lng — street geometry for walking/driving. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profile = searchParams.get("profile") === "driving" ? "driving" : "foot";
  const points = (searchParams.get("points") ?? "")
    .split(";")
    .map((pair) => pair.split(",").map(Number))
    .filter((p) => p.length === 2 && p.every(Number.isFinite))
    .slice(0, 25)
    .map(([lat, lng]) => ({ lat, lng }));
  if (points.length < 2) return Response.json({ error: "Need at least two points" }, { status: 400 });
  const shape = await getShape(profile, points, 6000);
  if (!shape) {
    return Response.json({ coords: points.map((p) => [p.lat, p.lng]), distanceM: null, durationS: null, snapped: false });
  }
  return Response.json({ ...shape, snapped: true });
}
