"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Img from "@/components/ui/Img";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import ContactCTA from "@/components/home/ContactCTA";
import { useLang } from "@/lib/i18n";
import { EASE, useIsSmall, useReducedMotion } from "@/lib/motion";
import { stages } from "@/data/studio";

/** Four-stage methodology. Desktop: sticky stage visual that follows the scrolling copy. Mobile: stacked. */
export default function ProcessStages() {
  const { u, t, ta, n } = useLang();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const small = useIsSmall();
  const reduced = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => refs.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  const s = stages[active];

  return (
    <>
      <section className="container-x pb-16 pt-36 md:pb-28 md:pt-52">
        <SectionHeading as="h1" size="xl" kicker={u("a.kicker")} title={u("a.title")} />
        <Reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">{u("a.intro")}</Reveal>
      </section>

      <section className="relative pb-24 md:pb-40">
        <div className="container-x grid gap-x-10 md:grid-cols-12">
          {/* sticky visual (desktop) */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-28 flex h-[calc(100svh-8rem)] flex-col gap-6">
              <nav aria-label={u("a.stage")} className="flex gap-2">
                {stages.map((x, i) => (
                  <button key={x.id} type="button" onClick={() => jump(i)} aria-current={i === active ? "step" : undefined} className={`eyebrow min-h-11 flex-1 border-t-2 pt-3 text-start transition-colors duration-500 ${i === active ? "border-fg text-fg" : "border-line text-muted hover:text-fg"}`}>
                    <span className="num">{n(x.no)}</span> <span className="hidden lg:inline">{t(x.title)}</span>
                  </button>
                ))}
              </nav>
              <div className="relative flex-1 overflow-hidden bg-alt">
                <AnimatePresence initial={false}>
                  <motion.div key={s.id} className="absolute inset-0" initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }} animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 1 }} transition={{ duration: 0.9, ease: EASE.cssInOut }}>
                    <Img src={s.image} alt={t(s.alt)} fill sizes="40vw" quality={78} className="img-grade object-cover" />
                  </motion.div>
                </AnimatePresence>
                <span className="display-sans absolute bottom-3 start-5 z-10 text-[clamp(6rem,13vw,12rem)] leading-[0.8] text-white mix-blend-difference" dir="ltr">{n(s.no)}</span>
              </div>
            </div>
          </div>

          {/* copy */}
          <div className="md:col-span-7">
            {stages.map((x, i) => (
              <article key={x.id} ref={(el) => { refs.current[i] = el; }} data-i={i} className="flex flex-col justify-center border-t border-line py-14 md:min-h-[92svh] md:py-24">
                {small && (
                  <div className="relative mb-8 aspect-[4/3] overflow-hidden bg-alt"><Img src={x.image} alt={t(x.alt)} fill sizes="100vw" quality={70} className="img-grade object-cover" /></div>
                )}
                <p className="eyebrow text-copper">{u("a.stage")} {n(x.no)} · {t(x.duration)}</p>
                <h2 className="display mt-3 text-[clamp(2.8rem,6vw,6rem)]">{t(x.title)}</h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t(x.summary)}</p>
                <div className="mt-10 grid gap-10 sm:grid-cols-2">
                  <div>
                    <h3 className="eyebrow mb-4 text-muted">{u("a.activities")}</h3>
                    <ul>{ta(x.activities).map((a) => <li key={a} className="border-t border-line py-3">{a}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="eyebrow mb-4 text-muted">{u("a.deliverables")}</h3>
                    <ul>{ta(x.deliverables).map((a) => <li key={a} className="flex items-center gap-3 border-t border-line py-3"><span aria-hidden className="size-1.5 bg-copper" />{a}</li>)}</ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
