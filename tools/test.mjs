import puppeteer from "puppeteer-core";
const BASE = "http://localhost:3100";
const OUT = process.env.TEMP + "/shots";
const routes = ["/", "/work", "/work/the-silent-house", "/work/concrete-horizon", "/work/the-courtyard", "/work/form-and-light", "/work/desert-frame", "/work/the-observatory", "/studio", "/approach", "/journal", "/journal/the-poetry-of-concrete", "/contact", "/nope"];
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"] });
const vp = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const [which = "desktop", lang = "en", theme = "light", only] = process.argv.slice(2);
const page = await browser.newPage();
await page.setViewport(vp[which]);
await page.evaluateOnNewDocument((lang, theme) => { try { localStorage.setItem("monolith-lang", lang); localStorage.setItem("monolith-theme", theme); } catch {} }, lang, theme);
const errors = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(`[${m.type()}] ${m.text().slice(0, 300)}`); });
page.on("pageerror", (e) => errors.push("[pageerror] " + e.message));
page.on("requestfailed", (r) => errors.push("[reqfail] " + r.url()));
page.on("response", (r) => { if (r.status() >= 400) errors.push(`[http ${r.status()}] ${r.url()}`); });
for (const r of (only ? [only] : routes)) {
  errors.length = 0;
  await page.goto(BASE + r, { waitUntil: "networkidle2", timeout: 90000 }).catch((e) => errors.push("[goto] " + e.message));
  await new Promise((s) => setTimeout(s, r === "/" ? 6500 : 1800));
  // scroll through to trigger lazy images/reveals
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); });
  await new Promise((s) => setTimeout(s, 800));
  const info = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    dir: document.documentElement.dir, theme: document.documentElement.dataset.theme, h1: document.querySelector("h1")?.textContent?.slice(0, 50),
  }));
  const name = r === "/" ? "home" : r.replace(/\//g, "_");
  await page.screenshot({ path: `${OUT}/${which}-${lang}-${theme}${name}.png` });
  console.log(r, JSON.stringify(info), errors.length ? "\n   " + [...new Set(errors)].join("\n   ") : "");
}
await browser.close();
