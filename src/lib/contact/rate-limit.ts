/**
 * Fixed-window, in-memory limiter. On serverless each instance keeps its own counters,
 * so this is a best-effort brake on bursts, not a hard global guarantee.
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

export function resetRateLimits() {
  buckets.clear();
}
