"use client";
import { useEffect, useRef, useState } from "react";
import { inView, registerGsap, useReducedMotion } from "@/lib/motion";
import { useLang } from "@/lib/i18n";
import { pad } from "@/lib/utils";

export default function Counter({ to, padded = false, className }: { to: number; padded?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  const reduced = useReducedMotion();
  const { n } = useLang();
  useEffect(() => {
    if (reduced || !ref.current) return;
    const { gsap } = registerGsap();
    const o = { v: 0 };
    let started = false;
    const off = inView(ref.current, () => {
        started = true;
        setV(0);
        gsap.to(o, { v: to, duration: 2.2, ease: "power3.out", onUpdate: () => setV(Math.round(o.v)) });
    });
    return () => {
      off();
      if (started) gsap.killTweensOf(o);
    };
  }, [to, reduced]);
  return (
    <span ref={ref} className={className}>
      {n(padded ? pad(v) : v)}
    </span>
  );
}
