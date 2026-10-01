import { describe, expect, it } from "vitest";
import { analyzeRequest, pyString, resolveUrl, shellQuote, toCurl, toFetch, toPython, toPythonLiteral, urlParts, type RequestSpec } from "./request";

const base: RequestSpec = {
  method: "GET",
  url: "/api/health",
  params: [],
  headers: [],
  body: "",
};

describe("resolveUrl", () => {
  it("resolves relative paths against the base and appends enabled params", () => {
    const r = resolveUrl({ url: "/api/items?a=1", params: [{ key: "q", value: "x y", enabled: true }, { key: "off", value: "1", enabled: false }] }, "https://example.com");
    expect(r.ok && r.url.toString()).toBe("https://example.com/api/items?a=1&q=x+y");
  });
  it("rejects empty, invalid and non-http URLs", () => {
    expect(resolveUrl({ url: " ", params: [] })).toEqual({ ok: false, error: "empty" });
    expect(resolveUrl({ url: "not a url", params: [] })).toEqual({ ok: false, error: "invalid" });
    expect(resolveUrl({ url: "javascript:alert(1)", params: [] })).toEqual({ ok: false, error: "unsupported-protocol" });
  });
  it("splits a URL into parts", () => {
    const r = resolveUrl({ url: "https://api.example.com/v1/x?a=1", params: [] });
    expect(r.ok && urlParts(r.url)).toEqual({ protocol: "https", host: "api.example.com", path: "/v1/x", query: [["a", "1"]] });
  });
});

describe("analyzeRequest", () => {
  it("is clean for a simple GET", () => {
    expect(analyzeRequest(base, "https://example.com")).toEqual([]);
  });
  it("flags insecure URLs except localhost", () => {
    expect(analyzeRequest({ ...base, url: "http://example.com" })).toContain("insecure-url");
    expect(analyzeRequest({ ...base, url: "http://localhost:3000" })).not.toContain("insecure-url");
  });
  it("flags a body on GET and invalid JSON bodies", () => {
    expect(analyzeRequest({ ...base, url: "https://x.dev", body: "{}" })).toContain("body-ignored");
    const w = analyzeRequest({ ...base, method: "POST", url: "https://x.dev", body: "{ bad" });
    expect(w).toEqual(expect.arrayContaining(["invalid-json-body", "missing-content-type"]));
  });
  it("checks header names and duplicates case-insensitively", () => {
    const w = analyzeRequest({
      ...base,
      url: "https://x.dev",
      headers: [
        { key: "Bad Header", value: "1", enabled: true },
        { key: "Accept", value: "a", enabled: true },
        { key: "accept", value: "b", enabled: true },
      ],
    });
    expect(w).toEqual(expect.arrayContaining(["invalid-header-name", "duplicate-header"]));
  });
  it("flags credentials embedded in the URL", () => {
    expect(analyzeRequest({ ...base, url: "https://user:pw@x.dev" })).toContain("credentials-in-url");
  });
});

describe("snippets", () => {
  const post: RequestSpec = {
    method: "POST",
    url: "https://api.example.com/items",
    params: [{ key: "dry", value: "1", enabled: true }],
    headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
    body: `{"name":"it's","ok":true,"n":null}`,
  };
  it("quotes shell values safely", () => {
    expect(shellQuote("it's")).toBe(`'it'\\''s'`);
    expect(toCurl(post)).toBe(
      `curl -X POST 'https://api.example.com/items?dry=1' \\\n  -H 'Content-Type: application/json' \\\n  --data-raw '{"name":"it'\\''s","ok":true,"n":null}'`,
    );
  });
  it("omits the body for GET", () => {
    expect(toCurl({ ...base, url: "https://x.dev", body: "{}" })).not.toContain("--data-raw");
  });
  it("generates fetch with JSON.stringify for JSON bodies", () => {
    const code = toFetch(post);
    expect(code).toContain(`method: "POST"`);
    expect(code).toContain(`JSON.stringify({"name":"it's","ok":true,"n":null})`);
  });
  it("generates Python requests with params, headers and json", () => {
    const code = toPython(post);
    expect(code).toContain(`"https://api.example.com/items"`);
    expect(code).toContain(`params={"dry": "1"}`);
    expect(code).toContain(`json={"name": "it's", "ok": True, "n": None}`);
    expect(code).toContain("timeout=10");
  });
  it("converts JSON values to Python literals", () => {
    expect(toPythonLiteral([1, "a", false, { k: null }])).toBe(`[1, "a", False, {"k": None}]`);
    expect(pyString(`a"b\\c\n`)).toBe(`"a\\"b\\\\c\\n"`);
  });
});
