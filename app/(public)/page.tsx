import { AboutSection } from "@/components/home/AboutSection";
import { CollabSection } from "@/components/home/CollabSection";
import { ContactSection } from "@/components/home/ContactSection";
import { EventBanner } from "@/components/home/EventBanner";
import { GallerySection } from "@/components/home/GallerySection";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <CollabSection />
      <GallerySection />
      <EventBanner />
      <ContactSection />
    </main>
  );
}
