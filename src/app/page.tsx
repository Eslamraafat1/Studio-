import Hero from "@/components/home/Hero";
import StudioIntro from "@/components/home/StudioIntro";
import BlueprintReality from "@/components/home/BlueprintReality";
import SelectedWorks from "@/components/home/SelectedWorks";
import Philosophy from "@/components/home/Philosophy";
import MaterialExplorer from "@/components/home/MaterialExplorer";
import StudioStats from "@/components/home/StudioStats";
import JournalPreview from "@/components/home/JournalPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <StudioIntro />
      <BlueprintReality />
      <SelectedWorks />
      <Philosophy />
      <MaterialExplorer />
      <StudioStats />
      <JournalPreview />
      <ContactCTA />
    </>
  );
}
