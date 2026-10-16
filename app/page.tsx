import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import Manifesto from '@/components/brand/Manifesto';
import SelectedWork from '@/components/brand/SelectedWork';
import ServicesIndex from '@/components/brand/ServicesIndex';
import MaterialAtelier from '@/components/brand/MaterialAtelier';
import Experience from '@/components/brand/Experience';
import ProcessSection from '@/components/sections/ProcessSection';
import Showroom from '@/components/sections/Showroom';
import Voices from '@/components/brand/Voices';
import EstimateCalculator from '@/components/calculator/EstimateCalculator';
import FaqSection from '@/components/sections/FaqSection';
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

      <HeroSection />
      <Manifesto />
      <SelectedWork />
      <ServicesIndex />
      <MaterialAtelier />
      <Experience />
      <ProcessSection />
      <Showroom />
      <Voices />
      <EstimateCalculator />
      <FaqSection />
      <ContactSection />
      <Footer />

      <LeadModal />
      <StickyLeadBar />
      <WhatsAppFab />
    </main>
  );
}
