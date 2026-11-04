import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { articles } from "@/data/journal";
import { site } from "@/data/studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = ["", "/work", "/studio", "/approach", "/journal", "/contact"].map((p) => ({ url: site.url + p, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 }));
  return [
    ...base,
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}`, lastModified: new Date(a.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
