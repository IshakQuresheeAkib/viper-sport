import { AboutSection } from "@/components/home/AboutSection";
import { CollabSection } from "@/components/home/CollabSection";
import { ContactSection } from "@/components/home/ContactSection";
import { EventBanner } from "@/components/home/EventBanner";
import { GallerySection } from "@/components/home/GallerySection";
import { HeroScrollHint, HeroSection } from "@/components/home/HeroSection";
import { MobileBottomNav } from "@/components/home/MobileBottomNav";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <main className="bg-kinetic-surface pb-24 font-body text-kinetic-on-surface md:pb-0">
      <HeroSection />
      <StatsSection />
      <EventBanner />
      <HeroScrollHint />
      <AboutSection />
      <CollabSection />
      <GallerySection />
      <ContactSection />
      <MobileBottomNav />
    </main>
  );
}
