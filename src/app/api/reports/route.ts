import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reports, stations } from "@/db/schema";
import { awardPoints, getCurrentUser } from "@/lib/auth";
import { bootstrap } from "@/lib/data";

export const dynamic = "force-dynamic";

const CROWDS = new Set(["empty", "moderate", "packed", "overflowing"]);
const MODES = new Set(["minibus", "city_bus", "train", "taxi", "bajaj", "walk"]);

export async function POST(request: Request) {
  await bootstrap();
  let body: {
    stationId?: number;
    crowd?: string;
    waitMinutes?: number;
    mode?: string;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const stationId = Number(body.stationId);
  if (!Number.isInteger(stationId) || stationId <= 0) {
    return Response.json({ error: "Choose the station you are reporting on." }, { status: 400 });
  }
  const [station] = await db.select({ id: stations.id }).from(stations).where(eq(stations.id, stationId)).limit(1);
  if (!station) return Response.json({ error: "That station no longer exists." }, { status: 404 });

  const crowd = CROWDS.has(body.crowd ?? "") ? (body.crowd as string) : "moderate";
  const waitMinutes = Math.max(0, Math.min(180, Math.round(Number(body.waitMinutes ?? 10))));
  if (!Number.isFinite(waitMinutes)) {
    return Response.json({ error: "Wait time must be a number of minutes." }, { status: 400 });
  }
  const mode = MODES.has(body.mode ?? "") ? (body.mode as string) : null;
  const note = (body.note ?? "").trim().slice(0, 400) || null;

  const user = await getCurrentUser();

  const [created] = await db
    .insert(reports)
    .values({ stationId, userId: user?.id ?? null, crowd, waitMinutes, mode, note })
    .returning({ id: reports.id });

  if (user) await awardPoints(user.id, 2);

  return Response.json({
    ok: true,
    id: created.id,
    awarded: user ? 2 : 0,
    message: user
      ? "Report saved — +2 points. Your update is live for the next 3 hours."
      : "Report saved. Log in next time to earn points for keeping the map fresh.",
  });
}
