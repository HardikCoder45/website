'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import TrustBar from '@/components/sections/TrustBar';
import ProductShowcase from '@/components/product/ProductShowcase';
import WhyUs from '@/components/sections/WhyUs';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import VideoShowcase from '@/components/sections/VideoShowcase';
import Showroom from '@/components/sections/Showroom';
import GallerySection from '@/components/gallery/GallerySection';
import EstimateCalculator from '@/components/calculator/EstimateCalculator';
import Testimonials from '@/components/sections/Testimonials';
import FaqSection from '@/components/sections/FaqSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import ProductModal from '@/components/product/ProductModal';
import LeadModal from '@/components/forms/LeadModal';
import StickyLeadBar from '@/components/forms/StickyLeadBar';
import Preloader from '@/components/ui/Preloader';
import WhatsAppFab from '@/components/ui/WhatsAppFab';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const skewRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Kinetic skew: content leans slightly with scroll velocity, then settles.
    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(skewRef.current, "skewY", "deg");
    const clamp = gsap.utils.clamp(-2.5, 2.5);

    ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -500);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });
    // useGSAP reverts everything created here on unmount, so no manual
    // ScrollTrigger.getAll().kill() (which would also kill other sections).
  }, []);

  return (
    <main id="main" className="relative bg-sand min-h-screen overflow-x-clip">
      <Preloader />
      <Navbar />

      <div id="nav-sentinel" className="absolute top-20 left-0 w-full h-px pointer-events-none" />

      <HeroSection />
      <TrustBar />

      {/* Pinned horizontal journey — kept outside the skew wrapper so pinning stays exact */}
      <ProductShowcase />

      <div ref={skewRef} className="relative z-10 bg-surface will-change-transform">
        <WhyUs />
        <ServicesSection />
        <ProcessSection />
        <VideoShowcase />
        <Showroom />
        <GallerySection />
        <EstimateCalculator />
        <Testimonials />
        <FaqSection />
        <ContactSection />
        <Footer />
      </div>

      <ProductModal />
      <LeadModal />
      <StickyLeadBar />
      <WhatsAppFab />
    </main>
  );
}
