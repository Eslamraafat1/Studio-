"use client";
import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import JournalCard from "./JournalCard";
import { articles, jCats, type JCat } from "@/data/journal";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function JournalIndex() {
  const { u, t } = useLang();
  const [cat, setCat] = useState<JCat | "all">("all");
  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => a !== featured && (cat === "all" || a.category === cat));
  const showFeatured = cat === "all" || featured.category === cat;
  return (
    <>
      <section className="container-x pb-12 pt-36 md:pb-20 md:pt-52">
        <SectionHeading as="h1" size="xl" kicker={u("journal.kicker")} title={u("journal.title")} />
        <Reveal className="mt-12">
          <div role="group" aria-label={u("works.filter")} className="flex flex-wrap gap-2">
            {[{ id: "all" as const, label: u("journal.cat.all") }, ...(Object.keys(jCats) as JCat[]).map((k) => ({ id: k, label: t(jCats[k]) }))].map((c) => (
              <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={cn("eyebrow min-h-11 border px-4 py-2 transition-colors duration-500", cat === c.id ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>{c.label}</button>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="container-x pb-24 md:pb-40" aria-live="polite">
        {showFeatured && (
          <div className="mb-20 md:mb-32">
            <p className="eyebrow mb-5 text-copper">{u("journal.featured")}</p>
            <JournalCard a={featured} variant="wide" priority />
          </div>
        )}
        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          {rest.map((a, i) => {
            const pattern = ["md:col-span-5", "md:col-span-6 md:col-start-7 md:mt-24", "md:col-span-7", "md:col-span-4 md:col-start-9", "md:col-span-6"];
            return <JournalCard key={a.slug} a={a} variant={a.layout === "tall" ? "tall" : a.layout === "wide" ? "standard" : "standard"} className={cn("col-span-12", pattern[i % pattern.length])} />;
          })}
        </div>
        {!rest.length && !showFeatured && <p className="py-20 text-center text-muted">{u("works.empty")}</p>}
      </section>
    </>
  );
}
