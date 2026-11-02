import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { appMeta, contributions, feedback, reports, routes, stations, users, type LineStop } from "@/db/schema";
import { hashPassword } from "@/lib/crypto";
import { SCHEMA_SQL } from "@/db/bootstrap-sql";
import { places } from "@/db/data/places";
import { lineDefs, stationDefs, type StationDef } from "@/db/data/network";
import { fareFor, haversineM, ROAD_FACTOR, rideMinutes, type Mode } from "@/lib/transit";

export const SEED_VERSION = "network-v5";

let seedPromise: Promise<void> | null = null;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const demoUsers = [
  { name: "Dawit Bekele", email: "dawit@guzo.et", points: 320, homeArea: "Megenagna" },
  { name: "Abebe Kebede", email: "demo@guzo.et", points: 140, homeArea: "Piassa" },
  { name: "Sara Tesfaye", email: "sara@guzo.et", points: 96, homeArea: "Bole" },
  { name: "Hana Girma", email: "hana@guzo.et", points: 61, homeArea: "Saris" },
  { name: "Yonas Alemu", email: "yonas@guzo.et", points: 34, homeArea: "Kality" },
  { name: "Meron Haile", email: "meron@guzo.et", points: 18, homeArea: "Ayat" },
  { name: "Guzo Moderator", email: "admin@guzo.et", points: 0, homeArea: "Arat Kilo", isAdmin: true },
];

export type BuiltLine = {
  stationKey: string;
  mode: Mode;
  name: string | null;
  stops: LineStop[];
  popularity: number;
};

function stopFromStation(station: StationDef): LineStop {
  const place = places[station.place];
  return { key: station.place, name: place.name, am: place.am, lat: station.lat, lng: station.lng };
}

function stopFromPlace(key: string): LineStop {
  const place = places[key as keyof typeof places];
  return { key, name: place.name, am: place.am, lat: place.lat, lng: place.lng };
}

export function lineDistanceKm(stops: LineStop[]) {
  let total = 0;
  for (let i = 1; i < stops.length; i++) total += haversineM(stops[i - 1], stops[i]) * ROAD_FACTOR;
  return total / 1000;
}

/** Expand the compact line definitions into both directions with concrete stops. */
export function buildLines(): BuiltLine[] {
  const byKey = new Map(stationDefs.map((s) => [s.key, s]));
  const built: BuiltLine[] = [];
  const seen = new Set<string>();

  const push = (line: BuiltLine) => {
    const signature = `${line.stationKey}|${line.mode}|${line.stops.map((s) => s.key).join(">")}`;
    if (seen.has(signature)) return;
    seen.add(signature);
    built.push(line);
  };

  for (const [stationKey, mode, via, popularity, opts] of lineDefs) {
    const station = byKey.get(stationKey);
    if (!station) throw new Error(`Unknown station ${stationKey}`);
    for (const key of via) if (!(key in places)) throw new Error(`Unknown place ${key}`);
    const stops = [stopFromStation(station), ...via.map(stopFromPlace)];
    push({ stationKey, mode, name: opts?.name ?? null, stops, popularity });

    if (opts?.oneWay || mode === "intercity_bus") continue;
    const terminus = via[via.length - 1];
    const back =
      (opts?.back ? byKey.get(opts.back) : undefined) ??
      stationDefs.find(
        (s) => s.place === terminus && (mode === "train" ? s.kind === "lrt" : s.kind !== "lrt" && s.kind !== "intercity"),
      );
    if (!back) continue;
    const middle = via.slice(0, -1).reverse().map(stopFromPlace);
    const backStops = [stopFromStation(back), ...middle, stopFromStation(station)];
    push({ stationKey: back.key, mode, name: opts?.name ?? null, stops: backStops, popularity });
  }
  return built;
}

const reportSeeds: Array<{ station: string; crowd: string; wait: number; mode: string; note: string; minutesAgo: number; user?: string }> = [
  { station: "megenagna_east", crowd: "packed", wait: 22, mode: "minibus", note: "Long line for CMC and Ayat, extra minibuses arriving.", minutesAgo: 18, user: "demo@guzo.et" },
  { station: "megenagna_west", crowd: "moderate", wait: 10, mode: "minibus", note: "Arat Kilo minibuses loading fast.", minutesAgo: 35, user: "dawit@guzo.et" },
  { station: "lrt_stadium", crowd: "moderate", wait: 7, mode: "train", note: "Trains to Kality every 8 minutes.", minutesAgo: 24, user: "sara@guzo.et" },
  { station: "piassa_giorgis", crowd: "packed", wait: 18, mode: "minibus", note: "Bole line is the busiest queue right now.", minutesAgo: 42, user: "dawit@guzo.et" },
  { station: "saris", crowd: "moderate", wait: 11, mode: "minibus", note: "Kality line moving steadily.", minutesAgo: 61, user: "hana@guzo.et" },
  { station: "kality_bus", crowd: "overflowing", wait: 35, mode: "intercity_bus", note: "Adama buses full, expect a wait.", minutesAgo: 15, user: "yonas@guzo.et" },
  { station: "bole_edna", crowd: "empty", wait: 3, mode: "minibus", note: "Almost no queue, airport runs leaving immediately.", minutesAgo: 33 },
  { station: "mexico_west", crowd: "moderate", wait: 9, mode: "minibus", note: "Torhailoch minibuses every few minutes.", minutesAgo: 48 },
  { station: "merkato", crowd: "packed", wait: 20, mode: "minibus", note: "Market traffic, Kolfe line slow to load.", minutesAgo: 27, user: "meron@guzo.et" },
  { station: "ayat", crowd: "moderate", wait: 10, mode: "minibus", note: "Megenagna line loading normally.", minutesAgo: 90 },
  { station: "arat_kilo", crowd: "moderate", wait: 7, mode: "minibus", note: "Shiro Meda minibus leaves when full.", minutesAgo: 55 },
  { station: "autobus_tera", crowd: "packed", wait: 40, mode: "intercity_bus", note: "Ambo bus delayed, Burayu minibuses on time.", minutesAgo: 22, user: "demo@guzo.et" },
  { station: "jemo", crowd: "empty", wait: 5, mode: "bajaj", note: "Bajajs waiting at the gate.", minutesAgo: 110 },
  { station: "bole_airport", crowd: "moderate", wait: 12, mode: "minibus", note: "Arrivals rush, short wait for Megenagna minibuses.", minutesAgo: 12, user: "sara@guzo.et" },
  { station: "meskel_south", crowd: "packed", wait: 19, mode: "minibus", note: "Saris queue reaches the museum fence.", minutesAgo: 20, user: "hana@guzo.et" },
];

const contributionSeeds = [
  { email: "dawit@guzo.et", type: "new_station", stationName: "Ayat Zone 5 Tera", area: "Yeka", lat: 9.0352, lng: 38.8741, details: "New minibus stand beside the Ayat Zone 5 condominiums. Minibuses to Megenagna and CMC from 6am.", status: "approved" },
  { email: "demo@guzo.et", type: "moved_station", stationName: "Bole Tera — behind Edna Mall", area: "Bole", lat: 8.9971, lng: 38.788, details: "The stand moved about 150 m north after road works. The old spot is now parking.", status: "approved" },
  { email: "sara@guzo.et", type: "fare", stationName: "Megenagna Tera — Zefmesh side", area: "Yeka", lat: 9.0207, lng: 38.8031, details: "CMC minibus fare is now 15 birr, Ayat is 20 birr.", status: "pending" },
  { email: "hana@guzo.et", type: "correction", stationName: "Kality Bus Station (south)", area: "Akaki Kality", lat: 8.9078, lng: 38.7725, details: "Dukem highroof minibuses now leave from the second lane behind the main gate.", status: "pending" },
  { email: "yonas@guzo.et", type: "new_station", stationName: "Lebu Abo Tera", area: "Nifas Silk-Lafto", lat: 8.9521, lng: 38.7088, details: "Small bajaj and minibus stand on the Lebu road, serves Lafto and Jemo.", status: "pending" },
];

const feedbackSeeds = [
  { name: "Bethel A.", category: "suggestion", message: "Please show which stands stop running after 8pm and add a night mode for the map." },
  { name: "Natnael T.", category: "praise", message: "Used Guzo from Megenagna to Kality. It told me to drop at Meskel and take the train — saved 25 minutes." },
  { name: "Liya M.", category: "suggestion", message: "Could you add the yellow contract taxi ranks next to the minibus stands?" },
  { name: "Samuel G.", category: "bug", message: "The Ayat stand sometimes shows on the wrong side of the road." },
  { name: "Feven K.", category: "partnership", message: "We run a youth transport group in Kotebe and would like to help keep fares updated." },
];

async function seedNetwork(tx: Tx) {
  await tx.delete(reports);
  await tx.delete(routes);
  await tx.delete(stations);

  const inserted = await tx
    .insert(stations)
    .values(
      stationDefs.map((s) => ({
        key: s.key,
        name: s.name,
        nameAm: s.am,
        kind: s.kind,
        place: s.place,
        landmark: s.landmark,
        area: places[s.place].area,
        city: "Addis Ababa",
        lat: s.lat,
        lng: s.lng,
        description: s.landmark,
        verified: s.verified ?? false,
      })),
    )
    .returning({ id: stations.id, key: stations.key });
  const idByKey = new Map(inserted.map((row) => [row.key as string, row.id]));

  const lines = buildLines();
  await tx.insert(routes).values(
    lines.map((line) => {
      const km = lineDistanceKm(line.stops);
      const fare = fareFor(line.mode, km);
      const last = line.stops[line.stops.length - 1];
      return {
        stationId: idByKey.get(line.stationKey) as number,
        mode: line.mode,
        name: line.name,
        toLabel: last.name,
        toLabelAm: last.am,
        toLat: last.lat,
        toLng: last.lng,
        stops: line.stops,
        popularity: line.popularity,
        distanceKm: Number(km.toFixed(2)),
        fareMin: fare.min,
        fareMax: fare.max,
        durationMin: rideMinutes(line.mode, km, 12),
        notes: line.mode === "train" ? "Addis Ababa Light Rail" : null,
      };
    }),
  );

  const userRows = await tx.select({ id: users.id, email: users.email }).from(users);
  const userByEmail = new Map(userRows.map((u) => [u.email, u.id]));
  const now = Date.now();
  await tx.insert(reports).values(
    reportSeeds
      .filter((r) => idByKey.has(r.station))
      .map((r) => ({
        stationId: idByKey.get(r.station) as number,
        userId: r.user ? userByEmail.get(r.user) ?? null : null,
        crowd: r.crowd,
        waitMinutes: r.wait,
        mode: r.mode,
        note: r.note,
        createdAt: new Date(now - r.minutesAgo * 60_000),
      })),
  );
}

async function seed(tx: Tx) {
  const [meta] = await tx.select().from(appMeta).where(eq(appMeta.key, "seed_version")).limit(1);
  if (meta?.value === SEED_VERSION) return;

  const [{ count: userCount }] = await tx.select({ count: sql<number>`count(*)::int` }).from(users);
  if (userCount === 0) {
    const passwordHash = hashPassword("guzo1234");
    await tx.insert(users).values(
      demoUsers.map((u) => ({
        name: u.name,
        email: u.email,
        passwordHash,
        points: u.points,
        homeArea: u.homeArea,
        isAdmin: Boolean(u.isAdmin),
      })),
    );
  } else {
    // make sure a moderator account exists on upgraded databases
    await tx
      .insert(users)
      .values({ name: "Guzo Moderator", email: "admin@guzo.et", passwordHash: hashPassword("guzo1234"), isAdmin: true, homeArea: "Arat Kilo" })
      .onConflictDoNothing();
  }

  await seedNetwork(tx);

  const userRows = await tx.select({ id: users.id, email: users.email }).from(users);
  const userByEmail = new Map(userRows.map((u) => [u.email, u.id]));
  const now = Date.now();

  const [{ count: contribCount }] = await tx.select({ count: sql<number>`count(*)::int` }).from(contributions);
  if (contribCount === 0) {
    await tx.insert(contributions).values(
      contributionSeeds.map((c, i) => ({
        userId: userByEmail.get(c.email) ?? null,
        type: c.type,
        stationName: c.stationName,
        area: c.area,
        lat: c.lat,
        lng: c.lng,
        details: c.details,
        status: c.status,
        createdAt: new Date(now - (i + 1) * 5 * 3_600_000),
      })),
    );
  }

  const [{ count: feedbackCount }] = await tx.select({ count: sql<number>`count(*)::int` }).from(feedback);
  if (feedbackCount === 0) {
    await tx.insert(feedback).values(
      feedbackSeeds.map((f, i) => ({
        name: f.name,
        category: f.category,
        message: f.message,
        userId: userByEmail.get(demoUsers[i % demoUsers.length].email) ?? null,
        createdAt: new Date(now - (i + 1) * 9 * 3_600_000),
      })),
    );
  }

  await tx
    .insert(appMeta)
    .values({ key: "seed_version", value: SEED_VERSION })
    .onConflictDoUpdate({ target: appMeta.key, set: { value: SEED_VERSION } });
}

/** Idempotent, versioned seed guarded by a Postgres advisory lock. */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = db
      .transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(918273644)`);
        for (const statement of SCHEMA_SQL) await tx.execute(sql.raw(statement));
      })
      .then(() => db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(918273645)`);
        await seed(tx);
      }))
      .catch((error) => {
        seedPromise = null;
        throw error;
      });
  }
  return seedPromise;
}
