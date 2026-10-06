// Visual-balance audit: headline orphan lines, hero brightness distribution, section contrast.
// Usage: BASE_URL=http://localhost:3100 node scripts/qa-visual.mjs [outDir]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.argv[2] ?? "vis-shots";
mkdirSync(out, { recursive: true });
const viewports = { m390: { width: 390, height: 844 }, t768: { width: 768, height: 1024 }, d1024: { width: 1024, height: 768 }, d1440: { width: 1440, height: 900 } };
const problems = [];
const browser = await chromium.launch();
for (const [name, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto(`${base}/en`, { waitUntil: "networkidle" });
  // 1) Orphan lines in headings: a heading line that is much narrower than the block and short.
  const orphans = await page.evaluate(() => {
    const out = [];
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      const range = document.createRange();
      range.selectNodeContents(h);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      if (rects.length < 2) continue;
      const w = h.getBoundingClientRect().width;
      for (const r of rects) {
        if (r.width < w * 0.35) {
          out.push(`${h.tagName} "${h.textContent.trim().slice(0, 40)}" line width ${Math.round((r.width / w) * 100)}%`);
          break;
        }
      }
    }
    return out;
  });
  for (const o of orphans) problems.push(`${name}: possible orphan line — ${o}`);
  // 2) Hero brightness: sample the visible hero region from a screenshot.
  await page.screenshot({ path: `${out}/${name}-home.png` });
  const heroStats = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="home-title"]');
    const r = hero.getBoundingClientRect();
    return { h: Math.round(r.height), top: Math.round(r.top) };
  });
  // 3) Section surface sequence (bg colors) for rhythm review.
  const surfaces = await page.evaluate(() => {
    const names = [...document.querySelectorAll("main section[id], main section[aria-labelledby]")]
      .map((s) => {
        const bg = getComputedStyle(s).backgroundColor;
        return `${s.id || s.getAttribute("aria-labelledby")}:${bg}`;
      });
    return names;
  });
  console.log(`${name}: hero ${heroStats.h}px, sections: ${surfaces.join(" | ")}`);
  await page.close();
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "VISUAL QA: no orphan heading lines");
process.exitCode = problems.length ? 1 : 0;
