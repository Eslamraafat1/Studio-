// Usage: node tools/with-server.mjs <script.mjs> [args...]  — starts `next start` on :3100, runs the script, stops the server.
import { spawn, spawnSync } from "node:child_process";
const [script, ...args] = process.argv.slice(2);
const srv = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3100"], { stdio: "ignore" });
for (let i = 0; i < 60; i++) { try { const r = await fetch("http://localhost:3100/"); if (r.ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
const r = spawnSync(process.execPath, [script, ...args], { stdio: "inherit" });
srv.kill();
process.exit(r.status ?? 0);
