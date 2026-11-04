"use client";
import { useEffect } from "react";
import { createPersistedStore } from "./store";

export type Theme = "light" | "dark";
const store = createPersistedStore<Theme>("monolith-theme", "light", ["light", "dark"] as const);

/** Pre-paint script: applies stored theme (or OS preference), language and direction before hydration. */
export const BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("monolith-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;var l=localStorage.getItem("monolith-lang");if(l==="ar"){d.lang="ar";d.dir="rtl"}var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!rm){d.classList.add("anim");if(location.pathname==="/")d.dataset.intro="pending"}}catch(e){}})();`;

export function useTheme() {
  const theme = store.use("light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const set = (t: Theme) => {
    document.documentElement.classList.add("theme-switching");
    store.set(t);
    window.setTimeout(() => document.documentElement.classList.remove("theme-switching"), 450);
  };
  return { theme, setTheme: set, toggle: () => set(theme === "dark" ? "light" : "dark") };
}

/** Respect OS preference on first visit (no stored value). */
export function useInitTheme() {
  useEffect(() => {
    try {
      if (!localStorage.getItem("monolith-theme")) {
        const t: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        store.set(t);
        localStorage.removeItem("monolith-theme");
      }
    } catch {}
  }, []);
}
