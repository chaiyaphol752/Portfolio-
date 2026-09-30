// Functional smoke test against a running server: BASE_URL=http://localhost:3100 node scripts/e2e.mjs
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1366, height: 820 }, locale: "de-DE" });
const p = await ctx.newPage();
const results = [];
const check = async (name, fn) => { try { await fn(); results.push(`PASS ${name}`); } catch (e) { results.push(`FAIL ${name}: ${String(e.message).split("\n")[0]}`); } };
const assert = (c, m) => { if (!c) throw new Error(m); };

await check("root redirects by Accept-Language (de)", async () => { await p.goto(`${base}/about`); assert(p.url().endsWith("/de/about"), p.url()); });
await check("language switch keeps page", async () => { await p.goto(`${base}/en/skills`); await p.getByRole("link", { name: "ไทย" }).first().click(); await p.waitForURL("**/th/skills"); assert((await p.locator("html").getAttribute("lang")) === "th", "lang attr"); });
await check("unknown route -> 404 page", async () => { const r = await p.goto(`${base}/en/nope`); assert(r.status() === 404, `status ${r.status()}`); });
await check("palette opens with Ctrl+K and navigates", async () => { await p.goto(`${base}/en`); await p.keyboard.press("Control+k"); await p.getByRole("combobox").fill("lab"); await p.keyboard.press("Enter"); await p.waitForURL("**/en/lab"); });
await check("mobile menu lists 9 pages", async () => { await p.setViewportSize({ width: 360, height: 780 }); await p.goto(`${base}/en`); await p.getByRole("button", { name: /menu/i }).click(); assert((await p.locator("dialog[open] ol li").count()) === 9, "count"); await p.keyboard.press("Escape"); await p.setViewportSize({ width: 1366, height: 820 }); });
await check("project search filters", async () => { await p.goto(`${base}/en/projects`); await p.getByRole("searchbox").or(p.locator("input[type=search], input[type=text]").first()).first().fill("zzzzqq"); await p.waitForTimeout(400); const t = await p.locator("main").innerText(); assert(/0 of 8|no project|No project/i.test(t), "no empty state"); });
await check("lab JSON inspector flags invalid JSON", async () => { await p.goto(`${base}/en/lab`); const ta = p.locator("textarea").first(); await ta.fill('{"a": }'); await p.waitForTimeout(400); assert(/invalid|line 1/i.test(await p.locator("main").innerText()), "no error shown"); });
await check("terminal runs `skills`", async () => { await p.goto(`${base}/en/command-center`); const input = p.locator('input[maxlength="120"]'); await input.fill("skills"); await input.press("Enter"); await p.waitForTimeout(300); assert(/React|Next\.js/i.test(await p.locator("main").innerText()), "no output"); });
await check("terminal rejects shell commands safely", async () => { const input = p.locator('input[maxlength="120"]'); await input.fill("rm -rf /"); await input.press("Enter"); await p.waitForTimeout(300); assert(/unknown|not found|help/i.test(await p.locator("main").innerText()), "no rejection"); });
await check("contact form: client validation errors", async () => { await p.goto(`${base}/en/systems`); await p.getByRole("button", { name: /send message/i }).click(); await p.waitForTimeout(300); assert((await p.locator('[aria-invalid="true"]').count()) >= 3, "no invalid fields"); });
await check("contact form: server path returns honest state without backend", async () => { await p.goto(`${base}/en/systems`); await p.getByLabel(/^name/i).fill("Test Person"); await p.getByLabel(/^email/i).fill("test@example.com"); await p.getByLabel(/project type/i).selectOption({ index: 1 }); await p.getByLabel(/^message/i).fill("This is an automated smoke test message for validation."); await p.getByRole("checkbox").check(); await p.getByRole("button", { name: /send message/i }).click(); await p.waitForTimeout(1500); const t = await p.locator("#contact").innerText(); assert(/unavailable|not available|couldn|try again|sent|thank/i.test(t), t.slice(-200)); });
await check("/api/health ok", async () => { const r = await p.request.get(`${base}/api/health`); assert(r.ok(), "status"); });
await check("sitemap + robots", async () => { assert((await (await p.request.get(`${base}/sitemap.xml`)).text()).includes("/th/command-center"), "sitemap"); assert((await (await p.request.get(`${base}/robots.txt`)).text()).includes("Sitemap"), "robots"); });
console.log(results.join("\n")); await b.close(); process.exitCode = results.some((r) => r.startsWith("FAIL")) ? 1 : 0;
