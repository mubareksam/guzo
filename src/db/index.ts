import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";

// ── PGlite: full PostgreSQL running in-process via WASM ──────────────
// In serverless environments (Vercel), use in-memory mode
// In development, can persist to local directory if needed
function resolveDataDir(): string {
  // In production/serverless, always use in-memory mode
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return "";
  }
  
  // In development, try to use persistent storage
  const requested = process.env.PGLITE_DATA_DIR || ".pglite/db";
  try {
    const fs = require("node:fs");
    const path = require("node:path");
    const abs = path.resolve(requested);
    fs.mkdirSync(abs, { recursive: true });
    return abs;
  } catch {
    return ""; // fall back to in-memory
  }
}

const globalForDb = globalThis as typeof globalThis & {
  __guzoPglite?: PGlite;
  __guzoDb?: ReturnType<typeof drizzle>;
  __guzoReady?: Promise<void>;
  __guzoReadyResolved?: boolean;
};

function initPglite() {
  if (!globalForDb.__guzoPglite) {
    const dataDir = resolveDataDir();
    const pg = dataDir ? new PGlite(dataDir) : new PGlite();
    globalForDb.__guzoPglite = pg;
    globalForDb.__guzoDb = drizzle(pg);
    globalForDb.__guzoReady = pg.waitReady.then(() => {
      globalForDb.__guzoReadyResolved = true;
      const mode = dataDir ? `persisted → ${dataDir}` : "in-memory";
      console.log(`[db] PGlite ready — in-process PostgreSQL (WASM, ${mode})`);
    });
  }
}

/** Await PGlite boot. Call at the start of request handlers if needed. */
export async function ensureReady(): Promise<void> {
  initPglite();
  if (!globalForDb.__guzoReadyResolved && globalForDb.__guzoReady) {
    await globalForDb.__guzoReady;
  }
}

// Eagerly start PGlite on import — PGlite queues queries until ready.
initPglite();

// ── Exports ──────────────────────────────────────────────────────────
// Export the real drizzle instance — do NOT proxy, since drizzle uses
// a fluent query-builder API (select().from().where()) that breaks
// under proxy interception.
// PGlite internally queues queries until the WASM engine is ready.

export const db = (() => {
  initPglite();
  return globalForDb.__guzoDb!;
})();

export const pool = (() => {
  initPglite();
  return globalForDb.__guzoPglite!;
})();

export function getPglite(): PGlite {
  initPglite();
  return globalForDb.__guzoPglite!;
}
