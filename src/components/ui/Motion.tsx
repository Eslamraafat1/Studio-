"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { registerGsap, useReducedMotion } from "@/lib/motion";

/** Scroll-linked vertical drift. `amount` is a % of the element's own height moved over the viewport pass. */
export function Parallax({ children, amount = 8, className, style, scale = 1.12 }: { children: ReactNode; amount?: number; className?: string; style?: CSSProperties; scale?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const { gsap } = registerGsap();
    const tween = gsap.fromTo(el, { yPercent: -amount, scale }, { yPercent: amount, scale, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount, scale, reduced]);
  return (
    <div ref={ref} className={className} style={{ willChange: reduced ? undefined : "transform", ...style }}>
      {children}
    </div>
  );
}

/** Words fade from dim to full as the paragraph scrolls through the viewport. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const { gsap } = registerGsap();
    const words = el.querySelectorAll(".sw");
    const tween = gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.5 } });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text, reduced]);
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i, a) => (
        <span key={i}>
          <span className="sw">{w}</span>
          {i < a.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
