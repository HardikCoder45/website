'use client';
import { useAppStore } from '@/lib/store/useAppStore';
import { CONTACT_INFO } from '@/lib/data/config';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function HeroSection() {
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const heroRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            // cinematic entry
            tl.fromTo('.hero-eyebrow',
                { opacity: 0, y: 20, letterSpacing: '1em' },
                { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 1.5, delay: 0.5 }
            )
                .fromTo('.hero-headline-word',
                    { opacity: 0, y: 100, rotateX: -45, transformOrigin: '0% 50% -50' },
                    { opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 1.2 },
                    "-=1"
                )
                .fromTo('.hero-sub',
                    { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
                    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1 },
                    "-=0.8"
                )
                .fromTo('.hero-cta',
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.7)" },
                    "-=0.6"
                )
                .fromTo('.hero-stats-item',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, stagger: 0.1, duration: 0.8 },
                    "-=0.4"
                );

            // Mouse parallax on headline
            const onMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 20;
                const yPos = (clientY / window.innerHeight - 0.5) * 20;

                gsap.to('.hero-headline', {
                    x: xPos,
                    y: yPos,
                    duration: 1,
                    ease: "power2.out"
                });
            };

            window.addEventListener('mousemove', onMouseMove);
            return () => window.removeEventListener('mousemove', onMouseMove);
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero-section"
            className="relative min-h-screen flex flex-col perspective-1000"
            style={{ background: 'var(--color-charcoal)' }}
            ref={heroRef}
        >
            {/* Background: gradient + decorative pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, #3D3020 0%, #140F08 100%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #B8892A 40px, #B8892A 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #B8892A 40px, #B8892A 41px)',
                    }}
                />

                <HeroCanvas />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex items-center">
                <div className="container-site w-full py-32">
                    <div className="max-w-4xl">

                        {/* Headline */}
                        <h1
                            className="hero-headline font-display font-bold leading-[0.95] tracking-tighter mb-10"
                            style={{ fontSize: 'clamp(48px, 8vw, 110px)', color: '#F5EFE0' }}
                        >
                            <span className="hero-headline-word inline-block mr-[0.2em]">Spaces</span>
                            <span className="hero-headline-word inline-block mr-[0.2em] text-brass-gradient">That</span>
                            <br />
                            <span className="hero-headline-word inline-block mr-[0.2em] text-brass-gradient italic font-normal">Define</span>
                            <span className="hero-headline-word inline-block">Luxury</span>
                        </h1>

                        {/* Sub */}
                        <p
                            className="hero-sub text-lg md:text-2xl mb-12 max-w-2xl leading-relaxed font-body opacity-0"
                            style={{ color: 'rgba(245,239,224,0.75)' }}
                        >
                            Bespoke modular kitchens, signature wardrobes, and turnkey home transformations. Crafted for the most discerning homes in Delhi NCR.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 md:gap-6">
                            <button
                                onClick={() => openLeadModal({ service: 'Full Home Interior' })}
                                className="hero-cta relative group overflow-hidden px-8 md:px-10 py-5 rounded-2xl font-bold text-white text-xs md:text-sm uppercase tracking-widest transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-brass) 0%, var(--color-brass-dark) 100%)',
                                    boxShadow: '0 20px 40px -10px rgba(184,137,42,0.5)',
                                }}
                            >
                                <span className="relative z-10">Start Project Inquiry</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </button>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { label: 'Kitchen 3D', href: '/kitchen' },
                                    { label: 'Interior 3D', href: '/interior' },
                                    { label: 'Wardrobe 3D', href: '/wardrobe' }
                                ].map((tour) => (
                                    <a
                                        key={tour.href}
                                        href={tour.href}
                                        className="hero-cta px-6 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] border-2 transition-all hover:bg-white hover:text-charcoal hover:border-white flex items-center justify-center backdrop-blur-md"
                                        style={{
                                            color: 'white',
                                            borderColor: 'rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        {tour.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Trust stats */}
                        <div className="hero-stats flex flex-wrap gap-12 mt-20">
                            {[
                                { val: '10Y', label: 'Warranty' },
                                { val: '1.2K', label: 'Projects' },
                                { val: '4.9★', label: 'Rating' },
                            ].map((s) => (
                                <div key={s.label} className="hero-stats-item flex flex-col group cursor-default">
                                    <span className="font-display text-4xl font-bold transition-colors group-hover:text-white" style={{ color: 'var(--color-brass-light)' }}>{s.val}</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold mt-1" style={{ color: 'rgba(245,239,224,0.4)' }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact strip */}
            <div
                className="relative z-10 border-t"
                style={{ background: 'rgba(20,15,8,0.8)', borderColor: 'rgba(184,137,42,0.2)' }}
            >
                <div className="container-site h-12 flex items-center justify-between gap-4 flex-wrap">
                    <a
                        href={`https://maps.google.com/maps?q=${CONTACT_INFO.mapQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-body"
                        style={{ color: 'rgba(245,239,224,0.55)' }}
                    >
                        <MapPinIcon />
                        {CONTACT_INFO.addressShort}
                    </a>
                    <div className="flex items-center gap-6">
                        <a href={`tel:${CONTACT_INFO.phone1}`} className="text-xs font-body transition-colors" style={{ color: 'var(--color-brass-light)' }}>
                            {CONTACT_INFO.phone1Display}
                        </a>
                        <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="text-xs font-body flex items-center gap-1" style={{ color: 'var(--color-brass-light)' }}>
                            <WADotIcon /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll hint */}
            <div
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <div className="animate-bounce">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(184,137,42,0.6)" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>
        </section>
    );
}

const MapPinIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const WADotIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);
