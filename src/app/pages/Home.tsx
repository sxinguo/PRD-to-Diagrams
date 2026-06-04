import { HeroSection } from "../components/HeroSection";
import { ShowcaseSection } from "../components/ShowcaseSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { FAQSection } from "../components/FAQSection";

export function Home() {
  return (
    <>
      <HeroSection />
      <ShowcaseSection />
      <FeaturesSection />
      <FAQSection />
    </>
  );
}