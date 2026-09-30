import { z } from "zod";

export interface RepoSummary {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string | null;
  topics: string[];
}

export type RepoResult = { status: "ok"; repos: RepoSummary[] } | { status: "error"; repos: [] };

const rawRepo = z.object({
  name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  stargazers_count: z.number().optional(),
  pushed_at: z.string().nullable().optional(),
  topics: z.array(z.string()).optional(),
  fork: z.boolean().optional(),
  archived: z.boolean().optional(),
  private: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

/** Keeps original, active, public repositories and normalizes them to what the UI needs. */
export function mapRepos(raw: unknown, limit = 6): RepoSummary[] {
  if (!Array.isArray(raw)) return [];
  const repos: RepoSummary[] = [];
  for (const item of raw) {
    const parsed = rawRepo.safeParse(item);
    if (!parsed.success) continue;
    const r = parsed.data;
    if (r.fork || r.archived || r.private || r.disabled) continue;
    repos.push({
      name: r.name,
      url: r.html_url,
      description: r.description ?? null,
      language: r.language ?? null,
      stars: r.stargazers_count ?? 0,
      pushedAt: r.pushed_at ?? null,
      topics: r.topics ?? [],
    });
  }
  return repos
    .sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""))
    .slice(0, limit);
}

/**
 * Fetches public repositories server-side. The optional token never leaves the server
 * and any failure degrades to an empty result so the page still renders.
 */
export async function fetchPublicRepos(username: string, limit = 6): Promise<RepoResult> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=30`, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) return { status: "error", repos: [] };
    return { status: "ok", repos: mapRepos(await response.json(), limit) };
  } catch {
    return { status: "error", repos: [] };
  }
}
