"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";
import { EASE, useFinePointer, useReducedMotion, registerGsap } from "@/lib/motion";

/* ---------------- ThemeToggle ---------------- */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { u } = useLang();
  const Icon = theme === "dark" ? Sun : Moon;
  return (
    <button type="button" onClick={toggle} aria-label={theme === "dark" ? u("theme.light") : u("theme.dark")} className={`grid size-11 place-items-center transition-transform duration-500 hover:rotate-[24deg] ${className}`}>
      <Icon aria-hidden className="size-[18px]" strokeWidth={1.5} />
    </button>
  );
}

/* ---------------- LanguageSwitcher ---------------- */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const next = lang === "en" ? "ar" : "en";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      lang={next}
      aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className={`eyebrow inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 ${className}`}
    >
      <span className="u-link !text-[0.8rem] normal-case">{next === "ar" ? "العربية" : "English"}</span>
    </button>
  );
}

/* ---------------- ScrollProgress ---------------- */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [path]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent">
      <div ref={bar} className="h-full origin-left bg-copper rtl:origin-right" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

/* ---------------- BackToTop ---------------- */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const { u } = useLang();
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      aria-label={u("top")}
      tabIndex={show ? 0 : -1}
      onClick={() => {
        const l = (window as unknown as { __lenis?: { scrollTo(n: number, o?: object): void } }).__lenis;
        if (l) l.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`fixed bottom-5 z-[60] grid size-12 place-items-center rounded-full border border-fg/30 bg-bg/80 backdrop-blur transition-all duration-500 end-5 hover:bg-fg hover:text-bg ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <ArrowUp aria-hidden className="size-4" />
    </button>
  );
}

/* ---------------- CustomCursor (desktop / fine pointers only) ---------------- */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const on = fine && !reduced;
  useEffect(() => {
    if (!on) return;
    const { gsap } = registerGsap();
    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.35, ease: "power3" });
    let hidden = true;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (hidden && dot.current) {
        hidden = false;
        dot.current.style.opacity = "1";
      }
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor],a,button,[role='tab'],input,select,textarea,summary") as HTMLElement | null;
      const text = t?.dataset?.cursor;
      const big = !!text;
      const small = !!t && !text;
      if (ring.current) {
        ring.current.style.width = ring.current.style.height = big ? "92px" : small ? "46px" : "12px";
        ring.current.style.backgroundColor = big ? "var(--brand)" : small ? "transparent" : "var(--fg)";
        ring.current.style.border = small ? "1px solid var(--fg)" : "1px solid transparent";
      }
      if (label.current) {
        label.current.textContent = text ?? "";
        label.current.style.opacity = big ? "1" : "0";
      }
    };
    const leave = () => {
      hidden = true;
      if (dot.current) dot.current.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [on]);
  if (!on) return null;
  return (
    <div ref={dot} aria-hidden className="pointer-events-none fixed start-0 top-0 z-[120] opacity-0 transition-opacity duration-300" style={{ willChange: "transform" }}>
      <div ref={ring} className="absolute grid place-items-center rounded-full text-brandfg" style={{ width: 12, height: 12, transform: "translate(-50%,-50%)", transition: "width .45s cubic-bezier(.16,1,.3,1), height .45s cubic-bezier(.16,1,.3,1), background-color .3s, border-color .3s", backgroundColor: "var(--fg)", mixBlendMode: "normal" }}>
        <span ref={label} className="eyebrow !text-[0.68rem] opacity-0 transition-opacity duration-300" />
      </div>
    </div>
  );
}

/* ---------------- Intro sequence ---------------- */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { u } = useLang();
  const reduced = useReducedMotion();
  useEffect(() => {
    const d = document.documentElement;
    const finish = () => {
      d.dataset.intro = "done";
      window.dispatchEvent(new Event("monolith:intro-done"));
      try {
        sessionStorage.setItem("monolith-intro", "1");
      } catch {}
      setGone(true);
    };
    if (d.dataset.intro !== "pending" || reduced) {
      if (d.dataset.intro === "pending") finish();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      else setGone(true);
      return;
    }
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("monolith-intro");
    } catch {}
    const { gsap } = registerGsap();
    const el = root.current!;
    const letters = el.querySelectorAll(".il");
    const tl = gsap.timeline({ onComplete: finish });
    const counter = el.querySelector(".ic") as HTMLElement;
    const obj = { v: 0 };
    if (seen) {
      tl.set(letters, { yPercent: 0 }).to(el, { yPercent: -100, duration: 0.7, ease: EASE.inOut });
    } else {
      tl.fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: EASE.out, stagger: 0.07 }, 0.2)
        .fromTo(el.querySelectorAll(".iv"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: EASE.out }, 0.7)
        .to(obj, { v: 100, duration: 1.8, ease: "power2.inOut", onUpdate: () => { if (counter) counter.textContent = String(Math.round(obj.v)).padStart(3, "0"); } }, 0.3)
        .to(el.querySelector(".ibar"), { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0.3)
        .to(letters, { yPercent: -110, duration: 0.8, ease: EASE.inOut, stagger: 0.04 }, 2.35)
        .to(el.querySelectorAll(".iv"), { opacity: 0, duration: 0.4 }, 2.3)
        .to(el, { yPercent: -100, duration: 1.0, ease: EASE.inOut }, 2.8);
    }
    return () => {
      tl.kill();
    };
  }, [reduced]);
  if (gone) return null;
  return (
    <div ref={root} role="status" aria-label={u("intro.loading")} className="fixed inset-0 z-[200] flex flex-col justify-between bg-[#111310] p-6 text-[#ece9e0] md:p-10" dir="ltr">
      <div className="iv eyebrow flex justify-between opacity-0 text-[#9b9a90]">
        <span>{u("intro.est")}</span>
        <span>Est. 2014</span>
      </div>
      <div className="display-sans overflow-hidden text-[clamp(3.2rem,14vw,13rem)] leading-[0.9]" aria-hidden>
        {"MONOLITH".split("").map((c, i) => (
          <span key={i} className="inline-block overflow-hidden align-top">
            <span className="il inline-block" style={{ transform: "translateY(110%)" }}>{c}</span>
          </span>
        ))}
        <sup className="text-[0.22em] align-top">®</sup>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="iv h-px flex-1 origin-left overflow-hidden bg-white/15 opacity-0"><div className="ibar h-full origin-left bg-[#c7d1b7]" style={{ transform: "scaleX(0)" }} /></div>
        <span className="ic num text-sm text-[#9b9a90]">000</span>
      </div>
    </div>
  );
}

