"use client";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate } from "motion";
import { EASE, useReducedMotion } from "@/lib/motion";
import { useLang } from "@/lib/i18n";

const Ctx = createContext<(href: string) => void>(() => {});
export const usePageNav = () => useContext(Ctx);

/** Curtain transition: cover -> route change -> reveal. Falls back to instant navigation for reduced motion. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const target = useRef<string | null>(null);
  const reduced = useReducedMotion();
  const { dir } = useLang();

  const go = useCallback(
    (href: string) => {
      const cur = window.location.pathname + window.location.search;
      if (href === cur || busy.current) return;
      if (reduced || !panel.current) return router.push(href);
      busy.current = true;
      target.current = href.split("#")[0].split("?")[0];
      const el = panel.current;
      el.style.visibility = "visible";
      animate(el, { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] }, { duration: 0.6, ease: EASE.cssInOut }).finished.then(() => router.push(href));
      // safety: never leave the curtain stuck
      window.setTimeout(() => {
        if (busy.current) finish();
      }, 4000);
    },
    [reduced, router]
  );

  function finish() {
    const el = panel.current;
    window.scrollTo(0, 0);
    (window as unknown as { __lenis?: { scrollTo(n: number, o: object): void } }).__lenis?.scrollTo(0, { immediate: true });
    if (!el) return (busy.current = false);
    animate(el, { clipPath: ["inset(0% 0 0 0)", "inset(0 0 100% 0)"] }, { duration: 0.7, ease: EASE.cssInOut, delay: 0.1 }).finished.then(() => {
      el.style.visibility = "hidden";
      busy.current = false;
      target.current = null;
    });
  }

  useEffect(() => {
    if (busy.current && target.current === path) finish();
    else if (!busy.current) window.scrollTo(0, 0);
  }, [path]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={panel} aria-hidden="true" dir={dir} style={{ visibility: "hidden", clipPath: "inset(100% 0 0 0)" }} className="pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-brand text-brandfg">
        <span className="display-sans text-[clamp(1.5rem,4vw,3rem)] tracking-tight">MONOLITH<sup className="text-[0.4em]">®</sup></span>
      </div>
    </Ctx.Provider>
  );
}
