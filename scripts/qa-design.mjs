// Design-system audit: measures type scale, hero composition, rhythm, radius discipline,
// accent usage and overflow against the design brief. BASE_URL=... node scripts/qa-design.mjs
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const viewports = { m390: { width: 390, height: 844 }, t768: { width: 768, height: 1024 }, d1024: { width: 1024, height: 768 }, d1440: { width: 1440, height: 900 } };

const browser = await chromium.launch();
for (const [name, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto(`${base}/en`, { waitUntil: "networkidle" });
  const m = await page.evaluate(() => {
    const px = (v) => `${Math.round(v)}px`;
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const h1 = document.querySelector("h1");
    const hero = document.querySelector('section[aria-labelledby="home-title"]');
    const h2s = [...document.querySelectorAll("h2")];
    const sections = [...document.querySelectorAll("main > section, main > * > section, main > article")].filter((s) => s.offsetParent !== null);
    const r = {
      h1: h1 ? { size: px(parseFloat(cs(h1).fontSize)), lh: cs(h1).lineHeight, ls: cs(h1).letterSpacing, text: h1.textContent.trim().slice(0, 60) } : null,
      heroH: hero ? px(hero.getBoundingClientRect().height) : null,
      vpH: px(innerHeight),
      h2: h2s.slice(0, 4).map((h) => px(parseFloat(cs(h).fontSize))),
      sectionPads: sections.slice(0, 4).map((s) => `${px(s.getBoundingClientRect().height)}`),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      buttons: [...document.querySelectorAll("main .btn, main a[href], main button")]
        .slice(0, 40)
        .map((b) => {
          const c = cs(b);
          return { r: c.borderRadius, h: px(b.getBoundingClientRect().height) };
        }),
      accentText: document.querySelectorAll("main [class*='text-accent'], main [class*='bg-accent']").length,
      lede: document.querySelector(".lede") ? { size: px(parseFloat(cs(document.querySelector(".lede")).fontSize)), w: px(document.querySelector(".lede").getBoundingClientRect().width) } : null,
      body: px(parseFloat(cs(document.body).fontSize)),
    };
    return r;
  });
  console.log(`\n== ${name} (${vp.width}x${vp.height}) ==`);
  console.log(`h1: ${m.h1?.size} / lh ${m.h1?.lh} / ls ${m.h1?.ls} | "${m.h1?.text}"`);
  console.log(`hero height ${m.heroH} of viewport ${m.vpH}`);
  console.log(`h2 sizes: ${m.h2.join(", ")}`);
  console.log(`section heights: ${m.sectionPads.join(", ")}`);
  console.log(`lede: ${m.lede?.size} @ width ${m.lede?.w}`);
  console.log(`body: ${m.body}, overflow: ${m.overflow}px, accentText els: ${m.accentText}`);
  const radii = {};
  for (const b of m.buttons) radii[b.r] = (radii[b.r] ?? 0) + 1;
  console.log(`interactive radius histogram: ${JSON.stringify(radii)}`);
  const small = m.buttons.filter((b) => b.h.replace("px", "") < 44).length;
  console.log(`interactive elements <44px tall: ${small}/${m.buttons.length}`);
  await page.close();
  await ctx.close();
}
await browser.close();
