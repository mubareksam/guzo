import { getNetwork } from "@/lib/data";
import { describeLocation, searchPlaces } from "@/lib/geocode";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    if (searchParams.has("lat") && Number.isFinite(lat) && Number.isFinite(lng)) {
      return Response.json({ location: describeLocation({ lat, lng }) });
    }
    const query = (searchParams.get("q") ?? "").slice(0, 80);
    const { raw } = await getNetwork();
    const hits = await searchPlaces(query, raw, { osm: searchParams.get("osm") !== "0" });
    return Response.json({ hits });
  } catch (error) {
    console.error("[api/places] Error:", error);
    return Response.json({ hits: [], error: "Search temporarily unavailable" }, { status: 500 });
  }
}
