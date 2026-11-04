"use client";
import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** One timing / easing language used by every animation system. */
export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
  cssOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  cssInOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
};
export const DUR = { fast: 0.35, base: 0.8, slow: 1.2, hero: 1.5 };

function mq(query: string) {
  return {
    subscribe(cb: () => void) {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}
const reduced = typeof window !== "undefined" ? mq("(prefers-reduced-motion: reduce)") : null;
const fine = typeof window !== "undefined" ? mq("(hover: hover) and (pointer: fine)") : null;
const small = typeof window !== "undefined" ? mq("(max-width: 767px)") : null;

export const useReducedMotion = () =>
  useSyncExternalStore(reduced?.subscribe ?? (() => () => {}), reduced?.get ?? (() => false), () => false);
export const useFinePointer = () =>
  useSyncExternalStore(fine?.subscribe ?? (() => () => {}), fine?.get ?? (() => false), () => false);
export const useIsSmall = () =>
  useSyncExternalStore(small?.subscribe ?? (() => () => {}), small?.get ?? (() => false), () => false);

/** Lock / unlock page scrolling (menu, lightbox). Works with Lenis. */
export function lockScroll(lock: boolean) {
  const w = window as unknown as { __lenis?: { stop(): void; start(): void } };
  if (lock) w.__lenis?.stop();
  else w.__lenis?.start();
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export const INTRO_EVENT = "monolith:intro-done";
export function finishIntro() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Fire `cb` once when `el` first enters the viewport (fires immediately if already visible). */
export function inView(el: Element, cb: () => void, margin = "0px 0px -8% 0px") {
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) {
      io.disconnect();
      cb();
    }
  }, { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}
