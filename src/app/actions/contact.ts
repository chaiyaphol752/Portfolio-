"use server";

import { headers } from "next/headers";
import { parseContact, type ContactFieldErrors } from "@/lib/contact/schema";
import { rateLimit } from "@/lib/contact/rate-limit";
import { deliverContact } from "@/lib/contact/deliver";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; fieldErrors: ContactFieldErrors }
  | { status: "rate-limited"; retryAfterSec: number }
  | { status: "unavailable" }
  | { status: "error" };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = parseContact(raw);

  // Bots that fill the hidden field get a fake success so they learn nothing.
  if (!parsed.success && parsed.honeypot) return { status: "success" };
  if (!parsed.success) return { status: "invalid", fieldErrors: parsed.fieldErrors };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.allowed) return { status: "rate-limited", retryAfterSec: limit.retryAfterSec };

  try {
    const result = await deliverContact(parsed.data);
    if (result.ok) return { status: "success" };
    return { status: result.reason === "unavailable" ? "unavailable" : "error" };
  } catch {
    return { status: "error" };
  }
}
