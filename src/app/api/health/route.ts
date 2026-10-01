import { NextResponse } from "next/server";
import { hasDatabase, pingDatabase } from "@/lib/contact/store";
import { emailConfig } from "@/lib/contact/email";
import { configuredChannels } from "@/lib/contact/deliver";

export const dynamic = "force-dynamic";

/**
 * Safe, non-secret runtime health information. Deliberately minimal: no versions,
 * hostnames, credentials or provider responses — only configured/not-configured states.
 */
export async function GET() {
  const database = hasDatabase() ? ((await pingDatabase()) ? "connected" : "unreachable") : "not-configured";
  const healthy = database !== "unreachable";
  const email = emailConfig();
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      service: "ai-native-developer-portfolio",
      time: new Date().toISOString(),
      runtime: { node: "Node.js", region: process.env.VERCEL_REGION ?? "local", environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV },
      deployment: { commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null },
      checks: {
        database,
        email: email ? (email.customSender ? "configured" : "configured-test-sender") : "not-configured",
        emailProvider: email ? "resend" : null,
        contactWebhook: process.env.CONTACT_WEBHOOK_URL ? "configured" : "not-configured",
        contactChannels: configuredChannels(),
      },
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
