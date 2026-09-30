// Visual + smoke QA: screenshots every page/locale/viewport and reports console errors and horizontal overflow.
// Usage: BASE_URL=http://localhost:3000 node scripts/qa.mjs [outDir] [locales] [viewports]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "qa-shots";
const locales = (process.argv[3] ?? "en,de,th").split(",");
const slugs = ["", "about", "skills", "projects", "case-studies", "ai-native", "lab", "systems", "command-center"];
const all = { phone: { width: 360, height: 780 }, tablet: { width: 820, height: 1100 }, laptop: { width: 1366, height: 820 }, wide: { width: 1920, height: 1080 } };
const wanted = (process.argv[4] ?? Object.keys(all).join(",")).split(",");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const problems = [];
for (const vp of wanted) {
  const ctx = await browser.newContext({ viewport: all[vp], reducedMotion: "reduce" });
  for (const locale of locales) {
    for (const slug of slugs) {
      const page = await ctx.newPage();
      const url = `${base}/${locale}${slug ? `/${slug}` : ""}`;
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      const res = await page.goto(url, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (!res || res.status() !== 200) problems.push(`${vp} ${url}: HTTP ${res?.status()}`);
      if (overflow > 1) problems.push(`${vp} ${url}: horizontal overflow ${overflow}px`);
      for (const e of errors) problems.push(`${vp} ${url}: console ${e.slice(0, 200)}`);
      await page.screenshot({ path: `${out}/${vp}-${locale}-${slug || "home"}.png`, fullPage: true });
      await page.close();
    }
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "QA: no problems found");
process.exitCode = problems.length ? 1 : 0;
