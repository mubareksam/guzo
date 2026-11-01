import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contributions, stations } from "@/db/schema";
import { awardPoints, getCurrentUser } from "@/lib/auth";
import { invalidateNetwork } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return Response.json({ error: "Moderator access required." }, { status: 403 });

  let body: { id?: number; action?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const id = Number(body.id);
  const action = body.action === "approve" ? "approved" : body.action === "reject" ? "rejected" : null;
  if (!Number.isInteger(id) || !action) return Response.json({ error: "Missing id or action." }, { status: 400 });

  const [item] = await db.select().from(contributions).where(eq(contributions.id, id)).limit(1);
  if (!item) return Response.json({ error: "Contribution not found." }, { status: 404 });
  if (item.status !== "pending") return Response.json({ error: "Already reviewed." }, { status: 409 });

  await db.update(contributions).set({ status: action }).where(eq(contributions.id, id));

  let created: number | null = null;
  if (action === "approved") {
    if (item.userId) await awardPoints(item.userId, 15);
    if (item.type === "new_station" && item.lat !== null && item.lng !== null) {
      const [row] = await db
        .insert(stations)
        .values({
          name: item.stationName,
          area: item.area ?? "Addis Ababa",
          lat: item.lat,
          lng: item.lng,
          kind: "tera",
          landmark: item.details.slice(0, 220),
          description: item.details,
          verified: true,
          createdBy: item.userId,
        })
        .returning({ id: stations.id });
      created = row.id;
    }
    if (item.type === "moved_station" && item.lat !== null && item.lng !== null) {
      await db
        .update(stations)
        .set({ lat: item.lat, lng: item.lng, verified: true })
        .where(eq(stations.name, item.stationName));
    }
    invalidateNetwork();
  }

  return Response.json({ ok: true, status: action, stationId: created });
}
