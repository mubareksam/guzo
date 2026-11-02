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
type PlaceEntry = { name: string; am: string; lat: number; lng: number; area: string; aliases?: string[] };

const VIEWBOX = "38.62,9.13,38.95,8.82"; // west,north,east,south — greater Addis Ababa
const cache = new Map<string, { at: number; hits: PlaceHit[] }>();
let lastNominatim = 0;

// ── Search index for fast lookup ──────────────────────────────────────
type IndexedPlace = { key: string; name: string; am: string; area: string; lat: number; lng: number; tokens: Set<string> };
let placeIndex: IndexedPlace[] | null = null;

function buildIndex(): IndexedPlace[] {
  if (placeIndex) return placeIndex;
  placeIndex = [];
  for (const [key, p] of Object.entries(places)) {
    const text = normalize([p.name, p.am, ...(p.aliases ?? [])].join(" "));
    const tokens = new Set(text.split(/\s+/).filter(Boolean));
    placeIndex.push({ key, name: p.name, am: p.am, area: p.area, lat: p.lat, lng: p.lng, tokens });
  }
  return placeIndex;
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`.,()\-–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Common Ethiopian transport term aliases (Amharic → English). */
const TRANSPORT_ALIASES: Record<string, string> = {
  "መናሃሪያ": "terminal",
  "menahereya": "terminal",
  "menahriya": "terminal",
  "menehriya": "terminal",
  "ተራ": "tera",
  "ቴራ": "tera",
  "ማዞሪያ": "mazoria",
  "መናኸሪያ": "terminal",
  "ባስ": "bus",
  "ታክሲ": "taxi",
  "ባጃጅ": "bajaj",
  "ባቡር": "train",
  "ገበያ": "market",
  "አደባባይ": "square",
  "ሆስፒታል": "hospital",
  "ት/ቤት": "school",
  "ቤተ ክርስቲያን": "church",
  "መስጊድ": "mosque",
};

export function expandQuery(text: string): string[] {
  const q = normalize(text);
  const expanded = new Set<string>([q]);
  for (const [alias, canonical] of Object.entries(TRANSPORT_ALIASES)) {
    const normAlias = normalize(alias);
    if (q.includes(normAlias)) {
      expanded.add(q.replace(normAlias, canonical));
    }
    if (q.includes(canonical)) {
      expanded.add(q.replace(canonical, normAlias));
    }
  }
  return Array.from(expanded);
}

/** Fast token-match score. Returns 0 if no match. */
function fastScore(queryTokens: string[], placeTokens: Set<string>): number {
  if (queryTokens.length === 0) return 0;
  let matches = 0;
  let prefixMatches = 0;
  for (const qt of queryTokens) {
    if (placeTokens.has(qt)) {
      matches++;
      prefixMatches++;
    } else {
      for (const pt of placeTokens) {
        if (pt.startsWith(qt)) { prefixMatches += 0.7; break; }
        if (qt.length >= 3 && pt.length >= 3 && pt.includes(qt)) { prefixMatches += 0.4; break; }
      }
    }
  }
  const coverage = (matches + prefixMatches) / queryTokens.length;
  if (coverage < 0.3) return 0;
  // Boost exact and prefix matches
  const exactRatio = matches / queryTokens.length;
  return Math.round(coverage * 70 + exactRatio * 30);
}

export function searchLocal(query: string, stations: StationLite[], limit = 8): PlaceHit[] {
  const q = normalize(query);
  const queryVariations = q ? expandQuery(q) : [""];
  const queryTokenSets = queryVariations.map(v => v.split(/\s+/).filter(Boolean));
  const idx = buildIndex();

  if (!q) {
    const defaultKeys = ["megenagna", "piassa", "meskel", "bole_medhanialem", "mexico", "merkato", "saris", "ayat", "bole_airport", "arat_kilo"];
    const hits: PlaceHit[] = [];
    for (const key of defaultKeys) {
      const p = places[key as keyof typeof places];
      if (p) hits.push({ id: `area:${key}`, label: p.name, sublabel: `${p.am} · ${p.area}`, lat: p.lat, lng: p.lng, kind: "area" });
    }
    return hits.slice(0, limit);
  }

  const hits: Array<PlaceHit & { s: number }> = [];

  // Score places using token index (much faster than edit distance)
  for (const p of idx) {
    let bestScore = 0;
    for (const qt of queryTokenSets) {
      const s = fastScore(qt, p.tokens);
      if (s > bestScore) bestScore = s;
    }
    if (bestScore > 0) {
      hits.push({ id: `area:${p.key}`, label: p.name, sublabel: `${p.am} · ${p.area}`, lat: p.lat, lng: p.lng, kind: "area", s: bestScore + 4 });
    }
  }

  // Score stations
  for (const st of stations) {
    const text = normalize([st.name, st.nameAm ?? "", st.area, st.landmark ?? ""].join(" "));
    const tokens = new Set(text.split(/\s+/).filter(Boolean));
    let bestScore = 0;
    for (const qt of queryTokenSets) {
      const s = fastScore(qt, tokens);
      if (s > bestScore) bestScore = s;
    }
    if (bestScore > 0) {
      hits.push({
        id: `station:${st.id}`,
        label: st.name,
        sublabel: st.landmark ? st.landmark.split(". ")[0] : st.area,
        lat: st.lat,
        lng: st.lng,
        kind: "station",
        stationId: st.id,
        s: bestScore,
      });
    }
  }

  hits.sort((a, b) => b.s - a.s);
  return hits.slice(0, limit).map(({ s: _s, ...rest }) => { void _s; return rest; });
}

export async function searchOsm(query: string, limit = 6): Promise<PlaceHit[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const key = normalize(q);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < 24 * 3600_000) return cached.hits;

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

// ── Spatial index for describeLocation ────────────────────────────────
let nearestCache: Array<{ key: string; lat: number; lng: number }> | null = null;

function buildNearestIndex() {
  if (nearestCache) return nearestCache;
  nearestCache = Object.entries(places).map(([key, p]) => ({ key, lat: p.lat, lng: p.lng }));
  return nearestCache;
}

/** Human description of a coordinate, e.g. "near Megenagna". */
export function describeLocation(point: LatLng): { label: string; nearest: string; meters: number } {
  const idx = buildNearestIndex();
  let best = { key: "", d: Infinity };
  for (const p of idx) {
    const d = haversineM(point, { lat: p.lat, lng: p.lng });
    if (d < best.d) best = { key: p.key, d };
  }
  const p = places[best.key as keyof typeof places];
  if (!p) return { label: "Addis Ababa", nearest: "Addis Ababa", meters: Math.round(best.d) };
  return {
    label: best.d < 350 ? `At ${p.name}` : `Near ${p.name}`,
    nearest: p.name,
    meters: Math.round(best.d),
  };
}
