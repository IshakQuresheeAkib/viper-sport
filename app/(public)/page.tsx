import { AboutSection } from "@/components/home/AboutSection";
import { CollabSection } from "@/components/home/CollabSection";
import { ContactSection } from "@/components/home/ContactSection";
import { FooterSection } from "@/components/home/FooterSection";
import { EventBanner } from "@/components/home/EventBanner";
import { HeroScrollHint, HeroSection } from "@/components/home/HeroSection";
import { DesktopNavbar } from "@/components/home/DesktopNavbar";
import { MobileBottomNav } from "@/components/home/MobileBottomNav";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <main className="bg-kinetic-surface pb-24 font-body text-kinetic-on-surface md:pb-0">
      <DesktopNavbar />
      <HeroSection />
      <StatsSection />
      <EventBanner />
      <HeroScrollHint />
      <AboutSection />
      <CollabSection />
      <ContactSection />
      <FooterSection />
      <MobileBottomNav />
    </main>
  );
}
