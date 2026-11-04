import puppeteer from "puppeteer-core";
const [routeArg = "home", which = "desktop", lang = "en", theme = "light", ...ys] = process.argv.slice(2);
const route = routeArg === "home" ? "/" : routeArg;
const vp = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } }[which];
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport(vp);
await page.evaluateOnNewDocument((l, t) => { try { localStorage.setItem("monolith-lang", l); localStorage.setItem("monolith-theme", t); sessionStorage.setItem("monolith-intro", "1"); } catch {} }, lang, theme);
await page.goto("http://localhost:3100" + route, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((s) => setTimeout(s, 3500));
const H = await page.evaluate(() => document.documentElement.scrollHeight);
console.log("height", H);
for (const y of ys) {
  const yy = Number(y);
  // step toward target so scroll-triggered reveals fire
  await page.evaluate(async (yy) => { const cur = window.scrollY; const n = 6; for (let i = 1; i <= n; i++) { window.scrollTo(0, cur + ((yy - cur) * i) / n); await new Promise((r) => setTimeout(r, 120)); } }, yy);
  await new Promise((s) => setTimeout(s, 1800));
  await page.screenshot({ path: `${process.env.TEMP}/shots/s-${which}-${lang}-${theme}-${route.replace(/\//g, "_")}-${y}.png` });
}
await browser.close();
