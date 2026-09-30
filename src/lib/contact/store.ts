import { neon } from "@neondatabase/serverless";
import type { ContactInput } from "./schema";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

let tableReady: Promise<void> | undefined;

/** Idempotent schema bootstrap so a fresh database works without a separate migration step. */
function ensureTable(): Promise<void> {
  tableReady ??= (async () => {
    const db = sql();
    await db`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        project_type TEXT NOT NULL,
        budget TEXT,
        message TEXT NOT NULL,
        preferred_language TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
  })().catch((error) => {
    tableReady = undefined;
    throw error;
  });
  return tableReady;
}

export async function insertSubmission(input: ContactInput): Promise<void> {
  await ensureTable();
  const db = sql();
  await db`
    INSERT INTO contact_submissions (name, email, company, project_type, budget, message, preferred_language)
    VALUES (${input.name}, ${input.email}, ${input.company ?? null}, ${input.projectType}, ${input.budget ?? null}, ${input.message}, ${input.language})`;
}

export async function pingDatabase(): Promise<boolean> {
  try {
    await sql()`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function countSubmissions(): Promise<number | null> {
  try {
    await ensureTable();
    const rows = await sql()`SELECT count(*)::int AS n FROM contact_submissions`;
    return (rows[0] as { n: number } | undefined)?.n ?? 0;
  } catch {
    return null;
  }
}
