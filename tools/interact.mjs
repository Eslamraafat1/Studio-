import puppeteer from "puppeteer-core";
const B = "http://localhost:3100";
const ok = (n, c, extra = "") => console.log(c ? "PASS" : "FAIL", n, extra);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"] });
const errs = [];
async function fresh(vp = { width: 1440, height: 900 }, setup) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(vp);
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem("monolith-intro", "1"); } catch {} });
  if (setup) await setup(page);
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) errs.push(m.text()); });
  return page;
}
const click = async (p, sel) => {
  const el = await p.$(sel);
  if (!el) throw new Error("missing " + sel);
  await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  await sleep(250);
  await el.click();
};

// ---- theme + language persistence
{
  const p = await fresh();
  await p.goto(B + "/work", { waitUntil: "networkidle2" });
  await sleep(800);
  const before = await p.evaluate(() => document.documentElement.dataset.theme);
  await click(p, 'button[aria-label*="theme"]');
  await sleep(600);
  const after = await p.evaluate(() => document.documentElement.dataset.theme);
  ok("theme toggles", before !== after, `${before}->${after}`);
  await p.reload({ waitUntil: "networkidle2" });
  await sleep(600);
  ok("theme persists on reload", (await p.evaluate(() => document.documentElement.dataset.theme)) === after);
  await click(p, 'button[lang="ar"]');
  await sleep(600);
  const rtl = await p.evaluate(() => [document.documentElement.dir, document.documentElement.lang, document.querySelector("h1").textContent]);
  ok("language -> Arabic/RTL", rtl[0] === "rtl" && rtl[1] === "ar", rtl.join(" | "));
  await click(p, 'header nav a[href="/studio"]');
  await p.waitForFunction(() => location.pathname === "/studio", { timeout: 8000 });
  await sleep(2500);
  const h1 = await p.evaluate(() => document.querySelector("h1").textContent);
  ok("language persists across routes (page transition)", (await p.evaluate(() => document.documentElement.dir)) === "rtl" && /ممارسة/.test(h1), h1);
  await click(p, 'button[lang="en"]');
  await sleep(500);
  ok("language -> English", (await p.evaluate(() => document.documentElement.dir)) === "ltr");
  await p.close();
}
// ---- mobile menu
{
  const p = await fresh({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.goto(B + "/", { waitUntil: "networkidle2" });
  await sleep(1500);
  await click(p, 'button[aria-controls="mobile-nav"]');
  await sleep(1200);
  ok("mobile menu opens (dialog)", !!(await p.$('#mobile-nav[role="dialog"]')));
  ok("scroll locked while open", (await p.evaluate(() => document.documentElement.style.overflow)) === "hidden");
  await p.keyboard.press("Escape");
  await sleep(1200);
  ok("Escape closes menu", !(await p.$("#mobile-nav")));
  await click(p, 'button[aria-controls="mobile-nav"]');
  await sleep(1200);
  await click(p, '#mobile-nav a[href="/contact"]');
  await p.waitForFunction(() => location.pathname === "/contact", { timeout: 8000 });
  ok("mobile nav link navigates", true);
  await p.close();
}
// ---- material explorer
{
  const p = await fresh();
  await p.goto(B + "/", { waitUntil: "networkidle2" });
  await sleep(1200);
  await click(p, "#tab-timber");
  await sleep(1200);
  const t = await p.evaluate(() => [document.querySelector('[role="tab"][aria-selected="true"]').id, document.querySelector('[role="tabpanel"] h3').textContent]);
  ok("material tab switches panel", t[0] === "tab-timber" && /Timber/i.test(t[1]), t.join(" | "));
  await p.keyboard.press("ArrowDown");
  await sleep(900);
  ok("arrow-key nav in tablist", (await p.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]').id)) === "tab-glass");
  await p.close();
}
// ---- project: lightbox + floor plan + prev/next
{
  const p = await fresh();
  await p.goto(B + "/work/the-courtyard", { waitUntil: "networkidle2" });
  await sleep(1500);
  await click(p, "figure button");
  await sleep(900);
  ok("lightbox opens", !!(await p.$('[role="dialog"][aria-modal="true"]')));
  const i0 = await p.evaluate(() => document.querySelector('[role="dialog"] p.num').textContent);
  await p.keyboard.press("ArrowRight");
  await sleep(700);
  const i1 = await p.evaluate(() => document.querySelector('[role="dialog"] p.num').textContent);
  ok("lightbox next via keyboard", i0 !== i1, `${i0} -> ${i1}`);
  await p.keyboard.press("Escape");
  await sleep(700);
  ok("lightbox closes with Esc", !(await p.$('[role="dialog"]')));
  const room = await p.$('svg path[role="button"]');
  await room.evaluate((e) => e.scrollIntoView({ block: "center" }));
  await sleep(400);
  await room.hover();
  await sleep(500);
  const h = await p.evaluate(() => document.querySelector('[aria-live="polite"] h3')?.textContent);
  ok("floor plan hover reveals room", !!h, h);
  await click(p, 'nav[aria-label="Project navigation"] a:last-child');
  await p.waitForFunction(() => location.pathname !== "/work/the-courtyard", { timeout: 8000 });
  ok("next project navigation", /form-and-light/.test(await p.evaluate(() => location.pathname)));
  await p.close();
}
// ---- work filter
{
  const p = await fresh();
  await p.goto(B + "/work", { waitUntil: "networkidle2" });
  await sleep(1200);
  const all = await p.$$eval("section[aria-live] article", (a) => a.length);
  const btn = (await p.$$('div[role="group"] button'))[2];
  await btn.click();
  await sleep(1200);
  const some = await p.$$eval("section[aria-live] article", (a) => a.length);
  ok("project filter narrows list", some > 0 && some < all, `${all} -> ${some}`);
  await p.close();
}
// ---- contact form
{
  const p = await fresh();
  await p.goto(B + "/contact", { waitUntil: "networkidle2" });
  await sleep(1000);
  await click(p, 'button[type="submit"]');
  await sleep(500);
  const nErr = await p.$$eval('[aria-invalid="true"]', (e) => e.length);
  ok("validation flags empty required fields", nErr >= 6, String(nErr));
  const focused = await p.evaluate(() => document.activeElement?.id);
  ok("focus moves to first invalid field", /name$/.test(focused || ""), focused);
  await p.type('input[name="name"]', "Test Person");
  await p.type('input[name="email"]', "bad-email");
  await p.$eval('input[name="email"]', (e) => e.blur());
  await sleep(300);
  ok("invalid email flagged", !!(await p.$('input[name="email"][aria-invalid="true"]')));
  await p.$eval('input[name="email"]', (e) => e.focus());
  await p.keyboard.down("Control");
  await p.keyboard.press("KeyA");
  await p.keyboard.up("Control");
  await p.type('input[name="email"]', "test@example.com");
  await p.type('input[name="location"]', "Lisbon");
  await p.select('select[name="type"]', "cultural");
  await p.select('select[name="budget"]', "c.b2");
  await p.type('textarea[name="description"]', "A small public observatory on a hill overlooking the river, with a school programme.");
  await click(p, 'button[type="submit"]');
  await sleep(300);
  ok("loading state shown", (await p.evaluate(() => document.querySelector("form")?.getAttribute("aria-busy"))) === "true");
  await sleep(1800);
  const done = await p.evaluate(() => document.querySelector('[role="status"]')?.textContent || "");
  ok("success confirmation (demo mode, honest)", /demo/i.test(done) && /nothing was sent/i.test(done), done.slice(0, 60));
  await p.close();
}
// ---- journal share/copy + reading progress
{
  const p = await fresh();
  await p.goto(B + "/journal/the-poetry-of-concrete", { waitUntil: "networkidle2" });
  await sleep(1200);
  await p.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve() }, configurable: true }); });
  await click(p, 'div[role="group"] button.eyebrow');
  await sleep(500);
  ok("copy link feedback", /copied/i.test(await p.evaluate(() => document.querySelector('div[role="group"]').textContent)));
  const bar = await p.evaluate(() => document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"));
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
  await sleep(700);
  const bar2 = await p.evaluate(() => document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"));
  ok("reading progress advances", Number(bar2) > Number(bar), `${bar} -> ${bar2}`);
  await p.close();
}
// ---- reduced motion
{
  const p = await fresh({ width: 1440, height: 900 }, (pg) => pg.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]));
  await p.goto(B + "/", { waitUntil: "networkidle2" });
  await sleep(1500);
  const r = await p.evaluate(() => ({ anim: document.documentElement.classList.contains("anim"), introEl: !!document.querySelector('[role="status"]'), hidden: [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length }));
  ok("reduced motion: no intro, nothing hidden by default", !r.anim && !r.introEl && r.hidden === 0, JSON.stringify(r));
  await p.close();
}
console.log("console/page errors:", errs.length, errs.slice(0, 5));
await browser.close();
