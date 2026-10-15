'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Each card opens one of the interactive 3D walkthroughs in /public.
const TOURS = [
    {
        href: '/kitchen',
        title: 'The Modular Kitchen',
        description: 'Walk around an island kitchen, open the shutters and see how every drawer is planned.',
        thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=900',
        tag: 'Kitchen',
    },
    {
        href: '/interior',
        title: 'The Living Suite',
        description: 'Move through a full-home interior — false ceiling, lighting and furniture in one flow.',
        thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=900',
        tag: 'Interior',
    },
    {
        href: '/wardrobe',
        title: 'The Master Wardrobe',
        description: 'Slide the doors, peek inside and explore custom internals designed around your wardrobe.',
        thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=900',
        tag: 'Wardrobe',
    },
];

export default function VideoShowcase() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo('.tour-card',
            { autoAlpha: 0, y: 80, rotateX: 8 },
            {
                autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out',
                scrollTrigger: { trigger: '.tour-grid', start: 'top 80%' },
            });

        // Staggered vertical drift for depth.
        gsap.utils.toArray<HTMLElement>('.tour-card').forEach((card, i) => {
            gsap.to(card, {
                y: (i - 1) * -40,
                ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
    }, { scope: sectionRef });

    // 3D tilt following the pointer.
    const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType !== 'mouse') return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el.querySelector('.tour-inner'), { rotateY: px * 10, rotateX: -py * 10, duration: 0.6, ease: 'power3' });
    };
    const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
        gsap.to(e.currentTarget.querySelector('.tour-inner'), { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    };

    return (
        <section ref={sectionRef} id="tours" className="section-pad bg-charcoal relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brass/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container-site relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-2 rounded-full bg-brass/10 border border-brass/20 text-brass-light text-[10px] font-bold uppercase tracking-[0.4em] mb-6">
                            Interactive 3D
                        </span>
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                            Step <span className="italic font-normal text-brass-gradient">inside.</span>
                        </h2>
                        <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                            Don&apos;t just look at photos — walk through our signature spaces in real-time 3D, right in your browser.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-[1px] bg-brass/30 hidden lg:block" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest opacity-40">Choose a space</span>
                    </div>
                </div>

                <div className="tour-grid grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: '1200px' }}>
                    {TOURS.map((tour, i) => (
                        <a
                            key={tour.href}
                            href={tour.href}
                            data-cursor="Enter"
                            onPointerMove={onMove}
                            onPointerLeave={onLeave}
                            className="tour-card group block"
                            aria-label={`Open the 3D ${tour.tag.toLowerCase()} walkthrough`}
                        >
                            <div className="tour-inner relative aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden bg-black shadow-2xl will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                                <img
                                    src={tour.thumbnail}
                                    alt=""
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-1000 group-hover:opacity-45 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 50% 120%, rgba(184,137,42,0.35), transparent 60%)' }} />

                                <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                                    <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] text-white/80 border border-white/15 backdrop-blur-md">{tour.tag}</span>
                                    <span className="font-display text-5xl font-bold text-white/10">0{i + 1}</span>
                                </div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-end" style={{ transform: 'translateZ(40px)' }}>
                                    <h3 className="text-3xl font-display font-bold text-white mb-3">{tour.title}</h3>
                                    <p className="text-sm text-white/60 mb-6 leading-relaxed max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-700">
                                        {tour.description}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="w-12 h-12 rounded-full bg-brass flex items-center justify-center text-white shadow-lg shadow-brass/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                                            </svg>
                                        </span>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Enter 3D tour</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
