"use client";
import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { INTRO_EVENT, DUR, EASE, inView, registerGsap } from "@/lib/motion";

function whenIntro(fn: () => void) {
  const pending = document.documentElement.dataset.intro === "pending";
  if (!pending) {
    fn();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, fn, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, fn);
}

/** Fade/translate reveal when scrolled into view. Content stays visible without JS / with reduced motion. */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 36, style }: { children: ReactNode; as?: ElementType; className?: string; delay?: number; y?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("anim")) return;
    const { gsap } = registerGsap();
    gsap.set(el, { y });
    return inView(el, () => gsap.to(el, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, delay }), "0px 0px -6% 0px");
  }, [delay, y]);
  return (
    <Tag ref={ref} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Word-by-word masked headline reveal. Use `lines` for art-directed line breaks. */
export function SplitReveal({ text, lines, as: Tag = "h2", className, delay = 0, stagger = 0.05, waitIntro = false, style }: { text?: string; lines?: string[]; as?: ElementType; className?: string; delay?: number; stagger?: number; waitIntro?: boolean; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("anim")) return;
    const { gsap } = registerGsap();
    const inner = el.querySelectorAll(".rv-inner");
    const play = () => gsap.to(inner, { yPercent: 0, y: 0, duration: DUR.slow, ease: EASE.out, stagger, delay, overwrite: true });
    const off = waitIntro ? whenIntro(play) : inView(el, play, "0px 0px -10% 0px");
    return () => off();
  }, [text, lines, delay, stagger, waitIntro]);
  const words = (s: string) =>
    s.split(" ").map((w, i, a) => (
      <span key={i}>
        <span className="word-mask">
          <span className="rv-inner">{w}</span>
        </span>
        {i < a.length - 1 ? " " : ""}
      </span>
    ));
  return (
    <Tag ref={ref} className={className} style={style} aria-label={lines ? lines.join(" ") : text}>
      <span aria-hidden="true" className="contents">
        {lines
          ? lines.map((l, i) => (
              <span key={i} className="line-block">
                <span className="rv-inner">{l}</span>
              </span>
            ))
          : words(text ?? "")}
      </span>
    </Tag>
  );
}

/** Clip-path mask reveal for images (reveals top-down). */
export function MaskReveal({ children, className, delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("anim")) return;
    const { gsap } = registerGsap();
    const img = el.firstElementChild as HTMLElement | null;
    if (img) gsap.set(img, { scale: 1.18 });
    return inView(el, () => {
      gsap.to(el, { clipPath: "inset(0% 0 0% 0)", duration: 1.3, ease: EASE.inOut, delay });
      if (img) gsap.to(img, { scale: 1, duration: 1.8, ease: EASE.out, delay });
    }, "0px 0px -8% 0px");
  }, [delay]);
  return (
    <div ref={ref} data-mask className={className} style={style}>
      {children}
    </div>
  );
}
