import JournalIndex from "@/components/journal/JournalIndex";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Journal",
  description: "Essays and notes from MONOLITH® on concrete, natural light, sustainability and the practice of architecture.",
  path: "/journal",
  image: "/images/projects/the-silent-house-4.jpg",
});
export default function JournalPage() {
  return <JournalIndex />;
}
