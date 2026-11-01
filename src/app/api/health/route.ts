import { db, ensureReady } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { warmLineShapes } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureReady();
    await db.execute(sql`select 1`);
    try {
      await ensureSeeded();
      void warmLineShapes();
    } catch {
      // seeding is best-effort; the healthcheck only needs the database
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
