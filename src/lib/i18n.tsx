"use client";
import { useEffect } from "react";
import { createPersistedStore } from "./store";
import { ui, type UIKey } from "@/data/ui";

export type Lang = "en" | "ar";
export type L = { en: string; ar: string };
export type LA = { en: string[]; ar: string[] };

const store = createPersistedStore<Lang>("monolith-lang", "en", ["en", "ar"] as const);

export function useLang() {
  const lang = store.use("en");
  const dir = lang === "ar" ? "rtl" : "ltr";
  useEffect(() => {
    const d = document.documentElement;
    d.lang = lang;
    d.dir = dir;
  }, [lang, dir]);
  return {
    lang,
    dir,
    isRTL: lang === "ar",
    setLang: (l: Lang) => store.set(l),
    /** pick a localized string */
    t: (v: L) => v[lang],
    /** pick a localized string array */
    ta: (v: LA) => v[lang],
    /** UI dictionary lookup */
    u: (k: UIKey) => ui[k][lang],
    /** localized numerals (Arabic-Indic for Arabic) */
    n: (v: string | number) => (lang === "ar" ? String(v).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]) : String(v)),
  };
}
