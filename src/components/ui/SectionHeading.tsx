"use client";
import { SplitReveal, Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({ no, kicker, title, lines, className, size = "lg", as = "h2" }: { no?: string; kicker: string; title?: string; lines?: string[]; className?: string; size?: "md" | "lg" | "xl"; as?: "h1" | "h2" }) {
  const sz = { md: "text-[clamp(2rem,4.4vw,4rem)]", lg: "text-[clamp(2.4rem,6vw,6rem)]", xl: "text-[clamp(3rem,9vw,9rem)]" }[size];
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Reveal className="eyebrow flex items-center gap-4 text-muted">
        {no && <span className="num text-fg">{no}</span>}
        <span aria-hidden className="h-px w-10 bg-current opacity-50" />
        <span>{kicker}</span>
      </Reveal>
      <SplitReveal as={as} text={title} lines={lines} className={cn("display", sz)} />
    </div>
  );
}
