/**
 * API request builder: turns a request spec into a resolved URL, warnings and
 * ready-to-run snippets (cURL, fetch, Python requests). Pure and framework-free.
 */

export const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
export type HttpMethod = (typeof httpMethods)[number];

export interface KeyValue {
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestSpec {
  method: HttpMethod;
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  body: string;
}

export type RequestWarning =
  | "insecure-url"
  | "body-ignored"
  | "invalid-json-body"
  | "missing-content-type"
  | "invalid-header-name"
  | "duplicate-header"
  | "credentials-in-url";

export type UrlResult =
  | { ok: true; url: URL }
  | { ok: false; error: "empty" | "invalid" | "unsupported-protocol" };

const active = (rows: KeyValue[]) => rows.filter((r) => r.enabled && r.key.trim() !== "");

/** Resolves the URL (relative paths against `base`) and appends enabled query params. */
export function resolveUrl(spec: Pick<RequestSpec, "url" | "params">, base?: string): UrlResult {
  const raw = spec.url.trim();
  if (!raw) return { ok: false, error: "empty" };
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return { ok: false, error: "invalid" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false, error: "unsupported-protocol" };
  for (const p of active(spec.params)) url.searchParams.append(p.key.trim(), p.value);
  return { ok: true, url };
}

export const methodAllowsBody = (method: HttpMethod) => method !== "GET" && method !== "DELETE";

/** RFC 9110 token characters. */
const HEADER_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

export function isJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

export function analyzeRequest(spec: RequestSpec, base?: string): RequestWarning[] {
  const warnings = new Set<RequestWarning>();
  const resolved = resolveUrl(spec, base);
  if (resolved.ok) {
    const { url } = resolved;
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol === "http:" && !local) warnings.add("insecure-url");
    if (url.username || url.password) warnings.add("credentials-in-url");
  }
  const headers = active(spec.headers);
  const seen = new Set<string>();
  for (const h of headers) {
    const name = h.key.trim();
    if (!HEADER_NAME.test(name)) warnings.add("invalid-header-name");
    const lower = name.toLowerCase();
    if (seen.has(lower)) warnings.add("duplicate-header");
    seen.add(lower);
  }
  const body = spec.body.trim();
  if (body) {
    if (!methodAllowsBody(spec.method)) warnings.add("body-ignored");
    else {
      const looksJson = body.startsWith("{") || body.startsWith("[");
      if (looksJson && !isJson(body)) warnings.add("invalid-json-body");
      if (looksJson && !seen.has("content-type")) warnings.add("missing-content-type");
    }
  }
  return [...warnings];
}

/** POSIX shell single-quoting: wraps in '…' and escapes embedded quotes. */
export function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** Python string literal using repr-style escaping for quotes, backslashes and newlines. */
export function pyString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")}"`;
}

function sendableBody(spec: RequestSpec): string | null {
  const body = spec.body.trim();
  return body && methodAllowsBody(spec.method) ? spec.body : null;
}

export function toCurl(spec: RequestSpec, base?: string): string {
  const resolved = resolveUrl(spec, base);
  const url = resolved.ok ? resolved.url.toString() : spec.url.trim();
  const parts = [`curl -X ${spec.method} ${shellQuote(url)}`];
  for (const h of active(spec.headers)) parts.push(`-H ${shellQuote(`${h.key.trim()}: ${h.value}`)}`);
  const body = sendableBody(spec);
  if (body !== null) parts.push(`--data-raw ${shellQuote(body)}`);
  return parts.join(" \\\n  ");
}

export function toFetch(spec: RequestSpec, base?: string): string {
  const resolved = resolveUrl(spec, base);
  const url = resolved.ok ? resolved.url.toString() : spec.url.trim();
  const headers = active(spec.headers);
  const body = sendableBody(spec);
  const lines = [`const response = await fetch(${JSON.stringify(url)}, {`, `  method: ${JSON.stringify(spec.method)},`];
  if (headers.length) {
    lines.push("  headers: {");
    for (const h of headers) lines.push(`    ${JSON.stringify(h.key.trim())}: ${JSON.stringify(h.value)},`);
    lines.push("  },");
  }
  if (body !== null) lines.push(`  body: ${isJson(body) ? `JSON.stringify(${JSON.stringify(JSON.parse(body))})` : JSON.stringify(body)},`);
  lines.push("});", "const data = await response.json();");
  return lines.join("\n");
}

export function toPython(spec: RequestSpec, base?: string): string {
  const resolved = resolveUrl(spec, base);
  // Python gets params as a dict, so use the URL without the appended query.
  const url = resolved.ok ? `${resolved.url.origin}${resolved.url.pathname}` : spec.url.trim();
  const params = resolved.ok ? [...resolved.url.searchParams.entries()] : [];
  const headers = active(spec.headers);
  const body = sendableBody(spec);
  const lines = ["import requests", "", "response = requests.request(", `    ${pyString(spec.method)},`, `    ${pyString(url)},`];
  if (params.length) lines.push(`    params={${params.map(([k, v]) => `${pyString(k)}: ${pyString(v)}`).join(", ")}},`);
  if (headers.length) lines.push(`    headers={${headers.map((h) => `${pyString(h.key.trim())}: ${pyString(h.value)}`).join(", ")}},`);
  if (body !== null) {
    if (isJson(body)) lines.push(`    json=${toPythonLiteral(JSON.parse(body))},`);
    else lines.push(`    data=${pyString(body)},`);
  }
  lines.push("    timeout=10,", ")", "response.raise_for_status()", "print(response.json())");
  return lines.join("\n");
}

/** JSON value -> Python literal (True/False/None, dicts, lists). */
export function toPythonLiteral(value: unknown): string {
  if (value === null) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return pyString(value);
  if (Array.isArray(value)) return `[${value.map(toPythonLiteral).join(", ")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${pyString(k)}: ${toPythonLiteral(v)}`)
      .join(", ")}}`;
  }
  return "None";
}

/** Splits a resolved URL into labelled parts for the breakdown table. */
export function urlParts(url: URL): { protocol: string; host: string; path: string; query: [string, string][] } {
  return { protocol: url.protocol.replace(":", ""), host: url.host, path: url.pathname, query: [...url.searchParams.entries()] };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}
