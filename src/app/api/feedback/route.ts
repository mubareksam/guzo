import { db } from "@/db";
import { feedback } from "@/db/schema";
import { awardPoints, getCurrentUser } from "@/lib/auth";
import { bootstrap } from "@/lib/data";

export const dynamic = "force-dynamic";

const CATEGORIES = new Set(["suggestion", "bug", "praise", "partnership"]);

export async function POST(request: Request) {
  await bootstrap();
  let body: { name?: string; category?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const category = CATEGORIES.has(body.category ?? "") ? (body.category as string) : "suggestion";
  const message = (body.message ?? "").trim().slice(0, 1200);
  if (message.length < 5) return Response.json({ error: "Tell us a little more (at least 5 characters)." }, { status: 400 });

  const user = await getCurrentUser();
  const name = (body.name ?? "").trim().slice(0, 60) || user?.name || "Anonymous rider";

  await db.insert(feedback).values({ userId: user?.id ?? null, name, category, message });
  if (user) await awardPoints(user.id, 3);

  return Response.json({
    ok: true,
    message: user
      ? "Feedback received — +3 points. We read every suggestion."
      : "Feedback received. Log in next time to earn rider points.",
  });
}
