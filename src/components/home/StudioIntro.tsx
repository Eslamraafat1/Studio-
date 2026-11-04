"use client";
import Img from "@/components/ui/Img";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { Parallax, ScrubWords } from "@/components/ui/Motion";
import { useLang } from "@/lib/i18n";

export default function StudioIntro() {
  const { u, n } = useLang();
  const meta = [
    { k: u("meta.founded"), v: n("2014") },
    { k: u("meta.offices"), v: u("meta.officesVal") },
    { k: u("meta.team"), v: u("meta.teamVal") },
    { k: u("meta.focus"), v: u("meta.focusVal") },
  ];
  return (
    <section id="intro" aria-label={u("intro.est")} className="relative py-24 md:py-44">
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-14">
        <Reveal className="eyebrow col-span-12 flex items-center gap-4 text-muted md:col-span-3">
          <span className="num text-fg">{n("01")}</span>
          <span aria-hidden className="h-px w-10 bg-current opacity-50" />
          <span>{u("s.kicker")}</span>
        </Reveal>

        <div className="col-span-12 md:col-span-9">
          <ScrubWords text={u("intro.statement")} className="display text-[clamp(2rem,5.6vw,6.2rem)] leading-[1.02]" />
        </div>

        <div className="relative col-span-12 mt-6 md:col-span-4 md:col-start-2 md:mt-24">
          <MaskReveal className="relative aspect-[3/4] overflow-hidden bg-alt">
            <div className="absolute inset-0">
              <Parallax amount={7} className="absolute inset-0">
                <Img src="/images/studio/workshop-3.jpg" alt={u("s.environment")} fill sizes="(min-width:768px) 33vw, 100vw" quality={75} className="img-grade object-cover" />
              </Parallax>
            </div>
          </MaskReveal>
          <p className="eyebrow mt-3 text-muted">Fig. 02 — {u("s.environment")}</p>
          <RotatingSeal className="absolute -end-6 top-[-3.5rem] hidden size-36 text-fg md:block lg:-end-14 lg:size-44" />
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-8 md:self-end">
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-muted">{u("intro.body")}</p>
          </Reveal>
          <Reveal as="dl" className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6">
            {meta.map((m) => (
              <div key={m.k}>
                <dt className="eyebrow text-muted">{m.k}</dt>
                <dd className="mt-1 text-[0.98rem]">{m.v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Slowly rotating circular text — a purposeful maker's mark, paused for reduced motion. */
function RotatingSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={`${className} motion-safe:animate-[seal_28s_linear_infinite]`}>
      <defs>
        <path id="seal-c" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1 -156 0" />
      </defs>
      <text className="eyebrow" fill="currentColor" style={{ fontSize: 13.5, letterSpacing: "0.28em" }}>
        <textPath href="#seal-c">MONOLITH® · ARCHITECTURE · SPATIAL DESIGN · EST. 2014 · </textPath>
      </text>
      <circle cx="100" cy="100" r="3" fill="var(--copper)" />
      <style>{`@keyframes seal{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
