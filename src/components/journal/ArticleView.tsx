"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import Img from "@/components/ui/Img";
import TLink from "@/components/ui/TLink";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Motion";
import JournalCard, { fmtDate } from "./JournalCard";
import { useLang } from "@/lib/i18n";
import { jCats, relatedArticles, type Article } from "@/data/journal";

function ShareBar({ a }: { a: Article }) {
  const { t, u } = useLang();
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.href : "");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  const canShare = useSyncExternalStore(() => () => {}, () => "share" in navigator, () => false);
  return (
    <div className="flex items-center gap-3" role="group" aria-label={u("journal.share")}>
      <span className="eyebrow text-muted">{u("journal.share")}</span>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title: t(a.title), url: url() }).catch(() => {})} className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg" aria-label={u("journal.share")}><Share2 aria-hidden className="size-4" /></button>
      )}
      <button type="button" onClick={copy} className="eyebrow inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 transition-colors hover:border-fg">
        {copied ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
        <span aria-live="polite">{copied ? u("journal.copied") : u("journal.copy")}</span>
      </button>
    </div>
  );
}

export default function ArticleView({ article: a }: { article: Article }) {
  const { t, ta, u, n, lang } = useLang();
  const body = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  // reading progress is measured against the article body, not the whole page
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = body.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.2 - r.top) / Math.max(1, total)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setPct(Math.round(p * 100));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  const paras = ta(a.body);
  const rel = relatedArticles(a.slug);
  return (
    <article>
      <div role="progressbar" aria-label={u("journal.progress")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="fixed inset-x-0 top-[4.25rem] z-[65] h-[3px] bg-line md:top-[4.75rem]">
        <div ref={bar} className="h-full origin-left bg-brand rtl:origin-right" style={{ transform: "scaleX(0)" }} />
      </div>

      <header className="container-x pb-12 pt-36 md:pb-20 md:pt-52">
        <TLink href="/journal" className="eyebrow u-link mb-10 inline-block text-muted">← {u("journal.back")}</TLink>
        <p className="eyebrow mb-6 flex flex-wrap items-center gap-x-3 text-muted">
          <span className="text-copper">{t(jCats[a.category])}</span><span aria-hidden>·</span>
          <time dateTime={a.date}>{fmtDate(a.date, lang)}</time><span aria-hidden>·</span>
          <span>{n(a.minutes)} {u("journal.min")}</span>
        </p>
        <h1 className="display max-w-6xl text-[clamp(2.6rem,8vw,8.5rem)]"><SplitReveal as="span" text={t(a.title)} className="block" stagger={0.06} /></h1>
        <Reveal className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{t(a.dek)}</Reveal>
        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-5">
          <p className="text-sm"><span className="eyebrow text-muted">{u("journal.by")}</span> <span className="ms-2 font-medium">{a.author}</span> <span className="text-muted">— {t(a.role)}</span></p>
          <ShareBar a={a} />
        </Reveal>
      </header>

      <div className="relative mb-20 aspect-[4/3] overflow-hidden bg-alt md:mb-32 md:aspect-[21/9]">
        <Parallax amount={6} className="absolute inset-0"><Img src={a.image} alt={t(a.imageAlt)} fill priority sizes="100vw" quality={80} className="img-grade object-cover" /></Parallax>
      </div>

      <div ref={body} className="container-x grid gap-10 pb-24 md:grid-cols-12 md:pb-40">
        <aside className="hidden md:col-span-2 md:block"><p className="eyebrow sticky top-36 text-muted">{n(pct)}%</p></aside>
        <div className="md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
          {paras.map((p, i) => (
            <div key={i}>
              <Reveal as="p" className={`text-[1.12rem] leading-[1.8] ${i === 0 ? "first-letter:float-start first-letter:me-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[4.6rem] first-letter:leading-[0.8] rtl:first-letter:float-right" : ""} mb-8`}>{p}</Reveal>
              {i === 1 && (
                <Reveal as="blockquote" className="display my-14 border-s-2 border-copper ps-6 text-[clamp(1.7rem,3.2vw,2.8rem)] leading-[1.15] md:-ms-12 md:ps-10">“{t(a.quote)}”</Reveal>
              )}
            </div>
          ))}
          <div className="mt-14 border-t border-line pt-6"><ShareBar a={a} /></div>
        </div>
      </div>

      <section className="border-t border-line bg-surface py-20 md:py-32" aria-label={u("journal.related")}>
        <div className="container-x">
          <h2 className="display mb-12 text-[clamp(2rem,4.4vw,4rem)]">{u("journal.related")}</h2>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">{rel.map((r) => <JournalCard key={r.slug} a={r} variant="standard" />)}</div>
        </div>
      </section>
    </article>
  );
}
