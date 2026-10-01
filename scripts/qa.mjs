// Visual + smoke QA: screenshots every page/locale/viewport and reports console errors and horizontal overflow.
// Usage: BASE_URL=http://localhost:3000 node scripts/qa.mjs [outDir] [locales] [viewports]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "qa-shots";
const locales = (process.argv[3] ?? "en,de,th").split(",");
const slugs = ["", "projects", "capabilities", "ai-native", "case-studies", "lab", "systems", "command-center", "operator", "about", "contact"];
const all = {
  w320: { width: 320, height: 720 },
  phone: { width: 360, height: 780 },
  w375: { width: 375, height: 812 },
  w390: { width: 390, height: 844 },
  w412: { width: 412, height: 915 },
  w430: { width: 430, height: 932 },
  tablet: { width: 768, height: 1024 },
  w1024: { width: 1024, height: 768 },
  w1280: { width: 1280, height: 800 },
  laptop: { width: 1366, height: 820 },
  w1440: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
};
const wanted = (process.argv[4] ?? "phone,tablet,laptop,wide").split(",");
for (const vp of wanted) if (!all[vp]) throw new Error(`unknown viewport ${vp}; use ${Object.keys(all).join(", ")}`);
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
      if (all[vp].width < 768 && process.env.QA_STRICT) {
        const audit = await page.evaluate(() => {
          const out = { tiny: [], targets: [] };
          for (const el of document.querySelectorAll("main *")) {
            const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
            if (!r.width || cs.visibility === "hidden" || cs.display === "none") continue;
            if (el.closest("[aria-hidden=true], svg, .sr-only")) continue;
            const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            if (ownText && parseFloat(cs.fontSize) < 11) out.tiny.push(`${el.tagName.toLowerCase()} ${parseFloat(cs.fontSize)}px "${el.textContent.trim().slice(0, 30)}"`);
            if (el.matches("button, a[href], [role=button], [role=tab], select, input:not([type=hidden])") && (r.height < 32 || r.width < 32)) out.targets.push(`${el.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24)}"`);
          }
          return { tiny: out.tiny.slice(0, 5), targets: out.targets.slice(0, 5), tinyCount: out.tiny.length, targetCount: out.targets.length };
        });
        if (audit.tinyCount) problems.push(`${vp} ${url}: ${audit.tinyCount} text nodes <11px e.g. ${audit.tiny.join(" | ")}`);
        if (audit.targetCount) problems.push(`${vp} ${url}: ${audit.targetCount} tap targets <32px e.g. ${audit.targets.join(" | ")}`);
      }
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
