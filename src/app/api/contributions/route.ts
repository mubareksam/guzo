import { db } from "@/db";
import { contributions } from "@/db/schema";
import { awardPoints, getCurrentUser } from "@/lib/auth";
import { bootstrap } from "@/lib/data";

export const dynamic = "force-dynamic";

const TYPES = new Set(["new_station", "moved_station", "route", "fare", "correction"]);

export async function POST(request: Request) {
  await bootstrap();
  let body: {
    type?: string;
    stationName?: string;
    area?: string;
    lat?: number | string;
    lng?: number | string;
    details?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const type = TYPES.has(body.type ?? "") ? (body.type as string) : "new_station";
  const stationName = (body.stationName ?? "").trim().slice(0, 90);
  const area = (body.area ?? "").trim().slice(0, 60) || null;
  const details = (body.details ?? "").trim().slice(0, 900);

  if (stationName.length < 2) return Response.json({ error: "Add the station name." }, { status: 400 });
  if (details.length < 10) return Response.json({ error: "Please describe the update in at least 10 characters." }, { status: 400 });

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  const user = await getCurrentUser();

  const [created] = await db
    .insert(contributions)
    .values({
      userId: user?.id ?? null,
      type,
      stationName,
      area,
      lat: hasCoords ? lat : null,
      lng: hasCoords ? lng : null,
      details,
      status: "pending",
    })
    .returning({ id: contributions.id });

  if (user) await awardPoints(user.id, 12);

  return Response.json({
    ok: true,
    id: created.id,
    awarded: user ? 12 : 0,
    message: user
      ? "Thank you! Your contribution is queued for review — +12 points added."
      : "Thank you! Your contribution is queued for review. Log in next time to earn points.",
  });
}
