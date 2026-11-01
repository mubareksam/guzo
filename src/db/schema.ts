import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type LineStop = { key: string; name: string; am: string; lat: number; lng: number };

export const appMeta = pgTable("app_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

/** Cached road geometry from OSRM so lines are drawn on real streets. */
export const shapes = pgTable("shapes", {
  key: text("key").primaryKey(),
  coords: jsonb("coords").$type<Array<[number, number]>>().notNull(),
  distanceM: doublePrecision("distance_m").notNull(),
  durationS: doublePrecision("duration_s").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  points: integer("points").notNull().default(0),
  isAdmin: boolean("is_admin").notNull().default(false),
  homeArea: text("home_area"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

/** A "tera" — a taxi / minibus / bus stand. */
export const stations = pgTable(
  "stations",
  {
    id: serial("id").primaryKey(),
    key: text("key").unique(),
    name: text("name").notNull(),
    nameAm: text("name_am"),
    kind: text("kind").notNull().default("tera"), // tera | lrt | intercity | bus_terminal | bajaj_stand
    place: text("place"),
    landmark: text("landmark"),
    area: text("area").notNull(),
    city: text("city").notNull().default("Addis Ababa"),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    description: text("description"),
    status: text("status").notNull().default("active"), // active | pending | closed
    verified: boolean("verified").notNull().default(false),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("stations_area_idx").on(table.area)],
);

/** One departure leg that leaves a station and ends near `toLabel`. */
export const routes = pgTable(
  "routes",
  {
    id: serial("id").primaryKey(),
    stationId: integer("station_id")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    mode: text("mode").notNull().default("minibus"), // minibus | city_bus | train | bajaj | intercity_bus
    name: text("name"),
    toLabel: text("to_label").notNull(),
    toLabelAm: text("to_label_am"),
    stops: jsonb("stops").$type<LineStop[]>().notNull().default([]),
    popularity: integer("popularity").notNull().default(3),
    distanceKm: doublePrecision("distance_km").notNull().default(0),
    toLat: doublePrecision("to_lat").notNull(),
    toLng: doublePrecision("to_lng").notNull(),
    fareMin: integer("fare_min").notNull(),
    fareMax: integer("fare_max").notNull(),
    durationMin: integer("duration_min").notNull(),
    notes: text("notes"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("routes_station_idx").on(table.stationId)],
);

/** Live crowd + queue reports from riders. */
export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    stationId: integer("station_id")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    crowd: text("crowd").notNull().default("moderate"), // empty | moderate | packed | overflowing
    waitMinutes: integer("wait_minutes").notNull().default(10),
    mode: text("mode"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("reports_station_idx").on(table.stationId)],
);

/** Community contributions: new stations, moved stations, fare changes, corrections. */
export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  type: text("type").notNull().default("new_station"), // new_station | moved_station | route | fare | correction
  stationName: text("station_name").notNull(),
  area: text("area"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  details: text("details").notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name"),
  category: text("category").notNull().default("suggestion"), // suggestion | bug | praise | partnership
  message: text("message").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Station = typeof stations.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Contribution = typeof contributions.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
