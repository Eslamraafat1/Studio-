"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { INTRO_EVENT, EASE, registerGsap, useIsSmall, useReducedMotion } from "@/lib/motion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero() {
  const { u, isRTL } = useLang();
  const reduced = useReducedMotion();
  const small = useIsSmall();
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [mount3d, setMount3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [play, setPlay] = useState(false);
  const [active, setActive] = useState(true);

  // lazy-load the 3D scene after first paint, only if WebGL exists and the browser is idle
  useEffect(() => {
    if (!webglOK()) return;
    const go = () => setMount3d(true);
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 400);
    return () => {
      if (w.requestIdleCallback) (window as unknown as { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  // intro → start camera move + secondary content reveals
  useEffect(() => {
    const d = document.documentElement;
    const { gsap } = registerGsap();
    const items = copy.current?.querySelectorAll("[data-hero-in]");
    const start = () => {
      setPlay(true);
      if (items?.length) gsap.to(items, { opacity: 1, y: 0, duration: 1.1, ease: EASE.out, stagger: 0.12, delay: 0.5 });
    };
    if (!d.classList.contains("anim")) return;
    if (items?.length) gsap.set(items, { opacity: 0, y: 24 });
    if (d.dataset.intro === "pending") {
      window.addEventListener(INTRO_EVENT, start, { once: true });
      return () => window.removeEventListener(INTRO_EVENT, start);
    }
    start();
  }, []);

  // pause rendering offscreen; feed scroll progress to the scene
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const on = () => { scroll.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight)); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", on); };
  }, []);

  return (
    <section ref={root} aria-label="MONOLITH" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[4.25rem] md:pt-[4.75rem]">
      {/* backdrop grid — architectural column lines */}
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 -z-20 opacity-60" />

      {/* sculpture: static fallback first, live scene crossfades in */}
      <div className="absolute inset-x-0 top-[5rem] -z-10 h-[46svh] lg:inset-0 lg:h-auto" aria-hidden="true">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}>
          <Image src="/images/hero/hero-sculpture.webp" alt="" fill priority sizes="(min-width:1024px) 60vw, 100vw" quality={85} className="img-grade object-contain object-center lg:object-[78%_55%] rtl:lg:object-[22%_55%]" />
        </div>
        {mount3d && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <HeroScene play={play || reduced} active={active} reduced={reduced} coarse={small} rtl={isRTL} scroll={scroll} onReady={() => setReady(true)} />
          </div>
        )}
      </div>

      <div ref={copy} className="container-x relative z-10 flex flex-1 flex-col justify-between pb-8 pt-8 md:pb-12 md:pt-12">
        <div data-hero-in className="eyebrow flex items-center justify-between text-muted">
          <span className="num" dir="ltr">N 55°41′ · E 12°35′</span>
          <span className="hidden sm:inline">{u("hero.caption")}</span>
        </div>

        <div className="mt-10 max-w-[92rem] lg:mt-0">
          <h1 className="text-[clamp(2.9rem,9.6vw,10.8rem)]" aria-label={`${u("hero.l1")} ${u("hero.l2")} ${u("hero.l3")}`}>
            <SplitReveal as="span" lines={[u("hero.l1")]} waitIntro className="display-sans block" stagger={0} />
            <SplitReveal as="span" lines={[u("hero.l2")]} waitIntro delay={0.12} className="display block italic lg:ps-[0.6em]" stagger={0} />
            <SplitReveal as="span" lines={[u("hero.l3")]} waitIntro delay={0.24} className="display-sans block text-brand" stagger={0} />
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <p data-hero-in className="text-[1.02rem] leading-relaxed text-muted md:text-lg">{u("hero.sub")}</p>
              <div data-hero-in className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button href="/work">{u("hero.cta1")}</Button>
                <Button href="/studio" variant="text" arrow="none">{u("hero.cta2")}</Button>
              </div>
            </div>
            <a data-hero-in href="#intro" className="eyebrow group hidden items-center gap-4 text-muted md:flex" aria-label={u("hero.scroll")}>
              <span>{u("hero.scroll")}</span>
              <span aria-hidden className="relative block h-14 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-6 bg-fg motion-safe:animate-[scrollcue_2s_var(--ease-inout)_infinite]" />
              </span>
            </a>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(260%)}}`}</style>
    </section>
  );
}
