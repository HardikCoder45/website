'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import TrustBar from '@/components/sections/TrustBar';
import ProductShowcase from '@/components/product/ProductShowcase';
import ServicesSection from '@/components/sections/ServicesSection';
import VideoShowcase from '@/components/sections/VideoShowcase';
import GallerySection from '@/components/gallery/GallerySection';
import EstimateCalculator from '@/components/calculator/EstimateCalculator';
import Testimonials from '@/components/sections/Testimonials';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import ProductModal from '@/components/product/ProductModal';
import LeadModal from '@/components/forms/LeadModal';
import StickyLeadBar from '@/components/forms/StickyLeadBar';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const skewRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Advanced Scroll Skew Effect
    let proxy = { skew: 0 },
      skewSetter = gsap.quickSetter(skewRef.current, "skewY", "deg"),
      clamp = gsap.utils.clamp(-5, 5); // Max skew 5 degrees

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
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

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="relative bg-sand min-h-screen overflow-x-hidden">
      <Navbar />

      <div id="nav-sentinel" className="absolute top-20 left-0 w-full h-px pointer-events-none" />

      {/* Intro Sequence: Hero -> Trust */}
      <HeroSection />
      <TrustBar />

      {/* Fullscreen Product Journey (Isolated from skew to ensure perfect pinning) */}
      <ProductShowcase />

      {/* Content wrapper with kinetic skew effect for the remaining sections */}
      <div ref={skewRef} className="relative z-10 bg-surface will-change-transform">
        <ServicesSection />
        <VideoShowcase />
        <GallerySection />

        <EstimateCalculator />
        <Testimonials />
        <ContactSection />

        <Footer />
      </div>

      <ProductModal />
      <LeadModal />
      <StickyLeadBar />
    </main>
  );
}
