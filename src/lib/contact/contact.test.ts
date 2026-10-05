import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseContact } from "./schema";
import { rateLimit, resetRateLimits } from "./rate-limit";
import { deliverContact } from "./deliver";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "",
  enquiryType: "job-opportunity",
  message: "I would like to talk about a junior web development role.",
  language: "de",
  consent: "on",
  website: "",
};

describe("contact validation", () => {
  it("accepts a valid submission and drops empty optionals", () => {
    const r = parseContact(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.company).toBeUndefined();
    }
  });
  it("returns stable error codes per field", () => {
    const r = parseContact({ ...valid, name: "A", email: "nope", message: "short", consent: undefined, enquiryType: "x" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.fieldErrors).toMatchObject({
        name: "name.short",
        email: "email.invalid",
        message: "message.short",
        consent: "consent.required",
        enquiryType: "enquiryType.invalid",
      });
    }
  });
  it("flags the honeypot", () => {
    const r = parseContact({ ...valid, website: "http://spam.example" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.honeypot).toBe(true);
  });
  it("rejects unsupported languages", () => {
    const r = parseContact({ ...valid, language: "fr" });
    expect(r.success).toBe(false);
  });
});

describe("rate limiting", () => {
  beforeEach(resetRateLimits);
  it("blocks after the limit and recovers after the window", () => {
    for (let i = 0; i < 4; i++) expect(rateLimit("ip", { now: 0 }).allowed).toBe(true);
    const blocked = rateLimit("ip", { now: 1000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(rateLimit("ip", { now: 11 * 60_000 }).allowed).toBe(true);
  });
  it("tracks keys independently", () => {
    for (let i = 0; i < 5; i++) rateLimit("a", { now: 0 });
    expect(rateLimit("b", { now: 0 }).allowed).toBe(true);
  });
});

describe("delivery", () => {
  const parsed = parseContact(valid);
  const data = parsed.success ? parsed.data : (undefined as never);
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
  });
  afterEach(() => vi.restoreAllMocks());

  it("reports unavailable when no channel is configured (never a fake success)", async () => {
    expect(await deliverContact(data)).toEqual({ ok: false, reason: "unavailable" });
  });
  it("delivers through the webhook when configured", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.test/x";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));
    expect(await deliverContact(data)).toEqual({ ok: true, channels: ["webhook"], acknowledged: false });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("fails when the only channel errors", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.test/x";
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("no", { status: 500 }));
    expect(await deliverContact(data)).toEqual({ ok: false, reason: "failed" });
  });
});

describe("contact abuse controls", () => {
  beforeEach(resetRateLimits);
  it("limits per email address independently of IP", async () => {
    const { checkContactLimits } = await import("./rate-limit");
    for (let i = 0; i < 3; i++) expect(checkContactLimits({ ip: `10.0.0.${i}`, email: "victim@example.com" }, 0).allowed).toBe(true);
    expect(checkContactLimits({ ip: "10.0.0.9", email: "Victim@Example.com" }, 0).allowed).toBe(false);
  });
  it("has a per-instance global circuit breaker", async () => {
    const { checkContactLimits } = await import("./rate-limit");
    let blocked = false;
    for (let i = 0; i < 45; i++) blocked ||= !checkContactLimits({ ip: `ip${i}`, email: `u${i}@example.com` }, 0).allowed;
    expect(blocked).toBe(true);
  });
  it("suppresses duplicate submissions within the window", async () => {
    const { isDuplicate } = await import("./rate-limit");
    expect(isDuplicate("abc", { now: 0 })).toBe(false);
    expect(isDuplicate("abc", { now: 1000 })).toBe(true);
    expect(isDuplicate("abc", { now: 31 * 60_000 })).toBe(false);
  });
  it("prefers Vercel's client IP header", async () => {
    const { clientIp } = await import("./rate-limit");
    const headers: Record<string, string> = { "x-forwarded-for": "6.6.6.6", "x-vercel-forwarded-for": "1.2.3.4" };
    expect(clientIp((n) => headers[n] ?? null)).toBe("1.2.3.4");
    expect(clientIp(() => null)).toBe("unknown");
  });
});

describe("open relay and injection guards", () => {
  it("drops any recipient-like fields a visitor adds to the form", () => {
    const r = parseContact({ ...valid, to: "victim@example.com", cc: "x@y.z", bcc: "a@b.c", from: "spoof@example.com" });
    expect(r.success).toBe(true);
    if (r.success) {
      for (const k of ["to", "cc", "bcc", "from"]) expect(k in r.data).toBe(false);
    }
  });
  it("rejects header injection through the reply-to email", () => {
    for (const email of ["a@b.co\nBcc: x@y.z", "a@b.co\r\nSubject: hi", "a@b.co, c@d.co"]) {
      expect(parseContact({ ...valid, email }).success).toBe(false);
    }
  });
  it("enforces length limits server-side", () => {
    expect(parseContact({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
    expect(parseContact({ ...valid, name: "x".repeat(101) }).success).toBe(false);
  });
});
