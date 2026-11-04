"use client";
import { useEffect, useRef, useState } from "react";
import Img from "@/components/ui/Img";
import Button from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";
import { registerGsap, useReducedMotion } from "@/lib/motion";
import { getProject } from "@/data/projects";

/* ----------------------------------------------------------------------------
   FROM BLUEPRINT TO REALITY — the signature scroll sequence.
   A sticky stage inside a tall wrapper (no GSAP pin → no jump, no scroll-jacking).
   One scrubbed timeline:
     0.00–0.28  survey grid + dimension lines draw in
     0.18–0.52  plan + elevation outlines form
     0.46–0.66  outlines gain volume (hatch / fill)
     0.58–0.92  the finished building is revealed through a growing circular mask
     0.80–1.00  project information arrives
   ---------------------------------------------------------------------------- */

const STEPS = ["bp.step1", "bp.step2", "bp.step3", "bp.step4"] as const;

function Drawing() {
  // coordinates: viewBox 1200 × 700; plan centre (330, 350), elevation baseline y = 520
  const grid: React.ReactElement[] = [];
  for (let x = 0; x <= 1200; x += 50) grid.push(<line key={"v" + x} x1={x} y1={0} x2={x} y2={700} className="g" />);
  for (let y = 0; y <= 700; y += 50) grid.push(<line key={"h" + y} x1={0} y1={y} x2={1200} y2={y} className="g" />);
  const dim = (x1: number, y1: number, x2: number, y2: number, label: string, lx: number, ly: number, rot = 0) => (
    <g className="dim" key={label}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} className="d" />
      <line x1={x1} y1={y1 - 8} x2={x1} y2={y1 + 8} pathLength={1} className="d" style={rot ? { display: "none" } : undefined} />
      <line x1={x2} y1={y2 - 8} x2={x2} y2={y2 + 8} pathLength={1} className="d" style={rot ? { display: "none" } : undefined} />
      <text x={lx} y={ly} className="t" textAnchor="middle" transform={rot ? `rotate(${rot} ${lx} ${ly})` : undefined}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 1200 700" className="bp-svg absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Technical drawing: plan and elevation of The Observatory">
      <style>{`
        .bp-svg .g{stroke:var(--fg);stroke-opacity:.09;stroke-width:1}
        .bp-svg .g.major{stroke-opacity:.18}
        .bp-svg .o{fill:none;stroke:var(--fg);stroke-width:2;vector-effect:non-scaling-stroke}
        .bp-svg .th{stroke-width:1;stroke-opacity:.6}
        .bp-svg .d{fill:none;stroke:var(--copper);stroke-width:1.2;vector-effect:non-scaling-stroke}
        .bp-svg .t{fill:var(--copper);font-family:var(--font-tech),monospace;font-size:13px;letter-spacing:.08em}
        .bp-svg .lbl{fill:var(--fg);font-family:var(--font-tech),monospace;font-size:12px;letter-spacing:.12em;opacity:.7}
        .bp-svg .fillv{fill:var(--brand);opacity:0}
        .bp-svg .hatch{stroke:var(--brand);stroke-width:1;opacity:0}
      `}</style>
      <g>{grid}</g>
      {/* PLAN ---------------------------------------------------------- */}
      <g id="bp-plan">
        <circle cx="330" cy="350" r="250" pathLength={1} className="o th" />
        <circle cx="330" cy="350" r="205" pathLength={1} className="o" />
        <circle cx="330" cy="350" r="150" pathLength={1} className="o th" />
        <path d="M330 350 m150 0 a150 150 0 0 1 -120 147" pathLength={1} className="o th" />
        <circle cx="330" cy="350" r="118" pathLength={1} className="o" />
        <circle cx="330" cy="350" r="58" pathLength={1} className="o" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={330 + Math.cos(a) * 118} y1={350 + Math.sin(a) * 118} x2={330 + Math.cos(a) * 150} y2={350 + Math.sin(a) * 150} pathLength={1} className="o th" />;
        })}
        <line x1="60" y1="350" x2="600" y2="350" pathLength={1} className="o th" strokeDasharray="14 6 2 6" />
        <line x1="330" y1="80" x2="330" y2="620" pathLength={1} className="o th" strokeDasharray="14 6 2 6" />
        <circle className="fillv" cx="330" cy="350" r="118" />
        {Array.from({ length: 16 }).map((_, i) => <line key={i} className="hatch" x1={212 + i * 15} y1={350 - Math.sqrt(Math.max(0, 118 * 118 - (212 + i * 15 - 330) ** 2))} x2={212 + i * 15 - 40} y2={350 + Math.sqrt(Math.max(0, 118 * 118 - (212 + i * 15 - 330) ** 2))} />)}
        {dim(80, 640, 580, 640, "Ø 22 000", 330, 660)}
        <text x="60" y="52" className="lbl">PLAN — LEVEL 2</text>
      </g>
      {/* ELEVATION ----------------------------------------------------- */}
      <g id="bp-elev">
        <line x1="640" y1="520" x2="1160" y2="520" pathLength={1} className="o" />
        <rect x="700" y="490" width="400" height="30" pathLength={1} className="o" />
        <rect x="750" y="455" width="300" height="35" pathLength={1} className="o th" />
        <rect x="780" y="190" width="240" height="265" pathLength={1} className="o" />
        <path d="M770 190 a130 130 0 0 1 260 0" pathLength={1} className="o" />
        <path d="M900 62 v128" pathLength={1} className="o th" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={810 + i * 60} y1={250} x2={810 + i * 60} y2={400} pathLength={1} className="o th" />)}
        <path d="M1100 490 L1000 440 L1000 400 L1100 350 M720 490 L790 450" pathLength={1} className="o th" />
        <path d="M720 520 q50 -70 120 -120 t170 -110" pathLength={1} className="o th" strokeDasharray="6 5" />
        <rect className="fillv" x="780" y="190" width="240" height="265" />
        <path className="fillv" d="M770 190 a130 130 0 0 1 260 0z" />
        {dim(1130, 520, 1130, 62, "25 000", 1150, 290, -90)}
        {dim(780, 560, 1020, 560, "9 400", 900, 584)}
        <text x="640" y="52" className="lbl">ELEVATION — SOUTH · 1:200</text>
      </g>
      <g>
        <text x="1160" y="672" className="lbl" textAnchor="end">MONOLITH® · THE OBSERVATORY · LISBON · REV C</text>
      </g>
    </svg>
  );
}

export default function BlueprintReality() {
  const { u, t, n } = useLang();
  const p = getProject("the-observatory")!;
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const root = stage.current, w = wrap.current;
    if (!root || !w || reduced) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const q = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const grid = q(".g"), dims = q(".d"), outlines = q(".o"), fills = q(".fillv"), hatch = q(".hatch"), texts = q(".t, .lbl");
    gsap.set([...grid], { opacity: 0 });
    [...dims, ...outlines].forEach((el) => { (el as SVGElement).style.strokeDasharray = "1"; (el as SVGElement).style.strokeDashoffset = "1"; });
    gsap.set(texts, { opacity: 0 });
    const pc = root.querySelector("#bp-plan circle") as SVGGraphicsElement | null;
    const place = () => { const sr = root.getBoundingClientRect(), cr = pc?.getBoundingClientRect(); const x = cr ? cr.left + cr.width / 2 - sr.left : sr.width * 0.3, y = cr ? cr.top + cr.height / 2 - sr.top : sr.height * 0.5; return { x: Math.round(x), y: Math.round(y), r: Math.ceil(Math.hypot(Math.max(x, sr.width - x), Math.max(y, sr.height - y))) + 20 }; };
    let o = place();
    gsap.set(".bp-photo", { clipPath: `circle(0px at ${o.x}px ${o.y}px)` });
    gsap.set(".bp-photo img", { scale: 1.25 });
    gsap.set(".bp-info > *", { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: w, start: "top top", end: "bottom bottom", scrub: 0.7,
        onUpdate: (s) => setStep(s.progress < 0.28 ? 0 : s.progress < 0.52 ? 1 : s.progress < 0.7 ? 2 : 3),
      },
    });
    tl.to(grid, { opacity: 1, stagger: { each: 0.004, from: "center" }, duration: 0.2 }, 0)
      .to(dims, { strokeDashoffset: 0, stagger: 0.02, duration: 0.14 }, 0.1)
      .to(texts, { opacity: 1, duration: 0.08 }, 0.2)
      .to(outlines, { strokeDashoffset: 0, stagger: 0.012, duration: 0.2 }, 0.18)
      .to(fills, { opacity: 0.16, duration: 0.12 }, 0.46)
      .to(hatch, { opacity: 0.55, stagger: 0.004, duration: 0.1 }, 0.5)
      .to(".bp-photo", { clipPath: () => { o = place(); return `circle(${o.r}px at ${o.x}px ${o.y}px)`; }, duration: 0.34, ease: "power2.inOut" }, 0.58)
      .to(".bp-photo img", { scale: 1, duration: 0.34, ease: "power2.out" }, 0.58)
      .to(".bp-svg", { opacity: 0.0, duration: 0.18 }, 0.76)
      .to(".bp-info > *", { opacity: 1, y: 0, stagger: 0.04, duration: 0.1, ease: "power2.out" }, 0.82);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  const photo = p.images[1];
  return (
    <section aria-label={u("bp.kicker")} className="relative bg-alt">
      <div ref={wrap} className={reduced ? "" : "h-[380svh] md:h-[420svh]"}>
        <div ref={stage} className={reduced ? "relative grid min-h-[100svh] md:grid-cols-2" : "sticky top-0 h-[100svh] overflow-hidden bg-alt"}>
          {/* drawing layer */}
          <div className={reduced ? "relative min-h-[60svh]" : "absolute inset-x-0 bottom-[17%] top-[27%]"}><Drawing /></div>

          {/* finished building */}
          <div className={reduced ? "relative min-h-[60svh]" : "bp-photo absolute inset-0"} style={reduced ? undefined : { clipPath: "circle(0px at 30% 55%)" }}>
            <div className="absolute inset-0 overflow-hidden">
              <Img src={photo.src} alt={t(photo.alt)} fill sizes="100vw" quality={80} className="img-grade object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            </div>
          </div>

          {/* headline + step rail */}
          <div className={reduced ? "container-x col-span-full py-16" : "container-x pointer-events-none absolute inset-0 flex flex-col justify-between pb-8 pt-28 md:pb-12 md:pt-32"}>
            <div className="flex flex-col gap-4">
              <p className="eyebrow text-white mix-blend-difference">{u("bp.kicker")}</p>
              <h2 className="display max-w-3xl text-[clamp(1.9rem,4vw,4rem)] text-white mix-blend-difference">{u("bp.title")}</h2>
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <ol className="pointer-events-auto flex gap-3 md:gap-6" aria-label={u("bp.kicker")}>
                {STEPS.map((k, i) => (
                  <li key={k} aria-current={i === step ? "step" : undefined} className={`eyebrow flex flex-col gap-2 border-t pt-3 transition-all duration-500 ${i === step ? (step === 3 ? "border-white text-white" : "border-fg text-fg") : step === 3 ? "border-white/30 text-white/50" : "border-line text-muted"} min-w-[4.2rem] md:min-w-[8.5rem]`}>
                    <span className="num">{n(`0${i + 1}`)}</span>
                    <span className="hidden sm:block">{u(k)}</span>
                  </li>
                ))}
              </ol>
              <div className="bp-info pointer-events-auto max-w-sm text-white">
                <p className="eyebrow mb-2 text-white/70">{u("bp.caption")}</p>
                <p className="mb-5 text-sm leading-relaxed text-white/90 md:text-base">{t(p.blurb)}</p>
                <Button href={`/work/${p.slug}`} variant="light" arrow="up">{u("bp.cta")}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
