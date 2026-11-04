"use client";
import Counter from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { stats } from "@/data/studio";

export default function StudioStats() {
  const { u, t, n } = useLang();
  return (
    <section aria-label={u("stats.kicker")} className="relative border-y border-line bg-surface py-20 md:py-32">
      <div className="container-x">
        <Reveal className="eyebrow mb-12 flex items-center gap-4 text-muted md:mb-20">
          <span className="num text-fg">{n("05")}</span>
          <span aria-hidden className="h-px w-10 bg-current opacity-50" />
          <span>{u("stats.kicker")}</span>
        </Reveal>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="border-t border-fg pt-5">
              <dd className="display text-[clamp(3.6rem,10vw,9.5rem)] leading-[0.85]"><Counter to={s.value} padded={s.pad} /></dd>
              <dt className="eyebrow mt-5 text-muted">{t(s.label)}</dt>
            </Reveal>
          ))}
        </dl>
        <p className="eyebrow mt-14 max-w-2xl text-muted normal-case md:mt-24">{u("stats.note")}</p>
      </div>
    </section>
  );
}
