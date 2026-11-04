// Usage: node tools/render/run.mjs <scene> [shot|all]
import http from "http"; import fs from "fs"; import path from "path"; import puppeteer from "puppeteer-core"; import sharp from "sharp";
const root = process.cwd();
const mime = { ".js": "text/javascript", ".html": "text/html", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": mime[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
const OUT = {
  silent: ["projects", "the-silent-house"], horizon: ["projects", "concrete-horizon"], courtyard: ["projects", "the-courtyard"],
  formLight: ["projects", "form-and-light"], desert: ["projects", "desert-frame"], observatory: ["projects", "the-observatory"],
  hero: ["hero", "hero-sculpture"], workshop: ["studio", "workshop"],
};
const [scene, which = "all"] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, protocolTimeout: 600000,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl", "--no-sandbox"] });
const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error") console.log("PAGE:", m.text()); });
async function shotN(n) {
  await page.goto(`http://localhost:${port}/tools/render/index.html?scene=${scene}&shot=${n}`, { waitUntil: "load", timeout: 0 });
  await page.waitForFunction("window.__done", { timeout: 0, polling: 1000 });
  const st = await page.evaluate("window.__done");
  if (st !== "ok") { console.log(scene, n, st); return 0; }
  const [count, alpha, url] = await page.evaluate("[window.__count, window.__alpha, window.__png]");
  const buf = Buffer.from(url.split(",")[1], "base64");
  const [dir, base] = OUT[scene] || (scene.startsWith("mat-") ? ["materials", scene.slice(4)] : ["misc", scene]);
  fs.mkdirSync(`public/images/${dir}`, { recursive: true });
  let img = sharp(buf);
  const meta = await img.metadata();
  const w = Math.round(meta.width / 1.5), h = Math.round(meta.height / 1.5);
  img = img.resize(w, h, { kernel: "lanczos3" });
  if (alpha) { await img.webp({ quality: 88, alphaQuality: 95 }).toFile(`public/images/${dir}/${base}.webp`); console.log("wrote", dir, base); return count; }
  // film grade: gentle desaturation, vignette, grain
  const grain = Buffer.alloc(w * h * 3); for (let i = 0; i < grain.length; i++) grain[i] = 128 + ((Math.random() - 0.5) * 26);
  const vig = Buffer.from(`<svg width="${w}" height="${h}"><defs><radialGradient id="v" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.38"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`);
  const graded = await img.modulate({ saturation: 0.62, brightness: 1.0 }).composite([{ input: vig }, { input: grain, raw: { width: w, height: h, channels: 3 }, blend: "soft-light" }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  const file = which === "all" || base.startsWith("workshop") || dir === "materials" ? `public/images/${dir}/${base}${dir === "materials" ? "" : "-" + (n + 1)}.jpg` : `public/images/${dir}/${base}-${n + 1}.jpg`;
  fs.writeFileSync(file, graded); console.log("wrote", file);
  return count;
}
let count = await shotN(which === "all" ? 0 : +which);
if (which === "all") for (let n = 1; n < count; n++) await shotN(n);
await browser.close(); server.close();
