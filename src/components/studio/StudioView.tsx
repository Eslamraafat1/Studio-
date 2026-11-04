"use client";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Img from "@/components/ui/Img";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { Parallax, ScrubWords } from "@/components/ui/Motion";
import { useLang } from "@/lib/i18n";
import { registerGsap, useReducedMotion } from "@/lib/motion";
import { achievements, disciplines, history, principles, team } from "@/data/studio";
import ContactCTA from "@/components/home/ContactCTA";

function Timeline() {
  const { t, n } = useLang();
  const line = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !line.current || !root.current) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const tw = gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true } });
    const dots = root.current.querySelectorAll("[data-dot]");
    const sts = Array.from(dots).map((d) => ScrollTrigger.create({ trigger: d, start: "top 65%", onEnter: () => d.classList.add("is-on"), onLeaveBack: () => d.classList.remove("is-on") }));
    return () => { tw.scrollTrigger?.kill(); tw.kill(); sts.forEach((s) => s.kill()); };
  }, [reduced]);
  return (
    <ol ref={root} className="relative ms-3 md:ms-0">
      <div aria-hidden className="absolute inset-y-0 start-0 w-px bg-line md:start-[calc(25%-0.5px)]" />
      <div ref={line} aria-hidden className="absolute inset-y-0 start-0 w-px origin-top bg-copper md:start-[calc(25%-0.5px)]" style={reduced ? undefined : { transform: "scaleY(0)" }} />
      {history.map((h) => (
        <li key={h.year} className="relative grid gap-4 pb-16 ps-8 md:grid-cols-12 md:gap-6 md:pb-24 md:ps-0">
          <span data-dot aria-hidden className="absolute start-0 top-2 size-3 -translate-x-1/2 rounded-full border border-fg bg-bg transition-colors duration-500 [&.is-on]:border-copper [&.is-on]:bg-copper md:start-[25%]" />
          <Reveal className="md:col-span-3 md:text-end md:pe-10"><span className="display text-[clamp(2.4rem,5vw,4.5rem)] leading-none">{n(h.year)}</span></Reveal>
          <Reveal className="md:col-span-6 md:col-start-5 md:ps-6"><h3 className="display text-2xl md:text-3xl">{t(h.title)}</h3><p className="mt-3 max-w-lg text-muted">{t(h.text)}</p></Reveal>
        </li>
      ))}
    </ol>
  );
}

export default function StudioView() {
  const { u, t, n } = useLang();
  return (
    <>
      <section className="container-x pb-16 pt-36 md:pb-28 md:pt-52">
        <SectionHeading as="h1" size="xl" kicker={u("s.kicker")} title={u("s.title")} />
      </section>

      {/* philosophy + editorial image composition */}
      <section className="pb-24 md:pb-40">
        <div className="container-x grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow mb-6 text-muted">{n("01")} — {u("s.philosophy")}</p>
            <ScrubWords text={u("intro.statement")} className="display text-[clamp(1.9rem,4.4vw,4.6rem)] leading-[1.05]" />
            <Reveal className="mt-10 max-w-xl text-lg leading-relaxed text-muted">{u("intro.body")}</Reveal>
          </div>
          <MaskReveal className="relative col-span-12 aspect-[3/4] overflow-hidden bg-alt md:col-span-4 md:col-start-9">
            <div className="absolute inset-0"><Parallax amount={6} className="absolute inset-0"><Img src="/images/studio/workshop-3.jpg" alt={u("s.environment")} fill priority sizes="(min-width:768px) 33vw, 100vw" quality={75} className="img-grade object-cover" /></Parallax></div>
          </MaskReveal>
          <MaskReveal className="relative col-span-8 aspect-[4/3] overflow-hidden bg-alt md:col-span-5 md:col-start-2 md:-mt-32">
            <div className="absolute inset-0"><Img src="/images/studio/workshop-1.jpg" alt="White massing models on a timber table" fill sizes="(min-width:768px) 40vw, 80vw" quality={75} className="img-grade object-cover" /></div>
          </MaskReveal>
          <Reveal className="col-span-12 self-end md:col-span-4 md:col-start-8">
            <ul className="grid gap-6">
              {principles.map((p) => (
                <li key={p.id} className="border-t border-line pt-4"><p className="eyebrow text-copper">{p.no}</p><p className="display mt-1 text-2xl">{t(p.title)}</p></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* history */}
      <section className="border-y border-line bg-surface py-24 md:py-40">
        <div className="container-x">
          <p className="eyebrow mb-14 text-muted md:mb-24">{n("02")} — {u("s.history")}</p>
          <Timeline />
        </div>
      </section>

      {/* team */}
      <section className="py-24 md:py-40">
        <div className="container-x">
          <div className="mb-14 flex flex-col gap-3 md:mb-24"><p className="eyebrow text-muted">{n("03")} — {u("s.team")}</p><p className="eyebrow max-w-xl normal-case text-muted">{u("s.portraitNote")}</p></div>
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 3) * 0.08}>
                <div className="group relative aspect-[4/5] overflow-hidden" style={{ background: m.tone }} aria-hidden>
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 28px)" }} />
                  <span className="display-sans absolute bottom-3 start-4 text-[clamp(5rem,12vw,9rem)] leading-[0.8] text-white/90 transition-transform duration-700 group-hover:-translate-y-2" dir="ltr">{m.initials}</span>
                  <span className="num absolute end-4 top-4 text-sm text-white/70">{n(m.years)}</span>
                </div>
                <h3 className="display mt-5 text-2xl">{m.name}</h3>
                <p className="eyebrow mt-1 text-copper">{t(m.role)}</p>
                <p className="mt-3 text-muted">{t(m.bio)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* disciplines + environment */}
      <section className="bg-alt py-24 md:py-40">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow mb-8 text-muted">{n("04")} — {u("s.disciplines")}</p>
            <ul>
              {disciplines.map((d) => (
                <Reveal as="li" key={d.title.en} className="border-t border-line py-6"><h3 className="display text-3xl">{t(d.title)}</h3><p className="mt-2 max-w-sm text-muted">{t(d.text)}</p></Reveal>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="eyebrow mb-8 text-muted">{n("05")} — {u("s.environment")}</p>
            <MaskReveal className="relative aspect-[4/3] overflow-hidden bg-surface"><div className="absolute inset-0"><Img src="/images/studio/workshop-2.jpg" alt="Site model and massing study in the model shop" fill sizes="(min-width:768px) 50vw, 100vw" quality={75} className="img-grade object-cover" /></div></MaskReveal>
          </div>
        </div>
      </section>

      {/* achievements */}
      <section className="py-24 md:py-40">
        <div className="container-x">
          <p className="eyebrow mb-10 text-muted">{n("06")} — {u("s.achievements")}</p>
          <ul>
            {achievements.map((a) => (
              <Reveal as="li" key={a.year + a.title.en} className="grid gap-2 border-t border-line py-6 md:grid-cols-12 md:gap-6">
                <span className="num text-copper md:col-span-2">{n(a.year)}</span>
                <span className="display text-2xl md:col-span-7 md:text-3xl">{t(a.title)}</span>
                <span className="eyebrow text-muted md:col-span-3 md:text-end">{t(a.org)}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
