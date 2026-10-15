'use client';
import { useRef } from 'react';
import BeforeAfter from '../ui/BeforeAfter';
import { Service } from '@/lib/data/services';
import { useAppStore } from '@/lib/store/useAppStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ServiceBlockProps {
    service: Service;
    index: number;
}

export default function ServiceBlock({ service, index }: ServiceBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const openLeadModal = useAppStore(s => s.openLeadModal);

    const isReverse = index % 2 !== 0;

    useGSAP(() => {
        const visual = containerRef.current?.querySelector('.service-visual');
        const content = containerRef.current?.querySelector('.service-content');

        if (!visual || !content) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse',
            }
        });

        // Visual Side parallax and fade
        tl.fromTo(visual,
            { opacity: 0, x: isReverse ? 60 : -60, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }
        );

        // Content Side Staggered entry
        const contentChildren = content.children;
        tl.fromTo(contentChildren,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
            "-=0.6" // overlaps with visual
        );

        // Sub-parallax on visual image wrapper to move slightly on intense scroll
        gsap.to(visual, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    }, { scope: containerRef });

    return (
        <div
            id={service.anchor}
            ref={containerRef}
            className={`relative py-16 md:py-24 ${isReverse ? 'bg-surface' : 'bg-sand'} scroll-mt-16`}
            style={{
                background: isReverse ? 'var(--color-surface)' : 'var(--color-sand)',
                borderBottom: '1px solid var(--color-border-strong)'
            }}
        >
            <div className="container-site">
                <div className={`flex flex-col gap-12 lg:gap-20 ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>

                    {/* Visual Side (50%) */}
                    <div className="service-visual opacity-0 w-full lg:w-1/2 relative">
                        {service.hasBeforeAfter ? (
                            <BeforeAfter
                                beforeImg={service.photos[1]?.src || service.image}
                                afterImg={service.image}
                                beforeAlt={`${service.name} before`}
                                afterAlt={`${service.name} after`}
                            />
                        ) : (
                            <div className="group relative rounded-2xl overflow-hidden shadow-2xl border aspect-[4/3]" style={{ borderColor: 'var(--color-border)' }}>
                                <img
                                    src={service.image}
                                    alt={service.imageAlt || service.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                        )}

                        {/* Overlay Price Tag */}
                        <div
                            className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 p-4 rounded-xl shadow-2xl backdrop-blur-lg flex flex-col gap-1 z-20 border"
                            style={{ background: 'rgba(250,250,247,0.95)', borderColor: 'var(--color-border)', borderLeft: '4px solid var(--color-brass)' }}
                        >
                            <span className="text-[10px] font-bold tracking-widest uppercase text-mute">Starting From</span>
                            <span className="text-2xl font-display font-semibold text-charcoal">
                                {service.priceRange} <span className="text-sm font-normal text-mute">{service.priceUnit}</span>
                            </span>
                        </div>
                    </div>

                    {/* Content Side (50%) */}
                    <div className="service-content opacity-0 w-full lg:w-1/2 flex flex-col">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--color-brass)' }}>
                            {service.tagline}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6" style={{ color: 'var(--color-charcoal)' }}>
                            {service.name}
                        </h2>
                        <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--color-mute)' }}>
                            {service.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-10 pb-10 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            {service.specs.map(spec => (
                                <div key={spec.label} className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-brass-dark)' }}>
                                        {spec.label}
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                                        {spec.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => openLeadModal({ service: service.name })}
                                className="btn-sheen px-8 py-3.5 rounded-xl font-medium text-white shadow-xl hover:-translate-y-1 transition-transform"
                                style={{ background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))' }}
                            >
                                Book Free Assessment
                            </button>
                            <a
                                href={`#gallery`}
                                className="px-8 py-3.5 rounded-xl font-medium text-center border hover:bg-black/5 transition-colors"
                                style={{ color: 'var(--color-charcoal)', borderColor: 'var(--color-border-strong)' }}
                            >
                                View {service.name} Projects
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
