import { notFound } from "next/navigation";
import ProjectView from "@/components/work/ProjectView";
import { getProject, projects } from "@/data/projects";
import { pageMeta } from "@/lib/seo";
import { site } from "@/data/studio";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMeta({ title: `${p.name.en} — ${p.city}`, description: p.seo.en, path: `/work/${p.slug}`, image: p.images[0].src });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name.en,
    description: p.seo.en,
    dateCreated: p.year,
    locationCreated: p.location.en,
    creator: { "@type": "Organization", name: "MONOLITH®", url: site.url },
    image: `${site.url}${p.images[0].src}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProjectView project={p} />
    </>
  );
}
