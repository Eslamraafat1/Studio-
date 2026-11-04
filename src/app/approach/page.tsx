import ProcessStages from "@/components/approach/ProcessStages";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Approach",
  description: "Discover, Concept, Develop, Realize — the four stages of MONOLITH®'s design methodology, with activities and deliverables.",
  path: "/approach",
  image: "/images/studio/workshop-2.jpg",
});
export default function ApproachPage() {
  return <ProcessStages />;
}
