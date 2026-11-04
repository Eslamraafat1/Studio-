import { notFound } from "next/navigation";
import ArticleView from "@/components/journal/ArticleView";
import { articles, getArticle } from "@/data/journal";
import { pageMeta } from "@/lib/seo";
import { site } from "@/data/studio";

export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { ...pageMeta({ title: a.title.en, description: a.dek.en, path: `/journal/${a.slug}`, image: a.image }), authors: [{ name: a.author }] };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title.en,
    description: a.dek.en,
    datePublished: a.date,
    author: { "@type": "Person", name: a.author },
    publisher: { "@type": "Organization", name: "MONOLITH®", url: site.url },
    image: `${site.url}${a.image}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ArticleView article={a} />
    </>
  );
}
