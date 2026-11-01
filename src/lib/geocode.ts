import { places } from "@/db/data/places";
import { haversineM, type LatLng } from "@/lib/transit";

export type PlaceHit = {
  id: string;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
  kind: "area" | "station" | "landmark";
  stationId?: number;
};

type StationLite = { id: number; name: string; nameAm: string | null; area: string; landmark: string | null; lat: number; lng: number; kind: string };

const VIEWBOX = "38.62,9.13,38.95,8.82"; // west,north,east,south — greater Addis Ababa
const cache = new Map<string, { at: number; hits: PlaceHit[] }>();
let lastNominatim = 0;

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`.,()\-–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 9;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function score(query: string, candidates: string[]): number {
  let best = 0;
  for (const raw of candidates) {
    const c = normalize(raw);
    if (!c) continue;
    if (c === query) best = Math.max(best, 100);
    else if (c.startsWith(query)) best = Math.max(best, 85 - Math.min(20, c.length - query.length));
    else if (c.split(" ").some((w) => w.startsWith(query))) best = Math.max(best, 70);
    else if (c.includes(query)) best = Math.max(best, 55);
    else if (query.length >= 4) {
      const d = editDistance(query, c.slice(0, query.length + 1));
      if (d <= (query.length > 6 ? 2 : 1)) best = Math.max(best, 45 - d * 5);
    }
  }
  return best;
}

export function searchLocal(query: string, stations: StationLite[], limit = 8): PlaceHit[] {
  const q = normalize(query);
  const hits: Array<PlaceHit & { s: number }> = [];
  if (!q) {
    for (const key of ["megenagna", "piassa", "meskel", "bole_medhanialem", "mexico", "merkato", "saris", "ayat", "bole_airport", "arat_kilo"]) {
      const p = places[key];
      hits.push({ id: `area:${key}`, label: p.name, sublabel: `${p.am} · ${p.area}`, lat: p.lat, lng: p.lng, kind: "area", s: 1 });
    }
    return hits.slice(0, limit);
  }
  for (const [key, p] of Object.entries(places)) {
    const s = score(q, [p.name, p.am, ...(p.aliases ?? [])]);
    if (s > 0) hits.push({ id: `area:${key}`, label: p.name, sublabel: `${p.am} · ${p.area}`, lat: p.lat, lng: p.lng, kind: "area", s: s + 4 });
  }
  for (const st of stations) {
    const s = score(q, [st.name, st.nameAm ?? "", st.area, st.landmark ?? ""]);
    if (s > 0)
      hits.push({
        id: `station:${st.id}`,
        label: st.name,
        sublabel: st.landmark ? st.landmark.split(". ")[0] : st.area,
        lat: st.lat,
        lng: st.lng,
        kind: "station",
        stationId: st.id,
        s,
      });
  }
  hits.sort((a, b) => b.s - a.s);
  return hits.slice(0, limit).map(({ s: _s, ...rest }) => {
    void _s;
    return rest;
  });
}

export async function searchOsm(query: string, limit = 6): Promise<PlaceHit[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const key = normalize(q);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < 24 * 3600_000) return cached.hits;

  // Respect the Nominatim usage policy (max ~1 request / second)
  const waitMs = lastNominatim + 1000 - Date.now();
  if (waitMs > 0) await new Promise((r) => setTimeout(r, Math.min(waitMs, 1000)));
  lastNominatim = Date.now();

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&addressdetails=1&limit=${limit}&viewbox=${VIEWBOX}&bounded=1&accept-language=en`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Guzo/1.0 (Addis Ababa transit map; team@guzo.et)" },
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as Array<{
      place_id: number;
      lat: string;
      lon: string;
      name: string;
      display_name: string;
      type: string;
      address?: Record<string, string>;
    }>;
    const hits: PlaceHit[] = data.map((row) => {
      const addr = row.address ?? {};
      const area = addr.suburb ?? addr.neighbourhood ?? addr.city_district ?? addr.county ?? "Addis Ababa";
      return {
        id: `osm:${row.place_id}`,
        label: row.name || row.display_name.split(",")[0],
        sublabel: `${row.type.replace(/_/g, " ")} · ${area}`,
        lat: Number(row.lat),
        lng: Number(row.lon),
        kind: "landmark" as const,
      };
    });
    cache.set(key, { at: Date.now(), hits });
    return hits;
  } catch {
    return [];
  }
}

export async function searchPlaces(query: string, stations: StationLite[], opts: { osm?: boolean } = {}) {
  const local = searchLocal(query, stations, 8);
  const strongLocal = local.length > 0 && normalize(local[0].label).startsWith(normalize(query));
  const osm = opts.osm !== false && query.trim().length >= 3 && (!strongLocal || local.length < 4) ? await searchOsm(query) : [];
  const merged = [...local];
  for (const hit of osm) {
    if (!merged.some((m) => haversineM(m, hit) < 120 && normalize(m.label) === normalize(hit.label))) merged.push(hit);
  }
  return merged.slice(0, 10);
}

export async function resolvePlaceQuery(query: string, stations: StationLite[]): Promise<PlaceHit | null> {
  const hits = await searchPlaces(query, stations);
  return hits[0] ?? null;
}

/** Human description of a coordinate, e.g. "near Megenagna". */
export function describeLocation(point: LatLng): { label: string; nearest: string; meters: number } {
  let best = { key: "", d: Infinity };
  for (const [key, p] of Object.entries(places)) {
    const d = haversineM(point, p);
    if (d < best.d) best = { key, d };
  }
  const p = places[best.key];
  return {
    label: best.d < 350 ? `At ${p.name}` : `Near ${p.name}`,
    nearest: p.name,
    meters: Math.round(best.d),
  };
}
