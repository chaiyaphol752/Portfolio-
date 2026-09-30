import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPublicRepos, mapRepos } from "./repos";

const repo = (over: Record<string, unknown> = {}) => ({
  name: "demo",
  html_url: "https://github.com/u/demo",
  description: "A demo",
  language: "TypeScript",
  stargazers_count: 3,
  pushed_at: "2026-09-01T00:00:00Z",
  topics: ["nextjs"],
  fork: false,
  archived: false,
  private: false,
  ...over,
});

describe("mapRepos", () => {
  it("filters forks, archived, private and malformed entries", () => {
    const out = mapRepos([
      repo({ name: "keep" }),
      repo({ name: "fork", fork: true }),
      repo({ name: "old", archived: true }),
      repo({ name: "secret", private: true }),
      { nope: true },
      null,
    ]);
    expect(out.map((r) => r.name)).toEqual(["keep"]);
  });
  it("normalizes optional fields and sorts by most recent push", () => {
    const out = mapRepos([
      repo({ name: "older", pushed_at: "2026-01-01T00:00:00Z" }),
      repo({ name: "newer", description: undefined, language: undefined, stargazers_count: undefined, topics: undefined }),
    ]);
    expect(out.map((r) => r.name)).toEqual(["newer", "older"]);
    expect(out[0]).toMatchObject({ description: null, language: null, stars: 0, topics: [] });
  });
  it("respects the limit and tolerates non-arrays", () => {
    expect(mapRepos(Array.from({ length: 10 }, (_, i) => repo({ name: `r${i}` })), 3)).toHaveLength(3);
    expect(mapRepos({ message: "rate limited" })).toEqual([]);
  });
});

describe("fetchPublicRepos", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GITHUB_TOKEN;
  });
  it("returns mapped repos and sends the token only as a header", async () => {
    process.env.GITHUB_TOKEN = "t0ken";
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([repo()]), { status: 200 }));
    const result = await fetchPublicRepos("someone");
    expect(result.status).toBe("ok");
    const [url, init] = spy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/users/someone/repos");
    expect(url).not.toContain("t0ken");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer t0ken");
  });
  it("degrades to an error result on HTTP failure or network error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("{}", { status: 403 }));
    expect(await fetchPublicRepos("x")).toEqual({ status: "error", repos: [] });
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline"));
    expect(await fetchPublicRepos("x")).toEqual({ status: "error", repos: [] });
  });
});
