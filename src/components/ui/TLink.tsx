"use client";
import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageNav } from "@/components/layout/PageTransition";

type Props = ComponentProps<typeof Link>;
/** next/link that routes through the page-transition curtain. */
export default function TLink({ href, onClick, children, ...rest }: Props) {
  const go = usePageNav();
  const h = typeof href === "string" ? href : href.pathname ?? "/";
  const internal = h.startsWith("/") && !h.startsWith("//");
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || !internal || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || rest.target === "_blank") return;
        if (h.startsWith("/#") || h.includes("#")) return;
        e.preventDefault();
        go(h);
      }}
    >
      {children}
    </Link>
  );
}
