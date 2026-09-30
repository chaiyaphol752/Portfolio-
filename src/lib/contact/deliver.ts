import type { ContactInput } from "./schema";
import { hasDatabase, insertSubmission } from "./store";

export type DeliveryResult = { ok: true; channels: string[] } | { ok: false; reason: "unavailable" | "failed" };

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
 * Sends a validated submission to every configured channel (database, webhook).
 * Succeeds when at least one channel accepted it; never claims success otherwise.
 */
export async function deliverContact(input: ContactInput): Promise<DeliveryResult> {
  const tasks: { name: string; run: () => Promise<void> }[] = [];
  if (hasDatabase()) tasks.push({ name: "database", run: () => insertSubmission(input) });
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) tasks.push({ name: "webhook", run: () => postWebhook(webhook, input) });
  if (tasks.length === 0) return { ok: false, reason: "unavailable" };

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));
  const channels = tasks.filter((_, i) => settled[i]?.status === "fulfilled").map((t) => t.name);
  settled.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[contact] ${tasks[i]?.name} delivery failed`, r.reason instanceof Error ? r.reason.message : "unknown error");
  });
  return channels.length ? { ok: true, channels } : { ok: false, reason: "failed" };
}
