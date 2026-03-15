'use client';
import { useRef } from 'react';
import { testimonials } from '@/lib/data/testimonials';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

import SectionTitle from '../ui/SectionTitle';

export default function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    // Duplicate list to create a seamless infinite loop
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    useGSAP(() => {
        if (!marqueeRef.current) return;

        const totalWidth = marqueeRef.current.scrollWidth / 3;

        // Simple horizontal marquee
        const marqueeAnimation = gsap.to(marqueeRef.current, {
            x: -totalWidth,
            duration: 40,
            ease: "none",
            repeat: -1,
        });

        // Speed up marquee on scroll
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                const playRate = 1 + self.getVelocity() / 500;
                gsap.to(marqueeAnimation, { timeScale: Math.max(0.5, playRate), duration: 0.5 });
            }
        });

        // Hover pause
        marqueeRef.current.addEventListener('mouseenter', () => marqueeAnimation.pause());
        marqueeRef.current.addEventListener('mouseleave', () => marqueeAnimation.play());

        return () => {
            marqueeAnimation.kill();
        };
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="section-pad overflow-hidden" style={{ background: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <SectionTitle
                    eyebrow="Client Stories"
                    title="Trusted by Delhi’s Discerning Homeowners"
                    description="Real verified reviews from IndiaMart and Justdial. Join 1000+ happy families."
                    dark={true}
                />

                {/* Carousel Container */}
                <div className="relative w-full overflow-hidden -mx-4 md:mx-0">
                    {/* ... Gradient Masks ... */}
                    {/* Gradient Masks */}
                    <div className="absolute top-0 bottom-0 left-0 w-16 md:w-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-charcoal) 0%, transparent 100%)' }} />
                    <div className="absolute top-0 bottom-0 right-0 w-16 md:w-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-charcoal) 0%, transparent 100%)' }} />

                    {/* Marquee Track */}
                    <div ref={marqueeRef} className="flex flex-nowrap w-fit gap-8 px-8">
                        {duplicatedTestimonials.map((t, idx) => (
                            <div
                                key={t.id + idx}
                                className="w-[320px] md:w-[450px] shrink-0 p-10 rounded-3xl flex flex-col justify-between transition-all duration-500 hover:bg-white/[0.08]"
                                style={{ background: 'rgba(245,239,224,0.05)', border: '1px solid rgba(245,239,224,0.1)' }}
                            >
                                <div>
                                    <div className="flex items-center gap-1 mb-6 text-brass">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-base md:text-lg leading-relaxed mb-8 italic" style={{ color: 'rgba(245,239,224,0.9)' }}>
                                        &quot;{t.quote}&quot;
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-8 border-t" style={{ borderColor: 'rgba(245,239,224,0.1)' }}>
                                    <div>
                                        <h4 className="font-semibold text-base mb-0.5" style={{ color: '#F5EFE0' }}>{t.name}</h4>
                                        <p className="text-xs tracking-tight" style={{ color: 'rgba(245,239,224,0.5)' }}>{t.project} · {t.city}</p>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border" style={{ borderColor: 'rgba(245,239,224,0.1)', color: 'var(--color-brass-light)' }}>
                                        {t.source}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

