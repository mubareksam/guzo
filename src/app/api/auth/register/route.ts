import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { bootstrap } from "@/lib/data";
import { hashPassword } from "@/lib/crypto";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await bootstrap();
  let body: { name?: string; email?: string; password?: string; homeArea?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const homeArea = (body.homeArea ?? "").trim() || null;

  if (name.length < 2) return NextResponse.json({ error: "Tell us your name (at least 2 characters)." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return NextResponse.json({ error: "That email is already registered. Try logging in." }, { status: 409 });

  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password), homeArea })
    .returning({ id: users.id, name: users.name, email: users.email, points: users.points });

  const { token } = await createSession(created.id);
  const response = NextResponse.json({ ok: true, user: created });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
