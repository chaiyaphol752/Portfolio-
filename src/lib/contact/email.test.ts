import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));

const { buildAcknowledgement, buildOwnerNotification, emailConfig, escapeHtml } = await import("./email");
const { deliverContact, configuredChannels } = await import("./deliver");
import type { ContactInput } from "./schema";
import { profile } from "@/config/profile";

const env = (values: Record<string, string>) => values as unknown as NodeJS.ProcessEnv;

const input: ContactInput = {
  name: "Ada <script>alert(1)</script>",
  email: "ada@example.com",
  company: "Analytical & Co",
  enquiryType: "job-opportunity",
  message: "We need a redesign.\n<b>bold</b> & more",
  language: "de",
  consent: "on",
};

describe("email config", () => {
  it("is disabled without an API key", () => {
    expect(emailConfig(env({}))).toBeNull();
  });
  it("defaults to the profile inbox and the Resend test sender", () => {
    const c = emailConfig(env({ RESEND_API_KEY: "re_test" }));
    expect(c).toMatchObject({ to: profile.contact.email, from: "Portfolio <onboarding@resend.dev>", customSender: false });
  });
  it("detects a verified custom sender", () => {
    const c = emailConfig(env({ RESEND_API_KEY: "re_test", CONTACT_FROM_EMAIL: "Portfolio <contact@example.dev>", CONTACT_TO_EMAIL: "me@example.dev" }));
    expect(c).toMatchObject({ to: "me@example.dev", customSender: true });
  });
  it("lists configured channels without exposing values", () => {
    expect(configuredChannels(env({ RESEND_API_KEY: "x", CONTACT_WEBHOOK_URL: "y" }))).toEqual(["email", "webhook"]);
  });
});

describe("templates", () => {
  it("escapes user content in HTML", () => {
    const { html, subject, text } = buildOwnerNotification(input, new Date("2026-10-01T10:00:00Z"));
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt; &amp; more");
    expect(subject).toBe("New portfolio message — Ada <script>alert(1)</script> — Job opportunity");
    expect(text).toContain("Enquiry type: Job opportunity");
    expect(text).toContain("Received: 2026-10-01 10:00 UTC");
  });
  it("keeps the subject on one line", () => {
    expect(buildOwnerNotification({ ...input, name: "A\r\nBcc: x@y.z" }).subject).not.toMatch(/[\r\n]/);
  });
  it("localizes the acknowledgement", () => {
    expect(buildAcknowledgement(input).subject).toMatch(/Nachricht/);
    expect(buildAcknowledgement({ ...input, language: "th" }).text).not.toMatch(/ครับ|ค่ะ/);
  });
  it("escapes HTML entities", () => {
    expect(escapeHtml(`"'<>&`)).toBe("&quot;&#39;&lt;&gt;&amp;");
  });
});

describe("delivery through Resend", () => {
  beforeEach(() => {
    send.mockReset();
    delete process.env.DATABASE_URL;
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.CONTACT_FROM_EMAIL;
    process.env.RESEND_API_KEY = "re_test";
  });
  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    vi.restoreAllMocks();
  });

  it("notifies the owner with reply-to set to the visitor", async () => {
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    expect(await deliverContact(input)).toEqual({ ok: true, channels: ["email"], acknowledged: false });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0]?.[0]).toMatchObject({ to: [profile.contact.email], replyTo: "ada@example.com" });
  });
  it("sends an acknowledgement only from a verified sender", async () => {
    process.env.CONTACT_FROM_EMAIL = "Portfolio <contact@example.dev>";
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    expect(await deliverContact(input)).toEqual({ ok: true, channels: ["email"], acknowledged: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1]?.[0]).toMatchObject({ to: ["ada@example.com"] });
  });
  it("reports failure without leaking provider details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "secret detail" } });
    expect(await deliverContact(input)).toEqual({ ok: false, reason: "failed" });
  });
});
