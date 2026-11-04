"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import TLink from "@/components/ui/TLink";
import Button from "@/components/ui/Button";
import { LanguageSwitcher, ThemeToggle } from "./Chrome";
import { useLang } from "@/lib/i18n";
import { EASE, lockScroll, useReducedMotion } from "@/lib/motion";
import type { UIKey } from "@/data/ui";

export const NAV: { href: string; key: UIKey }[] = [
  { href: "/work", key: "nav.work" },
  { href: "/studio", key: "nav.studio" },
  { href: "/approach", key: "nav.approach" },
  { href: "/journal", key: "nav.journal" },
];

export const isActive = (path: string, href: string) => path === href || path.startsWith(href + "/");

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display-sans uc inline-flex items-start text-[1.35rem] tracking-[-0.05em] ${className}`} dir="ltr">
      MONOLITH<sup className="ms-0.5 mt-0.5 text-[0.5em] font-medium">®</sup>
    </span>
  );
}

export default function SiteHeader() {
  const path = usePathname();
  const { u } = useLang();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const last = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > last.current && y > 500 && !open);
      last.current = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  const overDark = path.startsWith("/work/") && !solid && !open;
  return (
    <>
      <header style={overDark ? ({ "--fg": "#f5f3ee", "--line": "rgba(245,243,238,.25)" } as React.CSSProperties) : undefined} className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden ? "-translate-y-full" : "translate-y-0"} ${solid || open ? "bg-bg/85 backdrop-blur-md" : "bg-transparent"} ${solid ? "border-b border-line" : "border-b border-transparent"}`}>
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-6 md:h-[4.75rem]">
          <TLink href="/" aria-label="MONOLITH — home" className="relative z-[90]" data-cursor="">
            <Wordmark />
          </TLink>

          <nav aria-label={u("nav.primary")} className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <TLink key={n.href} href={n.href} aria-current={isActive(path, n.href) ? "page" : undefined} className="u-link eyebrow !text-[0.78rem] py-2">
                {u(n.key)}
              </TLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden items-center md:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="hidden lg:block">
              <Button href="/contact" variant="outline" arrow="up" className="!min-h-11 !px-5 !py-2.5">
                {u("nav.start")}
              </Button>
            </div>
            <button
              type="button"
              className="relative z-[90] flex min-h-11 items-center gap-3 ps-3 eyebrow lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="uc">{open ? u("nav.close") : u("nav.menu")}</span>
              <span aria-hidden className="relative block h-3 w-7">
                <span className={`absolute inset-x-0 h-px bg-current transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute inset-x-0 h-px bg-current transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} reduced={reduced} />
    </>
  );
}

function MobileNav({ open, onClose, reduced }: { open: boolean; onClose: () => void; reduced: boolean }) {
  const path = usePathname();
  const { u, n } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const links = [{ href: "/", key: "nav.home" as UIKey }, ...NAV, { href: "/contact", key: "nav.contact" as UIKey }];

  // focus management: move focus in, trap Tab, close on Escape
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(el?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])") ?? []);
    window.setTimeout(() => focusables()[0]?.focus(), 80);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={u("nav.menu")}
          className="fixed inset-0 z-[75] flex flex-col overflow-y-auto bg-bg lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE.cssInOut }}
        >
          <div className="container-x flex flex-1 flex-col justify-between pb-8 pt-28">
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-line">
                  <motion.div initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%", transition: { duration: 0.3, ease: EASE.cssInOut } }} transition={{ duration: 0.8, ease: EASE.cssOut, delay: reduced ? 0 : 0.25 + i * 0.06 }}>
                    <TLink href={l.href} aria-current={isActive(path, l.href) || (l.href === "/" && path === "/") ? "page" : undefined} className="group flex min-h-16 items-baseline gap-4 py-3">
                      <span className="num text-xs text-muted">{n(`0${i + 1}`)}</span>
                      <span className="display text-[clamp(2.4rem,11vw,4.5rem)] transition-transform duration-500 group-hover:translate-x-3 rtl:group-hover:-translate-x-3 group-aria-[current=page]:italic">{u(l.key)}</span>
                    </TLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-6">
              <div className="flex items-center justify-between border-y border-line py-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <Button href="/contact" arrow="up" className="w-full">{u("nav.start")}</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
