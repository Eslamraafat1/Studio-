"use client";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";
import { useLang } from "@/lib/i18n";
import { site } from "@/data/studio";

export default function ContactView() {
  const { u } = useLang();
  return (
    <section className="container-x pb-24 pt-36 md:pb-40 md:pt-52">
      <SectionHeading as="h1" size="xl" kicker={u("c.kicker")} title={u("c.title")} />
      <div className="mt-16 grid gap-16 md:mt-28 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="max-w-sm text-lg leading-relaxed text-muted">{u("c.intro")}</p>
          <dl className="mt-12 grid gap-8 border-t border-line pt-8">
            <div><dt className="eyebrow mb-2 text-muted">{u("cta.email")}</dt><dd><a href={`mailto:${site.email}`} className="u-link break-all">{site.email}</a></dd></div>
            <div><dt className="eyebrow mb-2 text-muted">{u("c.direct")}</dt><dd dir="ltr" className="num text-start">{site.phone}</dd><dd className="mt-1 text-sm text-muted">{u("c.hours")}</dd></div>
            <div><dt className="eyebrow mb-2 text-muted">{u("cta.studio")}</dt><dd className="leading-relaxed">{u("footer.address")}<br />{u("footer.address2")}</dd></div>
            <div><dt className="eyebrow mb-2 text-muted">{u("cta.social")}</dt><dd className="flex flex-wrap gap-x-5 gap-y-1">{site.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">{s.label}</a>)}</dd></div>
          </dl>
        </Reveal>
        <div className="md:col-span-7 md:col-start-6"><ContactForm /></div>
      </div>
    </section>
  );
}
