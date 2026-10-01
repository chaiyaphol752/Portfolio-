import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy built around what the site actually loads:
 * - everything is same-origin (fonts are self-hosted by next/font, images are local SVG/data URIs);
 * - script-src needs 'unsafe-inline' because statically generated App Router pages stream their
 *   RSC payload in inline scripts; nonces would force every page to render dynamically. All
 *   other script sources, plugins, framing, base-uri and form targets are locked down.
 * - connect-src allows https: so the Lab's request inspector can call APIs the visitor enters;
 *   those requests run in the visitor's browser, never on this server.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' https:${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    // The contact form needs a few KB; reject oversized Server Action bodies early.
    serverActions: { bodySizeLimit: "64kb" },
  },
  async redirects() {
    return [{ source: "/:locale(en|de|th)/skills", destination: "/:locale/capabilities", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
