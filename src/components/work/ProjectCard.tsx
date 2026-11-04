"use client";
import TLink from "@/components/ui/TLink";
import Img from "@/components/ui/Img";
import { MaskReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export type CardVariant = "full" | "tall" | "landscape" | "wide" | "compact";
const ASPECT: Record<CardVariant, string> = {
  full: "aspect-[4/3] md:aspect-[21/9]",
  tall: "aspect-[3/4]",
  landscape: "aspect-[4/3] md:aspect-[16/10]",
  wide: "aspect-[4/3] md:aspect-[2/1]",
  compact: "aspect-[4/3]",
};
const SRC_INDEX: Record<CardVariant, number> = { full: 0, tall: 2, landscape: 1, wide: 0, compact: 0 };

/** Editorial project card. Metadata is revealed on hover (fine pointers) and always visible on touch. */
export default function ProjectCard({ project: p, variant = "landscape", priority = false, className, sizes }: { project: Project; variant?: CardVariant; priority?: boolean; className?: string; sizes?: string }) {
  const { t, u, n } = useLang();
  const image = p.images[variant === "tall" ? (p.tallIndex ?? SRC_INDEX.tall) : SRC_INDEX[variant]] ?? p.images[0];
  return (
    <article className={cn("group relative", className)}>
      <TLink href={`/work/${p.slug}`} data-cursor={u("works.view")} className="block" aria-label={`${t(p.name)} — ${t(p.location)}, ${p.year}`}>
        <MaskReveal className="relative overflow-hidden bg-alt">
          <div className={cn("relative w-full", ASPECT[variant])}>
            <Parallax amount={5} className="absolute inset-0">
              <Img src={image.src} alt={t(image.alt)} fill priority={priority} sizes={sizes ?? "(min-width:1024px) 60vw, 100vw"} quality={75} className="img-grade object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
            </Parallax>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 hover-reveal" />
            <div className="hover-reveal absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-6 p-5 text-[#f5f3ee] opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-y-6 md:p-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <div className="max-w-md">
                <p className="eyebrow mb-2 opacity-80">{t(p.categoryLabel)} · {n(p.year)}</p>
                <p className="text-sm leading-relaxed md:text-base">{t(p.blurb)}</p>
              </div>
              <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full border border-white/50 transition-colors duration-500 group-hover:bg-white group-hover:text-black">
                <ArrowUpRight className="size-5 rtl:-scale-x-100" />
              </span>
            </div>
          </div>
        </MaskReveal>
        <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-line pt-4">
          <div className="flex items-baseline gap-4 md:gap-6">
            <span className="num text-sm text-muted">{n(p.no)}</span>
            <h3 className="display text-[clamp(1.6rem,3.2vw,3rem)] leading-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 rtl:group-hover:-translate-x-2">{t(p.name)}</h3>
          </div>
          <p className="eyebrow hidden text-right text-muted sm:block rtl:text-left">{t(p.location)}</p>
        </div>
        <p className="eyebrow mt-2 text-muted sm:hidden">{t(p.location)} · {n(p.year)}</p>
      </TLink>
    </article>
  );
}
