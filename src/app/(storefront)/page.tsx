import HeroSection from "@/components/ui/HeroSection";
import ServicesSection from "@/components/ui/ServicesSection";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import SkillsSection from "@/components/ui/SkillsSection";
import CtaBanner from "@/components/ui/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects />
      <SkillsSection />
      <CtaBanner />
    </>
  );
}
