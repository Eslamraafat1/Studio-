"use client";
import Button from "@/components/ui/Button";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { site } from "@/data/studio";

/** Closing statement. Always olive/light-on-dark so the fixed footer is revealed *beneath* a distinct plane. */
export default function ContactCTA() {
  const { u } = useLang();
  return (
    <section aria-labelledby="cta-h" className="grain relative overflow-hidden bg-[#505a49] py-24 text-[#f5f3ee] md:py-40">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-[0.12] invert" />
      <div className="container-x relative">
        <h2 id="cta-h" className="text-[clamp(3rem,10.5vw,11.5rem)]" aria-label={`${u("cta.l1")} ${u("cta.l2")} ${u("cta.l3")}`}>
          <SplitReveal as="span" lines={[u("cta.l1")]} className="display-sans block" stagger={0} />
          <SplitReveal as="span" lines={[u("cta.l2")]} delay={0.1} className="display block italic md:ps-[0.8em]" stagger={0} />
          <SplitReveal as="span" lines={[u("cta.l3")]} delay={0.2} className="display-sans block text-[#c7d1b7]" stagger={0} />
        </h2>
        <div className="mt-16 grid gap-12 md:mt-28 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <Button href="/contact" variant="light" arrow="up">{u("cta.start")}</Button>
          </Reveal>
          <Reveal as="dl" className="grid gap-8 sm:grid-cols-3 md:col-span-7">
            <div>
              <dt className="eyebrow mb-2 text-[#f5f3ee]/60">{u("cta.email")}</dt>
              <dd><a href={`mailto:${site.email}`} className="u-link break-all">{site.email}</a></dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-[#f5f3ee]/60">{u("cta.studio")}</dt>
              <dd className="leading-relaxed">{u("footer.address")}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-[#f5f3ee]/60">{u("cta.social")}</dt>
              <dd className="flex flex-col gap-1">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="u-link w-fit">{s.label}</a>
                ))}
              </dd>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
