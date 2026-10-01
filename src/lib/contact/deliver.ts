import type { ContactInput } from "./schema";
import { hasDatabase, insertSubmission } from "./store";
import { EmailDeliveryError, emailConfig, sendAcknowledgement, sendOwnerNotification } from "./email";

export type Channel = "email" | "database" | "webhook";
export type DeliveryResult = { ok: true; channels: Channel[]; acknowledged: boolean } | { ok: false; reason: "unavailable" | "failed" };

async function postWebhook(url: string, input: ContactInput): Promise<void> {
  const summary = `New portfolio enquiry from ${input.name} <${input.email}> (${input.projectType}${input.budget ? `, ${input.budget}` : ""})`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // `text`/`content` make the payload render in Slack- and Discord-style incoming webhooks.
    body: JSON.stringify({ text: `${summary}\n\n${input.message}`, content: `${summary}\n\n${input.message}`.slice(0, 1900), submission: input }),
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
}

/**
 * Server log text for a failed channel. Only our own messages (provider error *name*, HTTP
 * status) are logged verbatim; anything else (e.g. database driver errors, which can include
 * connection details) is reduced to its error type. Submission content is never logged.
 */
function safeReason(reason: unknown): string {
  if (reason instanceof EmailDeliveryError) return reason.message;
  if (reason instanceof Error && /^Webhook responded \d{3}$/.test(reason.message)) return reason.message;
  return reason instanceof Error ? reason.name : "unknown error";
}

/** Which channels the current environment can deliver through (no secrets, safe for /api/health). */
export function configuredChannels(env: NodeJS.ProcessEnv = process.env): Channel[] {
  const channels: Channel[] = [];
  if (emailConfig(env)) channels.push("email");
  if (env.DATABASE_URL) channels.push("database");
  if (env.CONTACT_WEBHOOK_URL) channels.push("webhook");
  return channels;
}

/**
 * Sends a validated submission to every configured channel (Resend email, database, webhook).
 * Succeeds when at least one channel accepted it; never claims success otherwise.
 * The visitor acknowledgement runs only after the owner was notified and never affects the result.
 */
export async function deliverContact(input: ContactInput): Promise<DeliveryResult> {
  const tasks: { name: Channel; run: () => Promise<unknown> }[] = [];
  const email = emailConfig();
  if (email) tasks.push({ name: "email", run: () => sendOwnerNotification(input, email) });
  if (hasDatabase()) tasks.push({ name: "database", run: () => insertSubmission(input) });
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) tasks.push({ name: "webhook", run: () => postWebhook(webhook, input) });
  if (tasks.length === 0) return { ok: false, reason: "unavailable" };

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));
  const channels = tasks.filter((_, i) => settled[i]?.status === "fulfilled").map((t) => t.name);
  settled.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[contact] ${tasks[i]?.name} delivery failed:`, safeReason(r.reason));
  });
  if (!channels.length) return { ok: false, reason: "failed" };

  let acknowledged = false;
  if (email && channels.includes("email")) {
    acknowledged = await sendAcknowledgement(input, email).catch(() => false);
  }
  return { ok: true, channels, acknowledged };
}
