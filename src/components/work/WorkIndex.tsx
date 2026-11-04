"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";
import ProjectCard, { type CardVariant } from "./ProjectCard";
import { categories, projects, type Category } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// repeating asymmetric rhythm so no two neighbours match
const RHYTHM: { v: CardVariant; cls: string }[] = [
  { v: "full", cls: "md:col-span-12" },
  { v: "tall", cls: "md:col-span-5" },
  { v: "landscape", cls: "md:col-span-6 md:col-start-7 md:mt-[16vw]" },
  { v: "landscape", cls: "md:col-span-7" },
  { v: "tall", cls: "md:col-span-4 md:col-start-9" },
  { v: "wide", cls: "md:col-span-12" },
];

export default function WorkIndex() {
  const { u, t, n } = useLang();
  const [cat, setCat] = useState<Category | "all">("all");
  const list = cat === "all" ? projects : projects.filter((p) => p.category === cat);
  return (
    <>
      <section className="container-x pb-12 pt-36 md:pb-20 md:pt-52">
        <SectionHeading as="h1" size="xl" no={n(String(projects.length).padStart(2, "0"))} kicker={u("works.count")} title={u("works.kicker")} />
        <Reveal className="mt-12 flex flex-wrap items-center gap-2" >
          <div role="group" aria-label={u("works.filter")} className="flex flex-wrap gap-2">
            {[{ id: "all" as const, label: u("works.cat.all") }, ...categories.map((c) => ({ id: c.id, label: t(c.label) }))].map((c) => (
              <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={cn("eyebrow min-h-11 border px-4 py-2 transition-colors duration-500", cat === c.id ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-live="polite" className="container-x pb-24 md:pb-40">
        <motion.div layout className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-24">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => {
              const r = RHYTHM[i % RHYTHM.length];
              return (
                <motion.div key={p.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.7, ease: EASE.cssOut }} className={cn("col-span-12", cat === "all" ? r.cls : "md:col-span-6")}>
                  <ProjectCard project={p} variant={cat === "all" ? r.v : "landscape"} priority={i === 0} sizes={cat === "all" && r.v === "full" ? "100vw" : "(min-width:768px) 50vw, 100vw"} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="py-24 text-center text-muted">{u("works.empty")}</p>}
      </section>

      {/* index list — a second, typographic way into the work */}
      <section className="border-t border-line py-20 md:py-32" aria-label={u("works.all")}>
        <div className="container-x">
          <ul>
            {projects.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <TLink href={`/work/${p.slug}`} data-cursor={u("works.view")} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 md:grid-cols-[5rem_1fr_14rem_8rem_6rem] md:py-7">
                  <span className="num text-sm text-muted">{n(p.no)}</span>
                  <span className="display text-[clamp(1.6rem,4.4vw,4.2rem)] leading-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 rtl:group-hover:-translate-x-3">{t(p.name)}</span>
                  <span className="eyebrow hidden text-muted md:block">{t(p.location)}</span>
                  <span className="eyebrow hidden text-muted md:block">{t(p.categoryLabel)}</span>
                  <span className="num text-sm text-muted md:text-end">{n(p.year)}</span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
