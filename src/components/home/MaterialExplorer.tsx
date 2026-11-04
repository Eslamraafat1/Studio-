"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import Img from "@/components/ui/Img";
import TLink from "@/components/ui/TLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { EASE, useReducedMotion } from "@/lib/motion";
import { materials } from "@/data/studio";
import { getProject } from "@/data/projects";

/** Interactive material laboratory — a keyboard-accessible tablist driving an animated specimen view. */
export default function MaterialExplorer({ embedded = false }: { embedded?: boolean }) {
  const { u, t, n } = useLang();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const m = materials[i];

  const select = (next: number, focus = false) => {
    const k = (next + materials.length) % materials.length;
    setDir(k >= i ? 1 : -1);
    setI(k);
    if (focus) tabs.current[k]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); select(i + (e.key === "ArrowRight" && document.dir === "rtl" ? -1 : 1), true); }
    if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); select(i + (e.key === "ArrowLeft" && document.dir === "rtl" ? 1 : -1), true); }
    if (e.key === "Home") { e.preventDefault(); select(0, true); }
    if (e.key === "End") { e.preventDefault(); select(materials.length - 1, true); }
  };

  return (
    <section aria-labelledby="mat-h" className="relative py-24 md:py-40">
      <div className="container-x">
        {!embedded && <SectionHeading no={n("04")} kicker={u("mat.kicker")} title={u("mat.title")} className="mb-14 max-w-4xl md:mb-24" />}

        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {/* selector */}
          <Reveal className="col-span-12 md:col-span-3">
            <p className="eyebrow mb-4 text-muted" id="mat-label">{u("mat.select")}</p>
            <div role="tablist" aria-labelledby="mat-label" aria-orientation="vertical" onKeyDown={onKey} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0">
              {materials.map((x, k) => (
                <button
                  key={x.id}
                  ref={(el) => { tabs.current[k] = el; }}
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={k === i}
                  aria-controls="mat-panel"
                  tabIndex={k === i ? 0 : -1}
                  onClick={() => select(k)}
                  className={`group flex min-h-14 shrink-0 items-center gap-4 border px-4 py-3 text-start transition-colors duration-500 md:border-0 md:border-t md:px-0 ${k === i ? "border-fg text-fg" : "border-line text-muted hover:text-fg"}`}
                >
                  <span aria-hidden className="size-6 shrink-0 rounded-full border border-fg/20 transition-transform duration-500 group-hover:scale-110" style={{ background: x.swatch }} />
                  <span className="num text-xs">{n(`0${k + 1}`)}</span>
                  <span className="display text-xl md:text-2xl">{t(x.name)}</span>
                </button>
              ))}
            </div>
            <p className="eyebrow mt-6 hidden text-muted md:block">{u("mat.note")}</p>
          </Reveal>

          {/* specimen */}
          <div id="mat-panel" role="tabpanel" aria-labelledby={`tab-${m.id}`} className="col-span-12 grid gap-x-6 gap-y-8 md:col-span-9 md:grid-cols-9">
            <div className="relative aspect-[4/3] overflow-hidden bg-alt md:col-span-6">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={m.id}
                  className="absolute inset-0"
                  initial={reduced ? { opacity: 0 } : { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.15 }}
                  animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)", scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0.4, scale: 0.97 }}
                  transition={{ duration: reduced ? 0.2 : 0.9, ease: EASE.cssOut }}
                >
                  <Img src={m.image} alt={`${t(m.name)} — material study`} fill sizes="(min-width:768px) 50vw, 100vw" quality={80} className="img-grade object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className="eyebrow absolute start-4 top-4 bg-bg/90 px-3 py-1.5">{n(`0${i + 1}`)} / {n("05")}</span>
            </div>

            <div className="md:col-span-3" aria-live="polite">
              <motion.div key={m.id} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE.cssOut, delay: 0.15 }}>
                <p className="eyebrow text-copper">{t(m.tagline)}</p>
                <h3 className="display mt-3 text-[clamp(2.2rem,4vw,3.6rem)]">{t(m.name)}</h3>
                <p className="mt-5 leading-relaxed text-muted">{t(m.text)}</p>
              </motion.div>
            </div>

            <div className="md:col-span-9">
              <h4 className="eyebrow mb-5 text-muted">{u("mat.specs")}</h4>
              <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                {m.specs.map((s) => (
                  <div key={t(s.label)} className="border-t border-line pt-3">
                    <dt className="eyebrow text-muted">{t(s.label)}</dt>
                    <dd className="num mt-1 text-lg" dir="ltr">{s.value}</dd>
                    <div className="mt-3 h-[3px] w-full bg-line" aria-hidden>
                      <motion.div key={m.id + t(s.label)} className="h-full origin-left bg-brand rtl:origin-right" initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: s.pct / 100 }} transition={{ duration: 1.1, ease: EASE.cssOut, delay: 0.25 }} />
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="eyebrow text-muted">{u("mat.used")}</span>
                {m.used.map((slug) => {
                  const p = getProject(slug);
                  return p ? (
                    <TLink key={slug} href={`/work/${slug}`} className="eyebrow u-link border border-line px-3 py-2 transition-colors hover:border-fg">{t(p.name)}</TLink>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
