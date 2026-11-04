"use client";
import { useEffect, useRef } from "react";
import TLink from "@/components/ui/TLink";
import { Wordmark, NAV } from "./SiteHeader";
import { useLang } from "@/lib/i18n";
import { site } from "@/data/studio";
import { ArrowUpRight } from "lucide-react";

/** Footer is fixed behind the page on desktop and revealed as the content scrolls away (CSS: .footer-fixed). */
export default function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const { u } = useLang();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--footer-h", el.offsetHeight + "px");
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <footer
      ref={ref}
      className="footer-fixed grain relative overflow-hidden bg-[#111310] text-[#ece9e0]"
      onFocusCapture={() => {
        // the footer sits behind the page on desktop; scroll to it when keyboard focus lands inside
        if (window.matchMedia("(min-width:1024px) and (min-height:700px)").matches) window.scrollTo({ top: document.documentElement.scrollHeight });
      }}
    >
      <div className="container-x pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4 text-[#9b9a90]">{u("footer.nav")}</p>
            <ul className="flex flex-col gap-1">
              {[{ href: "/", key: "nav.home" as const }, ...NAV, { href: "/contact", key: "nav.contact" as const }].map((l) => (
                <li key={l.href}>
                  <TLink href={l.href} className="display group inline-flex items-center gap-3 py-1 text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.05]">
                    <span className="u-link">{u(l.key)}</span>
                    <ArrowUpRight aria-hidden className="size-6 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 rtl:-scale-x-100" />
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-4 text-[#9b9a90]">{u("cta.studio")}</p>
            <address className="not-italic leading-relaxed text-[#cfccc3]">
              <p>{u("footer.address")}</p>
              <p className="mt-2">{u("footer.address2")}</p>
              <p className="num mt-4 text-sm" dir="ltr">{site.phone}</p>
            </address>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-4 text-[#9b9a90]">{u("cta.email")}</p>
            <a href={`mailto:${site.email}`} className="u-link">{site.email}</a>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow mb-4 text-[#9b9a90]">{u("cta.social")}</p>
            <ul className="flex flex-col gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div aria-hidden className="select-none overflow-hidden pt-14 md:pt-20" dir="ltr">
          <div className="display-sans text-center text-[clamp(3.6rem,17.5vw,24rem)] leading-[0.78] tracking-[-0.06em] text-[#ece9e0]/90">MONOLITH</div>
        </div>
        <div className="eyebrow flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-[#9b9a90] md:flex-row">
          <span>© {new Date().getFullYear()} <Wordmark className="!text-[0.8rem] !align-baseline" /> — {u("footer.rights")}</span>
          <span>{u("footer.credit")}</span>
        </div>
      </div>
    </footer>
  );
}
