"use client";
import { useAppStore } from '@/lib/store/useAppStore';
import { CONTACT_INFO, STATS } from '@/lib/data/config';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { useCountUp } from '@/lib/hooks/useCountUp';
import Magnetic from '@/components/ui/Magnetic';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

const ROTATING_WORDS = ['Luxury', 'Comfort', 'Elegance', 'You'];

const TOURS = [
    { label: 'Kitchen 3D', href: '/kitchen' },
    { label: 'Interior 3D', href: '/interior' },
    { label: 'Wardrobe 3D', href: '/wardrobe' },
];

function Stat({ value, suffix, label, decimals = 0, delay }: { value: number; suffix: string; label: string; decimals?: number; delay: number }) {
    const introDone = useAppStore((s) => s.introDone);
    const { ref, display } = useCountUp<HTMLSpanElement>(value, { decimals, delay: delay + 1400, duration: 2000, enabled: introDone });
    return (
        <div className="hero-stats-item flex flex-col cursor-default opacity-0">
            <span ref={ref} className="font-display text-3xl md:text-4xl font-bold tabular-nums" style={{ color: 'var(--color-brass-light)' }}>
                {Number(display).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold mt-1" style={{ color: 'rgba(245,239,224,0.45)' }}>{label}</span>
        </div>
    );
}

export default function HeroSection() {
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const introDone = useAppStore((s) => s.introDone);
    const heroRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!introDone) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo('.hero-eyebrow', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 1.2 })
            .fromTo('.hero-word', { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, stagger: 0.09, duration: 1.4 }, '-=0.9')
            .fromTo('.hero-sub', { autoAlpha: 0, y: 24, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }, '-=1')
            .fromTo('.hero-cta', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.9 }, '-=0.8')
            .fromTo('.hero-stats-item', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.9 }, '-=0.6')
            .fromTo('.hero-card', { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2 }, '-=0.9')
            .fromTo('.hero-scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, '-=0.6');

        // Cycling last word of the headline.
        const words = gsap.utils.toArray<HTMLElement>('.hero-rotate');
        let current = 0;
        gsap.set(words.slice(1), { yPercent: 110 });
        const cycle = reduced ? null : gsap.delayedCall(3.2, function next() {
            const out = words[current];
            current = (current + 1) % words.length;
            const inn = words[current];
            gsap.to(out, { yPercent: -110, duration: 0.9, ease: 'expo.inOut' });
            gsap.fromTo(inn, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.inOut' });
            cycle?.restart(true);
        });

        // Headline drifts with the pointer; content lifts away on scroll.
        if (!reduced && window.matchMedia('(pointer: fine)').matches) {
            const xTo = gsap.quickTo('.hero-headline', 'x', { duration: 1.2, ease: 'power3' });
            const yTo = gsap.quickTo('.hero-headline', 'y', { duration: 1.2, ease: 'power3' });
            const onMove = (e: PointerEvent) => {
                xTo((e.clientX / window.innerWidth - 0.5) * 18);
                yTo((e.clientY / window.innerHeight - 0.5) * 12);
            };
            window.addEventListener('pointermove', onMove, { passive: true });
            gsap.to('.hero-content', {
                yPercent: -18,
                autoAlpha: 0.2,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            return () => window.removeEventListener('pointermove', onMove);
        }
    }, { scope: heroRef, dependencies: [introDone] });

    return (
        <section
            id="hero-section"
            className="relative min-h-[100svh] flex flex-col perspective-1000"
            style={{ background: 'var(--color-charcoal)' }}
            ref={heroRef}
        >
            {/* Background: gradient + blueprint grid + 3D scene */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, #3D3020 0%, #140F08 100%)' }} />
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #B8892A 40px, #B8892A 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #B8892A 40px, #B8892A 41px)',
                        maskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 70%)',
                    }}
                />
                <HeroCanvas />
                <div className="absolute inset-0 hero-vignette pointer-events-none z-[16]" />
            </div>

            {/* Content */}
            <div className="hero-content relative z-20 flex-1 flex items-center pointer-events-none">
                <div className="container-site w-full pt-32 pb-24">
                    <div className="max-w-4xl pointer-events-auto">
                        <div className="hero-eyebrow invisible flex items-center gap-4 mb-8">
                            <span className="w-12 h-px" style={{ background: 'var(--color-brass)' }} />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]" style={{ color: 'var(--color-brass-light)' }}>
                                Interior Design Studio · Delhi NCR
                            </span>
                        </div>

                        <h1
                            className="hero-headline font-display font-bold leading-[0.95] tracking-tighter mb-10"
                            style={{ fontSize: 'clamp(52px, 8.5vw, 124px)', color: '#F5EFE0' }}
                        >
                            <span className="line-mask mr-[0.22em]"><span className="hero-word inline-block">Spaces</span></span>
                            <span className="line-mask"><span className="hero-word inline-block text-brass-gradient">That</span></span>
                            <br />
                            <span className="line-mask mr-[0.22em]"><span className="hero-word inline-block text-brass-gradient italic font-normal pr-[0.05em]">Define</span></span>
                            <span className="line-mask">
                                <span className="hero-word inline-grid">
                                    {ROTATING_WORDS.map((w) => (
                                        <span key={w} className="hero-rotate col-start-1 row-start-1 inline-block">{w}</span>
                                    ))}
                                </span>
                            </span>
                            <span className="sr-only">Spaces That Define Luxury</span>
                        </h1>

                        <p
                            className="hero-sub invisible text-lg md:text-2xl mb-12 max-w-2xl leading-relaxed font-body font-light"
                            style={{ color: 'rgba(245,239,224,0.75)' }}
                        >
                            Bespoke modular kitchens, signature wardrobes and turnkey home transformations — designed in 3D, built in our own factory, installed by our own crew.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-5">
                            <Magnetic className="hero-cta invisible">
                                <button
                                    onClick={() => openLeadModal({ service: 'Full Home Interior' })}
                                    className="btn-sheen px-8 md:px-10 py-5 rounded-2xl font-bold text-white text-xs md:text-sm uppercase tracking-widest flex items-center gap-3"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-brass) 0%, var(--color-brass-dark) 100%)',
                                        boxShadow: '0 20px 40px -10px rgba(184,137,42,0.5)',
                                    }}
                                >
                                    Book Free Site Visit
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            </Magnetic>

                            {TOURS.map((tour) => (
                                <a
                                    key={tour.href}
                                    href={tour.href}
                                    data-cursor="Enter"
                                    className="hero-cta invisible group px-5 py-4 md:py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] border transition-all duration-500 hover:bg-white hover:text-charcoal hover:border-white flex items-center gap-2 backdrop-blur-md"
                                    style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                                >
                                    <CubeIcon />
                                    {tour.label}
                                </a>
                            ))}
                        </div>

                        {/* Trust stats */}
                        <div className="flex flex-wrap gap-x-12 gap-y-6 mt-16 md:mt-20">
                            {STATS.map((s, i) => (
                                <Stat key={s.label} {...s} delay={i * 120} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating review card */}
            <div className="hero-card invisible hidden xl:block absolute right-[4vw] bottom-28 z-20 w-[300px] p-6 rounded-3xl border backdrop-blur-xl"
                style={{ background: 'rgba(20,15,8,0.55)', borderColor: 'rgba(212,168,75,0.2)', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5" style={{ color: 'var(--color-brass-light)' }}>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(245,239,224,0.4)' }}>IndiaMart</span>
                </div>
                <p className="font-display italic text-lg leading-snug mb-4" style={{ color: '#F5EFE0' }}>
                    &ldquo;Kitchen best quality &amp; best service. The team finished everything in 15 days.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm" style={{ background: 'rgba(184,137,42,0.2)', color: 'var(--color-brass-light)' }}>HV</span>
                    <div>
                        <p className="text-xs font-semibold" style={{ color: '#F5EFE0' }}>Himanshu Verma</p>
                        <p className="text-[10px]" style={{ color: 'rgba(245,239,224,0.45)' }}>Modular Kitchen · Delhi</p>
                    </div>
                </div>
            </div>

            {/* Contact strip */}
            <div
                className="relative z-20 border-t"
                style={{ background: 'rgba(20,15,8,0.8)', borderColor: 'rgba(184,137,42,0.2)' }}
            >
                <div className="container-site h-12 flex items-center justify-between gap-4">
                    <a
                        href={`https://maps.google.com/maps?q=${CONTACT_INFO.mapQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden sm:flex items-center gap-2 text-xs font-body hover:text-white transition-colors"
                        style={{ color: 'rgba(245,239,224,0.55)' }}
                    >
                        <MapPinIcon />
                        {CONTACT_INFO.addressShort}
                    </a>
                    <div className="flex items-center gap-6 ml-auto">
                        <a href={`tel:${CONTACT_INFO.phone1}`} className="text-xs font-body transition-colors hover:text-white" style={{ color: 'var(--color-brass-light)' }}>
                            {CONTACT_INFO.phone1Display}
                        </a>
                        <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="text-xs font-body flex items-center gap-1 hover:text-white transition-colors" style={{ color: 'var(--color-brass-light)' }}>
                            <WADotIcon /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll hint */}
            <div className="hero-scroll invisible absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-3 pointer-events-none">
                <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: 'rgba(245,239,224,0.4)' }}>Scroll</span>
                <span className="relative block w-px h-12 overflow-hidden" style={{ background: 'rgba(184,137,42,0.2)' }}>
                    <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollLine_2s_ease-in-out_infinite]" style={{ background: 'var(--color-brass-light)' }} />
                </span>
            </div>
        </section>
    );
}

const CubeIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
);
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
