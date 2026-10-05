// Dark-mode audit: flags light surfaces and low-contrast text across pages/viewports.
// Usage: BASE_URL=http://localhost:3100 node scripts/qa-dark.mjs
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const slugs = ["", "projects", "capabilities", "ai-native", "case-studies", "lab", "systems", "command-center", "about", "contact"];
const viewports = { phone: { width: 360, height: 780 }, tablet: { width: 768, height: 1024 }, laptop: { width: 1366, height: 820 } };

const browser = await chromium.launch();
const problems = [];
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp });
  for (const slug of slugs) {
    const page = await ctx.newPage();
    await page.goto(`${base}/en${slug ? `/${slug}` : ""}`, { waitUntil: "networkidle" });
    const report = await page.evaluate(() => {
      const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const parse = (c) => { const m = c.match(/(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/); return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null; };
      const contrast = (a, b) => { const l1 = lum(...a), l2 = lum(...b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };
      const effBg = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n);
          if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") { const c = parse(cs.backgroundColor); if (c) return c; }
          n = n.parentElement;
        }
        return [12, 14, 19];
      };
      const out = { lightSurfaces: [], lowContrast: [], scheme: getComputedStyle(document.documentElement).colorScheme };
      const seen = new Set();
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("svg, [aria-hidden=true], dialog:not([open])")) continue;
        if (seen.has(el)) continue; seen.add(el);
        const cs = getComputedStyle(el);
        if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") {
          const c = parse(cs.backgroundColor);
          if (c && lum(...c) > 0.8) out.lightSurfaces.push(`${el.tagName.toLowerCase()}${String(el.className).split(" ")[0] ? "." + String(el.className).split(" ")[0] : ""} ${cs.backgroundColor}`);
        }
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || cs.display === "none" || cs.visibility === "hidden") continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!ownText) continue;
        const fg = parse(cs.color);
        if (!fg) continue;
        const ratio = contrast(fg, effBg(el));
        const size = parseFloat(cs.fontSize);
        // Flag body-sized text under WCAG AA for normal text (4.5); large text threshold 3.
        const min = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700) ? 3 : 4.5;
        if (ratio < min && out.lowContrast.length < 10) {
          out.lowContrast.push(`${(el.textContent || "").trim().slice(0, 34)} | ${cs.color} on ${getComputedStyle(effBg === el.parentElement ? el : el).backgroundColor} ratio=${ratio.toFixed(2)}`);
        }
      }
      return out;
    });
    if (report.scheme !== "dark") problems.push(`${vpName} ${slug || "home"}: color-scheme=${report.scheme}`);
    for (const s of report.lightSurfaces.slice(0, 5)) problems.push(`${vpName} ${slug || "home"}: LIGHT SURFACE ${s}`);
    for (const t of report.lowContrast.slice(0, 5)) problems.push(`${vpName} ${slug || "home"}: LOW CONTRAST ${t}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "DARK QA: no light surfaces or low-contrast text found");
process.exitCode = problems.length ? 1 : 0;
