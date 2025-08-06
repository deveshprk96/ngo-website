import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProgramsSection from '@/components/ProgramsSection';
import DonationSection from '@/components/DonationSection';
import UpcomingEventsSection from '@/components/UpcomingEventsSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ProgramsSection />
        <UpcomingEventsSection />
        <DonationSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
