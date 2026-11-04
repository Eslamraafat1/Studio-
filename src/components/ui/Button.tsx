"use client";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import TLink from "./TLink";
import { useFinePointer, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Props {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "solid" | "outline" | "text" | "light";
  arrow?: "right" | "up" | "none";
  className?: string;
  magnetic?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}
const base = "group relative inline-flex items-center justify-center gap-3 overflow-hidden eyebrow !text-[0.78rem] font-medium px-7 py-4 min-h-12 select-none disabled:opacity-60 disabled:pointer-events-none";
const variants = {
  solid: "bg-brand text-brandfg",
  light: "bg-bg text-fg",
  outline: "border border-fg/40 text-fg hover:border-fg",
  text: "!px-0 !py-2 !min-h-0",
};

/** Button / link with a magnetic pull on fine pointers and a sliding fill on hover. */
export default function Button({ href, onClick, children, variant = "solid", arrow = "right", className, magnetic = true, type = "button", disabled, ariaLabel }: Props) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const canMag = magnetic && fine && !reduced && variant !== "text";
  const move = (e: MouseEvent) => {
    if (!canMag || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const Arrow = arrow === "up" ? ArrowUpRight : ArrowRight;
  const fill = variant === "light" ? "bg-brand" : "bg-fg";
  const inner = (
    <>
      {variant !== "text" && <span aria-hidden className={cn("absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0", fill)} />}
      <span className={cn("relative z-10 flex items-center gap-3 transition-colors duration-500", (variant === "outline" || variant === "solid") && "group-hover:text-bg group-focus-visible:text-bg", variant === "light" && "group-hover:text-brandfg")}>
        <span className="uc">{children}</span>
        {arrow !== "none" && <Arrow aria-hidden className={cn("size-4 transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1", arrow === "up" && "group-hover:-translate-y-0.5")} />}
      </span>
    </>
  );
  const cls = cn(base, variants[variant], variant === "text" && "u-link", className);
  const style = { transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), color .5s, border-color .5s" };
  if (href) {
    if (/^(https?:|mailto:|tel:)/.test(href))
      return (
        <a ref={ref as never} href={href} className={cls} style={style} onMouseMove={move} onMouseLeave={leave} aria-label={ariaLabel} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inner}
        </a>
      );
    return (
      <TLink ref={ref as never} href={href} className={cls} style={style} onMouseMove={move} onMouseLeave={leave} aria-label={ariaLabel}>
        {inner}
      </TLink>
    );
  }
  return (
    <button ref={ref as never} type={type} onClick={onClick} disabled={disabled} className={cls} style={style} onMouseMove={move} onMouseLeave={leave} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
