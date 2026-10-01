/**
 * Fixed-window, in-memory limiter.
 *
 * Limitation (deliberate, documented): on Vercel each serverless instance keeps its own
 * counters, so these limits are a best-effort brake on bursts, not a distributed guarantee.
 * A shared store (e.g. Redis/KV) would be needed for global limits; none is configured, and
 * adding a paid service was out of scope. Several independent keys (IP, email, global) make
 * casual abuse expensive even so.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, { limit = 4, windowMs = 10 * 60_000, now = Date.now() } = {}): { allowed: boolean; retryAfterSec: number } {
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  return bucket.count > limit
    ? { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
    : { allowed: true, retryAfterSec: 0 };
}

/** Applies every limit; the first one exceeded wins. */
export function checkContactLimits(
  { ip, email }: { ip: string; email: string },
  now = Date.now(),
): { allowed: boolean; retryAfterSec: number } {
  const checks = [
    rateLimit(`contact:ip:${ip}`, { limit: 4, windowMs: 10 * 60_000, now }),
    // Caps mail to (and acknowledgements for) any single address, so the form can't be aimed at someone.
    rateLimit(`contact:email:${email.toLowerCase()}`, { limit: 3, windowMs: 60 * 60_000, now }),
    // Per-instance circuit breaker against distributed floods.
    rateLimit("contact:global", { limit: 40, windowMs: 10 * 60_000, now }),
  ];
  const blocked = checks.find((c) => !c.allowed);
  return blocked ?? { allowed: true, retryAfterSec: 0 };
}

const recent = new Map<string, number>();

/** True when the same sender already submitted the same message recently (double clicks, retries). */
export function isDuplicate(fingerprint: string, { windowMs = 30 * 60_000, now = Date.now() } = {}): boolean {
  if (recent.size > 2_000) {
    for (const [k, t] of recent) if (t <= now) recent.delete(k);
  }
  const expires = recent.get(fingerprint);
  if (expires && expires > now) return true;
  recent.set(fingerprint, now + windowMs);
  return false;
}

/** Client IP as reported by Vercel's edge (not spoofable by the client), with generic fallbacks. */
export function clientIp(get: (name: string) => string | null): string {
  return (
    get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    get("x-real-ip")?.trim() ||
    get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function resetRateLimits() {
  buckets.clear();
  recent.clear();
}
