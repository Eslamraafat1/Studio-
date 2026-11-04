import WorkIndex from "@/components/work/WorkIndex";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Work",
  description: "Six architecture projects across Kyoto, Copenhagen, Cairo, Milan, AlUla and Lisbon — residential, cultural, commercial and hospitality.",
  path: "/work",
  image: "/images/projects/the-silent-house-1.jpg",
});

export default function WorkPage() {
  return <WorkIndex />;
}
