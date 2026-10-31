import Navbar from '@/components/layout/Navbar';
import BuildHero from '@/components/build/BuildHero';
import Manifesto from '@/components/brand/Manifesto';
import ServicesIndex from '@/components/brand/ServicesIndex';
import BuildPricing from '@/components/sections/BuildPricing';
import InteriorRates from '@/components/sections/InteriorRates';
import QuoteCalculator from '@/components/calculator/QuoteCalculator';
import SelectedWork from '@/components/brand/SelectedWork';
import MaterialAtelier from '@/components/brand/MaterialAtelier';
import Experience from '@/components/brand/Experience';
import Voices from '@/components/brand/Voices';
import FaqSection from '@/components/sections/FaqSection';
import GlobeFinale from '@/components/globe/GlobeFinale';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import LeadModal from '@/components/forms/LeadModal';
import StickyLeadBar from '@/components/forms/StickyLeadBar';
import Preloader from '@/components/ui/Preloader';
import WhatsAppFab from '@/components/ui/WhatsAppFab';

export default function Home() {
  return (
    <main id="main" className="relative min-h-screen overflow-x-clip" style={{ background: 'var(--color-sand)' }}>
      <Preloader />
      <Navbar />

      <BuildHero />
      <Manifesto />
      <ServicesIndex />
      <BuildPricing />
      <InteriorRates />
      <QuoteCalculator />
      <SelectedWork />
      <MaterialAtelier />
      <Experience />
      <Voices />
      <FaqSection />
      <GlobeFinale />
      <ContactSection />
      <Footer />

      <LeadModal />
      <StickyLeadBar />
      <WhatsAppFab />
    </main>
  );
}
