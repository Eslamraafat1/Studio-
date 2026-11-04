"use client";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import ProjectCard from "@/components/work/ProjectCard";
import { projects } from "@/data/projects";
import { useLang } from "@/lib/i18n";

/** Asymmetric gallery: no two consecutive cards share a composition. */
export default function SelectedWorks() {
  const { u, n } = useLang();
  const [p1, p2, p3, p4, p5, p6] = projects;
  return (
    <section id="work" aria-labelledby="works-h" className="relative py-24 md:py-40">
      <div className="container-x">
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-28 md:flex-row md:items-end">
          <SectionHeading no={n("02")} kicker={u("works.kicker")} title={u("works.title")} className="max-w-4xl" />
          <Reveal className="hidden md:block"><Button href="/work" variant="outline" arrow="right">{u("works.all")}</Button></Reveal>
        </div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-28">
          <ProjectCard project={p1} variant="full" priority className="col-span-12" sizes="100vw" />

          <ProjectCard project={p2} variant="tall" className="col-span-12 md:col-span-5" sizes="(min-width:768px) 42vw, 100vw" />
          <ProjectCard project={p3} variant="landscape" className="col-span-12 md:col-span-6 md:col-start-7 md:mt-[22vw]" sizes="(min-width:768px) 50vw, 100vw" />

          <div className="relative col-span-12 md:col-span-5 md:col-start-8 md:row-start-3">
            <span aria-hidden className="num pointer-events-none absolute -top-10 hidden text-[clamp(6rem,14vw,14rem)] leading-none text-fg/[0.06] md:block -start-[40%]">{n(p4.no)}</span>
            <ProjectCard project={p4} variant="tall" sizes="(min-width:768px) 42vw, 100vw" />
          </div>
          <div className="col-span-12 flex items-end md:col-span-5 md:col-start-1 md:row-start-3">
            <Reveal className="max-w-sm border-s border-line ps-6 text-muted">
              <p className="eyebrow mb-3 text-fg">{u("works.kicker")}</p>
              <p className="text-[0.98rem] leading-relaxed">{u("intro.body")}</p>
            </Reveal>
          </div>

          <ProjectCard project={p5} variant="wide" className="col-span-12" sizes="100vw" />

          <ProjectCard project={p6} variant="landscape" className="col-span-12 md:col-span-8 md:col-start-3" sizes="(min-width:768px) 66vw, 100vw" />
        </div>

        <div className="mt-16 flex justify-center md:hidden"><Button href="/work" variant="outline">{u("works.all")}</Button></div>
      </div>
    </section>
  );
}
