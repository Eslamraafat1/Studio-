"use client";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import JournalCard from "@/components/journal/JournalCard";
import { homeArticles } from "@/data/journal";
import { useLang } from "@/lib/i18n";

export default function JournalPreview() {
  const { u, n } = useLang();
  const [a, b, c] = homeArticles;
  return (
    <section aria-label={u("journal.kicker")} className="py-24 md:py-40">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <SectionHeading no={n("06")} kicker={u("journal.kicker")} title={u("journal.title")} className="max-w-3xl" />
          <Reveal><Button href="/journal" variant="outline">{u("journal.all")}</Button></Reveal>
        </div>
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          <JournalCard a={a} variant="tall" className="col-span-12 md:col-span-6" />
          <div className="col-span-12 flex flex-col gap-14 md:col-span-5 md:col-start-8 md:pt-24">
            <JournalCard a={b} variant="standard" />
            <JournalCard a={c} variant="standard" />
          </div>
        </div>
      </div>
    </section>
  );
}
