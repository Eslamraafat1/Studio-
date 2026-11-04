"use client";
import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { registerGsap, useReducedMotion } from "@/lib/motion";

/** Infinite ticker of the studio's cities. Speeds up (and reverses) with scroll velocity. Static when motion is reduced. */
export default function CityMarquee() {
  const { t, u } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const cities = projects.map((p) => t(p.location).split(/[,،]/)[0].trim());

  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const rtl = document.documentElement.dir === "rtl";
    const tween = gsap.to(el, { xPercent: rtl ? 50 : -50, ease: "none", duration: 38, repeat: -1 });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity() / 600;
        gsap.to(tween, { timeScale: gsap.utils.clamp(-6, 6, (self.direction > 0 ? 1 : -1) + v), duration: 0.3, overwrite: true });
        gsap.to(tween, { timeScale: self.direction > 0 ? 1 : -1, duration: 1.2, delay: 0.3, overwrite: "auto" });
      },
    });
    return () => { st.kill(); tween.kill(); };
  }, [reduced, cities.length]);

  const row = (key: string) => (
    <div key={key} aria-hidden className="flex shrink-0 items-center" dir="ltr">
      {cities.map((c, i) => (
        <span key={c + i} className="flex items-center">
          <span className={`display whitespace-nowrap px-[0.35em] text-[clamp(3.5rem,11vw,10rem)] leading-none ${i % 2 ? "italic" : "uppercase"}`} style={i % 2 ? undefined : { WebkitTextStroke: "1.5px var(--fg)", color: "transparent" }}>
            {c}
          </span>
          <span className="size-3 shrink-0 rounded-full bg-copper md:size-4" />
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label={u("marq.label")} className="overflow-hidden border-y border-line py-8 md:py-12">
      <p className="sr-only">{cities.join(", ")}</p>
      <div ref={track} className="flex w-max" style={{ willChange: reduced ? undefined : "transform" }}>
        {row("a")}
        {row("b")}
      </div>
    </section>
  );
}
