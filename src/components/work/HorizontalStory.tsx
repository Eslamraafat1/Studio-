"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap, useIsSmall, useReducedMotion } from "@/lib/motion";

/**
 * Horizontal storytelling. Desktop: a sticky stage whose track translates with scroll (no pinning, so
 * it never traps the page). Mobile / reduced motion: a native, snap-scrolling horizontal rail.
 */
export default function HorizontalStory({ children, label }: { children: ReactNode; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const small = useIsSmall();
  const reduced = useReducedMotion();
  const native = small || reduced;

  useEffect(() => {
    if (native || !wrap.current || !track.current) return;
    const { gsap } = registerGsap();
    const tr = track.current, w = wrap.current;
    const dist = () => tr.scrollWidth - window.innerWidth + 80;
    const rtl = document.documentElement.dir === "rtl";
    w.style.height = `${tr.scrollWidth - window.innerWidth + window.innerHeight}px`;
    const tween = gsap.fromTo(tr, { x: rtl ? () => dist() : 0 }, { x: () => (rtl ? 0 : -dist()), ease: "none", scrollTrigger: { trigger: w, start: "top top", end: () => `+=${dist()}`, scrub: 0.6, invalidateOnRefresh: true, onRefresh: () => { w.style.height = `${tr.scrollWidth - window.innerWidth + window.innerHeight}px`; } } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); w.style.height = ""; tr.style.transform = ""; };
  }, [native, children]);

  if (native)
    return (
      <div role="region" aria-label={label} tabIndex={0} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
        {children}
      </div>
    );
  return (
    <div ref={wrap} role="region" aria-label={label} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div ref={track} className="flex w-max gap-8 ps-[max(4vw,2rem)] pe-[10vw] will-change-transform">{children}</div>
      </div>
    </div>
  );
}
