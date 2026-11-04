"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, useReducedMotion } from "@/lib/motion";

/** Lenis smooth scrolling, synchronised with GSAP ScrollTrigger. Disabled for reduced motion. */
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduced]);
  return null;
}
