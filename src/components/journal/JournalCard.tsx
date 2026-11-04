"use client";
import TLink from "@/components/ui/TLink";
import Img from "@/components/ui/Img";
import { MaskReveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { jCats, type Article } from "@/data/journal";
import { cn } from "@/lib/utils";

export function fmtDate(iso: string, lang: "en" | "ar") {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

export type JVariant = "wide" | "tall" | "standard" | "row";

/** Journal card with four compositions: wide (featured), tall, standard and compact row. */
export default function JournalCard({ a, variant = "standard", className, priority = false }: { a: Article; variant?: JVariant; className?: string; priority?: boolean }) {
  const { t, u, n, lang } = useLang();
  const aspect = { wide: "aspect-[16/9] md:aspect-[21/10]", tall: "aspect-[4/5]", standard: "aspect-[4/3]", row: "aspect-square" }[variant];
  const meta = (
    <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
      <span className="text-copper">{t(jCats[a.category])}</span>
      <span aria-hidden>·</span>
      <time dateTime={a.date}>{fmtDate(a.date, lang)}</time>
      <span aria-hidden>·</span>
      <span>{n(a.minutes)} {u("journal.min")}</span>
    </p>
  );
  if (variant === "row")
    return (
      <article className={cn("group", className)}>
        <TLink href={`/journal/${a.slug}`} data-cursor={u("journal.read")} className="grid grid-cols-[6.5rem_1fr] items-center gap-5 border-t border-line py-5 md:grid-cols-[9rem_1fr]">
          <MaskReveal className={cn("relative overflow-hidden bg-alt", aspect)}>
            <div className="absolute inset-0"><Img src={a.image} alt={t(a.imageAlt)} fill sizes="150px" quality={60} className="img-grade object-cover transition-transform duration-1000 group-hover:scale-110" /></div>
          </MaskReveal>
          <div>
            {meta}
            <h3 className="display mt-2 text-[clamp(1.3rem,2.2vw,1.9rem)] leading-tight transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{t(a.title)}</h3>
          </div>
        </TLink>
      </article>
    );
  return (
    <article className={cn("group", className)}>
      <TLink href={`/journal/${a.slug}`} data-cursor={u("journal.read")} className="block">
        <MaskReveal className={cn("relative overflow-hidden bg-alt", aspect)}>
          <div className="absolute inset-0">
            <Img src={a.image} alt={t(a.imageAlt)} fill priority={priority} sizes={variant === "wide" ? "100vw" : "(min-width:768px) 40vw, 100vw"} quality={75} className="img-grade object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
          </div>
        </MaskReveal>
        <div className={cn("mt-5 flex flex-col gap-3", variant === "wide" && "md:grid md:grid-cols-12 md:gap-6")}>
          <div className={variant === "wide" ? "md:col-span-3" : ""}>{meta}</div>
          <div className={variant === "wide" ? "md:col-span-8" : ""}>
            <h3 className={cn("display leading-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 rtl:group-hover:-translate-x-2", variant === "wide" ? "text-[clamp(2rem,4.6vw,4.5rem)]" : "text-[clamp(1.6rem,2.6vw,2.4rem)]")}>{t(a.title)}</h3>
            <p className="mt-3 max-w-xl text-muted">{t(a.dek)}</p>
          </div>
        </div>
      </TLink>
    </article>
  );
}
