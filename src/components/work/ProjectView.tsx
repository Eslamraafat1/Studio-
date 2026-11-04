"use client";
import { useState } from "react";
import { useIsSmall } from "@/lib/motion";
import TLink from "@/components/ui/TLink";
import Img from "@/components/ui/Img";
import Button from "@/components/ui/Button";
import { MaskReveal, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Motion";
import ProjectCard from "./ProjectCard";
import FloorPlan from "./FloorPlan";
import ImageLightbox from "./ImageLightbox";
import HorizontalStory from "./HorizontalStory";
import { useLang } from "@/lib/i18n";
import { neighbours, related, type GalleryImage, type Project } from "@/data/projects";
import { ArrowRight, ArrowLeft, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

function Figure({ img, i, onOpen, aspect, className, sizes = "(min-width:768px) 50vw, 100vw", pos = "50% 50%", caption = true }: { img: GalleryImage; i: number; onOpen: (i: number) => void; aspect: string; className?: string; sizes?: string; pos?: string; caption?: boolean }) {
  const { t, u, n } = useLang();
  return (
    <figure className={cn("group", className)}>
      <button type="button" onClick={() => onOpen(i)} data-cursor={u("p.open")} aria-label={`${u("p.open")}: ${t(img.alt)}`} className="block w-full text-start">
        <MaskReveal className="relative overflow-hidden bg-alt">
          <div className={cn("relative w-full", aspect)}>
            <Parallax amount={4} className="absolute inset-0">
              <Img src={img.src} alt={t(img.alt)} fill sizes={sizes} quality={78} style={{ objectPosition: pos }} className="img-grade object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
            </Parallax>
            <span aria-hidden className="absolute end-3 top-3 grid size-10 place-items-center rounded-full bg-bg/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:opacity-100"><Maximize2 className="size-4" /></span>
          </div>
        </MaskReveal>
      </button>
      {caption && (
        <figcaption className="eyebrow mt-3 flex gap-4 text-muted normal-case">
          <span className="num text-fg">{n(`FIG. 0${i + 1}`)}</span>
          <span>{t(img.caption)}</span>
        </figcaption>
      )}
    </figure>
  );
}

function Gallery({ p, open }: { p: Project; open: (i: number) => void }) {
  const [, i1, i2, i3] = p.images;
  const { t } = useLang();
  if (p.layout === "full" || p.layout === "wide")
    return (
      <div className="flex flex-col gap-16 md:gap-28">
        <Figure img={i1} i={1} onOpen={open} aspect="aspect-[4/3] md:aspect-[21/9]" sizes="100vw" />
        <div className="grid items-center gap-10 md:grid-cols-12">
          <Figure img={i2} i={2} onOpen={open} aspect="aspect-[3/4]" className="md:col-span-5" sizes="(min-width:768px) 40vw, 100vw" />
          <Reveal className="md:col-span-5 md:col-start-8"><p className="display text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.15]">“{t(p.blurb)}”</p></Reveal>
        </div>
        <Figure img={i3} i={3} onOpen={open} aspect="aspect-[4/3] md:aspect-[2/1]" sizes="100vw" />
      </div>
    );
  if (p.layout === "tall" || p.layout === "offset")
    return (
      <div className="flex flex-col gap-16 md:gap-28">
        <div className="grid gap-10 md:grid-cols-12">
          <Figure img={i2} i={2} onOpen={open} aspect="aspect-[3/4]" className="md:col-span-5" sizes="(min-width:768px) 40vw, 100vw" />
          <Figure img={i1} i={1} onOpen={open} aspect="aspect-[4/3]" className="md:col-span-6 md:col-start-7 md:mt-[18vw]" />
        </div>
        <Figure img={i3} i={3} onOpen={open} aspect="aspect-[4/3] md:aspect-[21/9]" sizes="100vw" className="md:ms-[8%]" />
      </div>
    );
  return (
    <div className="flex flex-col gap-16 md:gap-28">
      <div className="grid gap-10 md:grid-cols-12">
        <Figure img={i1} i={1} onOpen={open} aspect="aspect-[4/3]" className="md:col-span-6" />
        <Figure img={i3} i={3} onOpen={open} aspect="aspect-[4/3]" className="md:col-span-6 md:mt-24" />
      </div>
      <Figure img={i2} i={2} onOpen={open} aspect="aspect-[3/4] md:aspect-[4/5]" className="md:col-span-6 md:mx-auto md:w-[42%]" sizes="(min-width:768px) 40vw, 100vw" />
    </div>
  );
}

export default function ProjectView({ project: p }: { project: Project }) {
  const { t, u, n } = useLang();
  const [lb, setLb] = useState<number | null>(null);
  const { prev, next } = neighbours(p.slug);
  const rel = related(p.slug);
  const small = useIsSmall();
  const cover = small ? p.images[2] : p.images[0];

  return (
    <article>
      {/* ---------------- COVER ---------------- */}
      <header className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden text-[#f5f3ee]">
        <div className="absolute inset-0 -z-10">
          <Parallax amount={6} scale={1.14} className="absolute inset-0"><Img src={cover.src} alt={t(cover.alt)} fill priority sizes="100vw" quality={85} className="object-cover" /></Parallax>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35" />
        </div>
        <div className="container-x pb-10 pt-40 md:pb-16">
          <div className="eyebrow mb-6 flex items-center gap-4 text-white/80"><span className="num">{n(p.no)} / {n("06")}</span><span aria-hidden className="h-px w-10 bg-white/50" /><span>{t(p.categoryLabel)}</span></div>
          <h1 className="display-sans text-[clamp(2.6rem,10vw,10.5rem)] uppercase">
            <SplitReveal as="span" text={t(p.name)} stagger={0.08} className="block" />
          </h1>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/30 pt-5 md:grid-cols-4">
            <div><dt className="eyebrow text-white/60">{u("p.location")}</dt><dd className="mt-1">{t(p.location)}</dd></div>
            <div><dt className="eyebrow text-white/60">{u("p.year")}</dt><dd className="num mt-1">{n(p.year)}</dd></div>
            <div><dt className="eyebrow text-white/60">{u("p.category")}</dt><dd className="mt-1">{t(p.categoryLabel)}</dd></div>
            <div className="hidden md:block"><dt className="eyebrow text-white/60">{t(p.specs[0].label)}</dt><dd className="num mt-1">{t(p.specs[0].value)}</dd></div>
          </dl>
        </div>
      </header>

      {/* ---------------- CONCEPT ---------------- */}
      <section className="py-24 md:py-40">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-3"><p className="eyebrow text-muted">{n("01")} — {u("p.concept")}</p></Reveal>
          <Reveal className="md:col-span-8 md:col-start-5"><p className="display text-[clamp(1.7rem,3.6vw,3.6rem)] leading-[1.12]">{t(p.concept)}</p></Reveal>
        </div>
      </section>

      {/* ---------------- CHALLENGE / RESPONSE ---------------- */}
      <section className="border-y border-line bg-surface py-20 md:py-32">
        <div className="container-x grid gap-14 md:grid-cols-2 md:gap-24">
          <Reveal>
            <p className="eyebrow mb-4 text-copper">{n("02")} — {u("p.challenge")}</p>
            <p className="text-lg leading-relaxed text-muted">{t(p.challenge)}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-4 text-copper">{n("03")} — {u("p.response")}</p>
            <p className="text-lg leading-relaxed">{t(p.response)}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section aria-label={u("p.gallery")} className="py-24 md:py-40">
        <div className="container-x"><Gallery p={p} open={setLb} /></div>
      </section>

      {/* ---------------- HORIZONTAL: MATERIALS ---------------- */}
      <section aria-label={u("p.materials")} className="bg-alt py-16 md:py-0">
        <div className="container-x pb-8 md:absolute md:hidden"><p className="eyebrow text-muted">{n("04")} — {u("p.materials")}</p></div>
        <HorizontalStory label={u("p.materials")}>
          <div className="hidden w-[26vw] shrink-0 flex-col justify-center pe-10 md:flex">
            <p className="eyebrow text-muted">{n("04")} — {u("p.materials")}</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.4vw,4.6rem)]">{u("p.sequence")}</h2>
            <p className="eyebrow mt-6 text-muted">{u("p.scroll")} →</p>
          </div>
          {p.materials.map((m, i) => (
            <div key={i} className="w-[78vw] shrink-0 snap-center md:w-[30vw]">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Img src={p.images[i % p.images.length].src} alt={t(p.images[i % p.images.length].alt)} fill sizes="(min-width:768px) 30vw, 80vw" quality={70} style={{ objectPosition: ["15% 50%", "85% 50%", "50% 20%", "50% 90%"][i] }} className="img-grade object-cover" />
                <span className="eyebrow num absolute start-3 top-3 bg-bg/90 px-3 py-1.5">M-{n(`0${i + 1}`)}</span>
              </div>
              <h3 className="display mt-5 text-[clamp(1.6rem,2.4vw,2.2rem)]">{t(m.name)}</h3>
              <p className="mt-2 text-muted">{t(m.note)}</p>
            </div>
          ))}
        </HorizontalStory>
      </section>

      {/* ---------------- SPECS ---------------- */}
      <section className="py-24 md:py-40">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-3"><p className="eyebrow text-muted">{n("05")} — {u("p.specs")}</p></Reveal>
          <Reveal as="dl" className="grid gap-x-10 gap-y-0 md:col-span-8 md:col-start-5 sm:grid-cols-2">
            {p.specs.map((s) => (
              <div key={t(s.label)} className="flex items-baseline justify-between gap-6 border-t border-line py-4">
                <dt className="eyebrow text-muted">{t(s.label)}</dt>
                <dd className="num text-end" dir="auto">{t(s.value)}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- PLAN ---------------- */}
      <section className="border-t border-line bg-surface py-24 md:py-40">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-col gap-3 md:mb-16"><p className="eyebrow text-muted">{n("06")} — {u("p.drawing")}</p><h2 className="display text-[clamp(2rem,4.4vw,4rem)]">{u("p.plan")}</h2></Reveal>
          <FloorPlan project={p} />
        </div>
      </section>

      {/* ---------------- RELATED ---------------- */}
      <section className="py-24 md:py-40">
        <div className="container-x">
          <Reveal className="mb-12"><h2 className="display text-[clamp(2rem,4.4vw,4rem)]">{u("p.related")}</h2></Reveal>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
            {rel.map((r) => <ProjectCard key={r.slug} project={r} variant="compact" sizes="(min-width:768px) 33vw, 100vw" />)}
          </div>
        </div>
      </section>

      {/* ---------------- PREV / NEXT ---------------- */}
      <nav aria-label="Project navigation" className="grid border-t border-line md:grid-cols-2">
        {[{ proj: prev, dir: "prev" as const }, { proj: next, dir: "next" as const }].map(({ proj, dir }) => (
          <TLink key={dir} href={`/work/${proj.slug}`} data-cursor={dir === "next" ? u("p.next") : u("p.prev")} className={cn("group relative isolate flex min-h-[44svh] flex-col justify-end overflow-hidden p-6 text-[#f5f3ee] md:p-12", dir === "next" && "md:items-end md:text-end")}>
            <Img src={proj.images[1].src} alt="" fill sizes="50vw" quality={60} className="-z-10 object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-black/55 transition-colors duration-700 group-hover:bg-black/40" />
            <span className="eyebrow mb-3 flex items-center gap-3 text-white/80">
              {dir === "prev" && <ArrowLeft aria-hidden className="size-4 rtl:-scale-x-100" />}
              {dir === "prev" ? u("p.prev") : u("p.next")}
              {dir === "next" && <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />}
            </span>
            <span className="display text-[clamp(2.2rem,5vw,5rem)] leading-none">{t(proj.name)}</span>
            <span className="num mt-3 text-sm text-white/70">{n(proj.no)} — {t(proj.location)}</span>
          </TLink>
        ))}
      </nav>
      <div className="container-x flex justify-center border-t border-line py-10"><Button href="/work" variant="outline" arrow="none">{u("works.all")}</Button></div>

      <ImageLightbox images={p.images} index={lb} onIndex={setLb} onClose={() => setLb(null)} />
    </article>
  );
}
