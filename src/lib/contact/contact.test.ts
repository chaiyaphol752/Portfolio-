import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseContact } from "./schema";
import { rateLimit, resetRateLimits } from "./rate-limit";
import { deliverContact } from "./deliver";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "",
  projectType: "webapp",
  budget: "",
  message: "I need a dashboard for our internal operations team.",
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
      expect(r.data.budget).toBeUndefined();
    }
  });
  it("returns stable error codes per field", () => {
    const r = parseContact({ ...valid, name: "A", email: "nope", message: "short", consent: undefined, projectType: "x" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.fieldErrors).toMatchObject({
        name: "name.short",
        email: "email.invalid",
        message: "message.short",
        consent: "consent.required",
        projectType: "projectType.invalid",
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
  });
  afterEach(() => vi.restoreAllMocks());

  it("reports unavailable when no channel is configured (never a fake success)", async () => {
    expect(await deliverContact(data)).toEqual({ ok: false, reason: "unavailable" });
  });
  it("delivers through the webhook when configured", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.test/x";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));
    expect(await deliverContact(data)).toEqual({ ok: true, channels: ["webhook"] });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("fails when the only channel errors", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.test/x";
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("no", { status: 500 }));
    expect(await deliverContact(data)).toEqual({ ok: false, reason: "failed" });
  });
});
