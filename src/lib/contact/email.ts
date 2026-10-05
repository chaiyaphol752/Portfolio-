import "server-only";
import { Resend } from "resend";
import { profile } from "@/config/profile";
import type { ContactInput } from "./schema";

const enquiryTypeLabel: Record<ContactInput["enquiryType"], string> = {
  "job-opportunity": "Job opportunity",
  internship: "Internship / training",
  collaboration: "Project collaboration",
  feedback: "Portfolio feedback",
  other: "Other",
};

const languageLabel: Record<ContactInput["language"], string> = { en: "English", de: "Deutsch", th: "ไทย (Thai)" };

/** Resend's shared test sender: only delivers to the Resend account owner's own address. */
const TEST_SENDER = "Portfolio <onboarding@resend.dev>";

export interface EmailConfig {
  apiKey: string;
  to: string;
  from: string;
  /** True when the sender is on a verified custom domain, which allows mail to arbitrary visitors. */
  customSender: boolean;
}

export function emailConfig(env: NodeJS.ProcessEnv = process.env): EmailConfig | null {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return null;
  const from = env.CONTACT_FROM_EMAIL?.trim() || TEST_SENDER;
  return {
    apiKey,
    to: env.CONTACT_TO_EMAIL?.trim() || profile.contact.email,
    from,
    customSender: !/@resend\.dev>?$/i.test(from),
  };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** Strips CR/LF so user input can never inject extra headers through the subject line. */
const headerSafe = (value: string) => value.replace(/[\r\n]+/g, " ").trim().slice(0, 120);

export function buildOwnerNotification(input: ContactInput, receivedAt = new Date()) {
  const rows: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
    ...(input.company ? ([["Company", input.company]] as [string, string][]) : []),
    ["Enquiry type", enquiryTypeLabel[input.enquiryType]],
    ["Preferred language", languageLabel[input.language]],
    ["Received", `${receivedAt.toISOString().replace("T", " ").slice(0, 16)} UTC`],
  ];
  const subject = headerSafe(`New portfolio message — ${input.name} — ${enquiryTypeLabel[input.enquiryType]}`);

  const text = [
    "New portfolio message",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    input.message,
    "",
    "Reply to this email to answer the sender directly.",
  ].join("\n");

  const cell = "padding:10px 0;border-bottom:1px solid #2a2f3a;vertical-align:top;font-size:14px;";
  const html = `<!doctype html><html><body style="margin:0;background:#0c0e13;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#e9ecf3;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#12151c;border:1px solid #242935;">
<tr><td style="padding:28px 32px 8px;"><p style="margin:0;font:12px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#7e8593;">Portfolio message</p>
<h1 style="margin:10px 0 0;font-size:24px;line-height:1.2;font-weight:600;">${escapeHtml(input.name)} · ${escapeHtml(enquiryTypeLabel[input.enquiryType])}</h1></td></tr>
<tr><td style="padding:16px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${rows.map(([k, v]) => `<tr><td style="${cell}width:38%;color:#7e8593;">${escapeHtml(k)}</td><td style="${cell}">${escapeHtml(v)}</td></tr>`).join("")}
</table></td></tr>
<tr><td style="padding:8px 32px 28px;"><p style="margin:0 0 8px;font:12px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#7e8593;">Message</p>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;">${escapeHtml(input.message)}</div></td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #2a2f3a;font-size:12px;color:#7e8593;">Reply to this email to answer ${escapeHtml(input.name)} directly.</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}

const ackCopy: Record<ContactInput["language"], { subject: string; greeting: (n: string) => string; body: string; signoff: string }> = {
  en: {
    subject: "Your message has been received",
    greeting: (n) => `Hi ${n},`,
    body: "Thanks — your message has been received. I'll review it and reply using the contact information you provided.",
    signoff: "Best regards",
  },
  de: {
    subject: "Deine Nachricht ist angekommen",
    greeting: (n) => `Hallo ${n},`,
    body: "Danke – deine Nachricht ist angekommen. Ich sehe sie mir an und antworte über die angegebenen Kontaktdaten.",
    signoff: "Viele Grüße",
  },
  th: {
    subject: "ได้รับข้อความแล้ว",
    greeting: (n) => `สวัสดีคุณ ${n}`,
    body: "ขอบคุณที่ติดต่อมา ได้รับข้อความเรียบร้อยแล้ว จะตรวจสอบและตอบกลับผ่านช่องทางที่ให้ไว้",
    signoff: "ด้วยความเคารพ",
  },
};

export function buildAcknowledgement(input: ContactInput) {
  const c = ackCopy[input.language];
  const signoff = c.signoff;
  const text = `${c.greeting(input.name)}\n\n${c.body}\n\n${signoff}\n${profile.name}`;
  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#0c0e13;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#e9ecf3;">
<div style="max-width:560px;margin:0 auto;background:#12151c;border:1px solid #242935;padding:28px 32px;font-size:15px;line-height:1.6;">
<p style="margin:0 0 16px;">${escapeHtml(c.greeting(input.name))}</p><p style="margin:0 0 16px;">${escapeHtml(c.body)}</p>
<p style="margin:0;">${escapeHtml(signoff)}<br>${escapeHtml(profile.name)}</p></div></body></html>`;
  return { subject: c.subject, text, html };
}

export class EmailDeliveryError extends Error {}

/** Sends the owner notification. Throws EmailDeliveryError with a safe message on failure. */
export async function sendOwnerNotification(input: ContactInput, config: EmailConfig): Promise<string> {
  const resend = new Resend(config.apiKey);
  const message = buildOwnerNotification(input);
  const { data, error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    tags: [{ name: "category", value: "portfolio_enquiry" }],
  });
  if (error || !data) throw new EmailDeliveryError(`Resend rejected the notification (${error?.name ?? "no data"})`);
  return data.id;
}

/**
 * Optional acknowledgement to the visitor. Only possible from a verified custom sender,
 * and skipped when it would mail the owner's own inbox (no loops).
 */
export async function sendAcknowledgement(input: ContactInput, config: EmailConfig): Promise<boolean> {
  if (!config.customSender || process.env.CONTACT_SEND_CONFIRMATION === "false") return false;
  if (input.email.toLowerCase() === config.to.toLowerCase()) return false;
  const resend = new Resend(config.apiKey);
  const message = buildAcknowledgement(input);
  const { error } = await resend.emails.send({ from: config.from, to: [input.email], replyTo: config.to, ...message });
  return !error;
}
