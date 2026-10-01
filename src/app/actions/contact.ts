"use server";

import { headers } from "next/headers";
import { parseContact, type ContactFieldErrors } from "@/lib/contact/schema";
import { createHash } from "node:crypto";
import { checkContactLimits, clientIp, isDuplicate } from "@/lib/contact/rate-limit";
import { deliverContact } from "@/lib/contact/deliver";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; acknowledged: boolean }
  | { status: "invalid"; fieldErrors: ContactFieldErrors }
  | { status: "rate-limited"; retryAfterSec: number }
  | { status: "unavailable" }
  | { status: "error" };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = parseContact(raw);

  // Bots that fill the hidden field get a fake success so they learn nothing.
  if (!parsed.success && parsed.honeypot) return { status: "success", acknowledged: false };
  if (!parsed.success) return { status: "invalid", fieldErrors: parsed.fieldErrors };

  const h = await headers();
  const limit = checkContactLimits({ ip: clientIp((name) => h.get(name)), email: parsed.data.email });
  if (!limit.allowed) return { status: "rate-limited", retryAfterSec: limit.retryAfterSec };

  // A repeated identical submission (double click, retry) is acknowledged but not sent twice.
  const fingerprint = createHash("sha256").update(`${parsed.data.email.toLowerCase()}\n${parsed.data.message}`).digest("hex");
  if (isDuplicate(fingerprint)) return { status: "success", acknowledged: false };

  try {
    const result = await deliverContact(parsed.data);
    if (result.ok) return { status: "success", acknowledged: result.acknowledged };
    return { status: result.reason === "unavailable" ? "unavailable" : "error" };
  } catch {
    return { status: "error" };
  }
}
