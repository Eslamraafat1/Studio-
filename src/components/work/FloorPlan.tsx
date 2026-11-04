"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Project } from "@/data/projects";

/** Interactive SVG plan: hover, focus or tap a room to read its function and area. */
export default function FloorPlan({ project: p }: { project: Project }) {
  const { t, u, n } = useLang();
  const [active, setActive] = useState<string | null>(null);
  const room = p.plan.rooms.find((r) => r.id === active) ?? null;
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="relative border border-line bg-surface md:col-span-8">
        <svg viewBox="0 0 400 260" className="block h-auto w-full" role="group" aria-label={`${u("p.plan")} — ${t(p.name)}`} onMouseLeave={() => setActive(null)}>
          <defs>
            <pattern id={`pg-${p.slug}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="var(--fg)" strokeOpacity=".07" /></pattern>
          </defs>
          <rect width="400" height="260" fill={`url(#pg-${p.slug})`} />
          {p.plan.rooms.map((r) => {
            const on = r.id === active;
            return (
              <g key={r.id}>
                <path
                  d={r.d}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t(r.name)}, ${r.area}`}
                  aria-pressed={on}
                  onMouseEnter={() => setActive(r.id)}
                  onFocus={() => setActive(r.id)}
                  onClick={() => setActive(on ? null : r.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(on ? null : r.id); } }}
                  style={{ fill: on ? p.accent : "var(--bg)", fillOpacity: on ? 0.9 : 0.55, stroke: "var(--fg)", strokeWidth: on ? 2.2 : 1.4, transition: "fill .4s, fill-opacity .4s, stroke-width .3s", cursor: "pointer", outlineOffset: 2 }}
                />
                <text x={r.lx} y={r.ly} textAnchor="middle" style={{ fontFamily: "var(--font-tech), monospace", fontSize: 7.2, letterSpacing: ".06em", fill: on ? "#f5f3ee" : "var(--fg)", pointerEvents: "none", textTransform: "uppercase" }}>
                  {t(r.name).length > 20 ? t(r.name).slice(0, 19) + "…" : t(r.name)}
                </text>
              </g>
            );
          })}
          {/* north arrow + scale bar */}
          <g transform="translate(372 30)" style={{ fill: "none", stroke: "var(--fg)", strokeWidth: 1 }}><circle r="11" /><path d="M0 -8 L4 6 L0 3 L-4 6z" style={{ fill: "var(--fg)" }} /></g>
          <g transform="translate(18 244)" style={{ stroke: "var(--fg)", strokeWidth: 1.2 }}><path d="M0 0H60M0 -3V3M30 -3V3M60 -3V3" /><text x="0" y="-6" style={{ fill: "var(--fg)", stroke: "none", fontSize: 6, fontFamily: "var(--font-tech), monospace" }}>0 — 10 — 20 m</text></g>
        </svg>
        <p className="eyebrow border-t border-line px-4 py-3 text-muted">{t(p.plan.title)}</p>
      </div>
      <div className="md:col-span-4" aria-live="polite">
        <p className="eyebrow mb-4 text-muted">{room ? u("p.area") + " · " + n(room.area) : u("p.planHint")}</p>
        {room ? (
          <>
            <h3 className="display text-[clamp(2rem,3.4vw,3rem)]">{t(room.name)}</h3>
            <p className="mt-4 max-w-sm text-muted">{t(room.fn)}</p>
          </>
        ) : (
          <ul className="flex flex-col">
            {p.plan.rooms.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => setActive(r.id)} onMouseEnter={() => setActive(r.id)} className="flex w-full items-center justify-between gap-4 border-t border-line py-3 text-start transition-colors hover:text-copper">
                  <span>{t(r.name)}</span>
                  <span className="num text-sm text-muted">{n(r.area)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
