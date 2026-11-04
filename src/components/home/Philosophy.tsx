"use client";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Img from "@/components/ui/Img";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { registerGsap, useReducedMotion } from "@/lib/motion";
import { principles } from "@/data/studio";

/* Three principles — each with its own visual device:
   I   concrete plate with tie-hole grid (material)
   II  slatted shadow that sweeps as you scroll (light)
   III a scale figure drawn against a door and steps (human)          */

function Material() {
  return (
    <MaskReveal className="relative aspect-[4/5] overflow-hidden bg-alt md:aspect-[5/6]">
      <div className="absolute inset-0">
        <Img src="/images/materials/concrete.jpg" alt="Board-marked concrete wall with tie holes" fill sizes="(min-width:768px) 50vw, 100vw" quality={75} className="img-grade object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,.35) 2px, transparent 3px)", backgroundSize: "25% 33.33%", backgroundPosition: "12.5% 16.6%" }} />
        <span className="eyebrow absolute bottom-4 start-4 bg-bg/90 px-3 py-1.5 text-fg">Ø 25 mm · 600 c/c</span>
      </div>
    </MaskReveal>
  );
}

function Light() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const { gsap } = registerGsap();
    const tw = gsap.fromTo(el, { "--sweep": "-30%" }, { "--sweep": "30%", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [reduced]);
  return (
    <MaskReveal className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
      <div ref={ref} className="absolute inset-0 bg-[#1b1e19]" style={{ ["--sweep" as string]: "0%" }}>
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent calc(35% + var(--sweep)), rgba(255,226,180,.9) calc(48% + var(--sweep)), rgba(255,226,180,.55) calc(60% + var(--sweep)), transparent calc(78% + var(--sweep)))" }} />
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, #111310 0 6%, transparent 6% 12%)", mixBlendMode: "multiply" }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="eyebrow absolute bottom-4 start-4 text-[#ece9e0]/80">15:42 · 51° · 180 mm</span>
      </div>
    </MaskReveal>
  );
}

function Human() {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const parts = el.querySelectorAll<SVGElement>(".h");
    parts.forEach((p) => { p.style.strokeDasharray = "1"; p.style.strokeDashoffset = "1"; });
    const st = ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => gsap.to(parts, { strokeDashoffset: 0, duration: 1.6, stagger: 0.08, ease: "power2.inOut" }) });
    return () => st.kill();
  }, [reduced]);
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-alt md:aspect-[5/6]">
      <svg ref={ref} viewBox="0 0 400 480" className="absolute inset-0 h-full w-full" role="img" aria-label="Diagram of a person beside a door, steps and dimension lines">
        <style>{`.h{fill:none;stroke:var(--fg);stroke-width:2;vector-effect:non-scaling-stroke}.hc{fill:none;stroke:var(--copper);stroke-width:1.2;vector-effect:non-scaling-stroke}.ht{fill:var(--copper);font-family:var(--font-tech),monospace;font-size:11px;letter-spacing:.08em}`}</style>
        <line className="h" pathLength={1} x1="30" y1="420" x2="370" y2="420" />
        {/* steps */}
        <path className="h" pathLength={1} d="M30 420 h60 v-14 h60 v-14 h60 v-14" />
        {/* door */}
        <rect className="h" pathLength={1} x="250" y="170" width="90" height="250" />
        <circle className="h" pathLength={1} cx="266" cy="300" r="4" />
        {/* figure 1.75 m ≈ 232px ... scale 1px = 7.5mm */}
        <circle className="h" pathLength={1} cx="195" cy="214" r="12" />
        <path className="h" pathLength={1} d="M195 226 v70 M195 238 l-22 40 M195 238 l22 38 M195 296 l-14 90 M195 296 l14 90" />
        {/* dims */}
        <line className="hc" x1="365" y1="170" x2="365" y2="420" /><line className="hc" x1="357" y1="170" x2="373" y2="170" /><line className="hc" x1="357" y1="420" x2="373" y2="420" />
        <text className="ht" x="350" y="300" textAnchor="middle" transform="rotate(-90 350 300)">2 100</text>
        <line className="hc" x1="250" y1="452" x2="340" y2="452" /><text className="ht" x="295" y="470" textAnchor="middle">900</text>
        <text className="ht" x="30" y="60">1 : 25</text>
      </svg>
    </div>
  );
}

const VISUALS = { material: Material, light: Light, human: Human } as const;

export default function Philosophy() {
  const { u, t, ta, n } = useLang();
  return (
    <section aria-labelledby="phil-h" className="relative bg-alt py-24 md:py-40">
      <div className="container-x">
        <SectionHeading no={n("03")} kicker={u("phil.kicker")} title={u("phil.title")} size="xl" className="mb-20 md:mb-36" />
        <div className="flex flex-col gap-24 md:gap-40">
          {principles.map((p, i) => {
            const V = VISUALS[p.id as keyof typeof VISUALS];
            return (
              <article key={p.id} className="grid grid-cols-12 items-center gap-x-6 gap-y-10">
                <div className={`col-span-12 md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : "md:col-start-1"}`}><V /></div>
                <div className={`col-span-12 md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-2" : "md:col-start-8"}`}>
                  <Reveal>
                    <span className="num text-sm text-copper">{p.no}</span>
                    <h3 className="display mt-3 text-[clamp(2rem,4.2vw,4rem)]">{t(p.title)}</h3>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t(p.text)}</p>
                    <ul className="mt-8 flex flex-wrap gap-2">
                      {ta(p.points).map((pt) => (
                        <li key={pt} className="eyebrow border border-line px-3 py-2">{pt}</li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
