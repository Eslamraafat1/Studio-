import type { Metadata } from "next";

export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} — MONOLITH®`, description, url: path, type: "website", siteName: "MONOLITH®", images: image ? [{ url: image, width: 2400, height: 1350 }] : undefined },
    twitter: { card: "summary_large_image", title: `${title} — MONOLITH®`, description },
  };
}
