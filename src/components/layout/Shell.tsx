"use client";
import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";
import PageTransition from "./PageTransition";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { BackToTop, CustomCursor, Intro, ScrollProgress } from "./Chrome";
import { useLang } from "@/lib/i18n";
import { useInitTheme } from "@/lib/theme";

export default function Shell({ children }: { children: ReactNode }) {
  const { u } = useLang(); // also keeps <html lang/dir> in sync
  useInitTheme();
  return (
    <>
      <a href="#main" className="skip-link eyebrow">{u("nav.skip")}</a>
      <SmoothScroll />
      <Intro />
      <PageTransition>
        <ScrollProgress />
        <SiteHeader />
        <div className="main-wrap relative z-10 bg-bg">
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        </div>
        <SiteFooter />
        <BackToTop />
      </PageTransition>
      <CustomCursor />
    </>
  );
}
