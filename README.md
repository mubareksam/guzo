# Guzo — ጉዞ · Addis Ababa transit planner

**Guzo** (Amharic ጉዞ, "journey") maps every taxi stand (*tera*), light-rail platform and bus station in Addis Ababa and plans
door-to-door trips across **minibus taxis, Anbessa/Sheger city buses, the Addis Light Rail, bajajs and intercity buses**.

Developed by **Qmer**.

## Highlights

- **Two ways to start** — allow location access *or* type any place (areas, landmarks, malls, churches, stations, Amharic names; typo tolerant), or tap the map.
- **Real journey planner** (`src/lib/planner.ts`) — round-based search (RAPTOR-style) over 180+ lines with ordered stops:
  - walk to any stand or roadside stop, board, **drop at any stop the line passes** (not only termini), up to **2 transfers**;
  - time-of-day traffic model (morning/evening rush, midday, evening, night) and service hours (LRT closes at 22:00, bajajs barred from the centre);
  - queue model blended with **live rider reports** (recency-weighted), mid-route boarding penalty for full minibuses in rush hour;
  - generalized cost with walking, transfer and fare weights plus **route popularity** ("where most taxis go");
  - Pareto filtering, then tags: Recommended, Fastest, Cheapest, Fewest transfers, Least walking, Most used route, Skips traffic.
- **Road-snapped lines** — every walk and ride leg is routed on OpenStreetMap streets via OSRM, cached in Postgres (`shapes` table); times and distance-based fares are recomputed from the real road length.
- **Rider-grade instructions** — which stand (by landmark when a junction has several), the destination the redat calls (English + Amharic), stops passed, where to get off (“ወራጅ አለ”), wait, fare, crowd level, arrival in both 24h and Ethiopian clock.
- **Closest stations** with their modes and a street-level walking route + Google Maps hand-off.
- **Station pages** styled like transit signs: modes that depart (solid) vs pass by (dashed), every departure with its stop sequence, passing lines, road-snapped line map, queue history, report form.
- Ride-hailing (RIDE / Feres / ZayRide) comparison, riding guide with fares, signs and Amharic phrases.
- Community: queue reports, contributions (new/moved station, route, fare, correction), moderator desk that publishes approved stations to the map, points, badges, leaderboard, feedback board.
- Responsive app shell: desktop split view, mobile bottom tab bar, installable PWA.

## Demo accounts (password `guzo1234`)

`demo@guzo.et` (rider) · `admin@guzo.et` (moderator) · `sara@guzo.et`, `dawit@guzo.et`

## Data

- `src/db/data/places.ts` — ~95 named places with Amharic names, aliases and coordinates cross-checked against OpenStreetMap/Nominatim.
- `src/db/data/network.ts` — 65 stations (multiple stands per big junction, each with a landmark description) and compact line definitions; the seeder expands return directions automatically.
- Seeding is versioned (`SEED_VERSION` in `src/db/seed.ts`) and runs on first request / `GET /api/health`.

## Stack

Next.js 16 (App Router) · PostgreSQL + Drizzle ORM · Tailwind CSS v4 · Leaflet / react-leaflet (OpenStreetMap tiles, no API key) · OSRM routing · Nominatim geocoding · lucide icons.
No paid APIs or keys.

## Run locally

```bash
npm install
echo "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db" > .env
npx drizzle-kit push --config=drizzle.config.json
npm run dev
```

## API

| Endpoint | Purpose |
| --- | --- |
| `POST /api/plan` | `{origin:{lat,lng,label}|{query}, destination:…, departAt?, priority?: best|fastest|cheapest|less_walking, modes?: []}` |
| `GET /api/places?q=` · `?lat=&lng=` | Place search (local + OSM) · reverse description |
| `GET /api/shape?profile=foot|driving&points=lat,lng;lat,lng` | Street geometry |
| `POST /api/reports` · `/api/contributions` · `/api/feedback` | Community input |
| `POST /api/admin/contributions` | Moderator approve / reject |
| `GET /api/health` | DB check, seed, background shape warm-up |

## Free hosting

Neon (free Postgres) + Vercel Hobby: import the repo, set `DATABASE_URL`, run `npx drizzle-kit push` once, deploy.

Fares, waits and stand positions are community estimates, not official data.
