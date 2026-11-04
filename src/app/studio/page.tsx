import StudioView from "@/components/studio/StudioView";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Studio",
  description: "MONOLITH® is an independent architecture studio between Copenhagen and Cairo — its philosophy, history, team and disciplines.",
  path: "/studio",
  image: "/images/studio/workshop-1.jpg",
});
export default function StudioPage() {
  return <StudioView />;
}
