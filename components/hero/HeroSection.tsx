'use client';
import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useAppStore } from '@/lib/store/useAppStore';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import type { AtelierState } from './AtelierScene';

gsap.registerPlugin(ScrollTrigger);

const AtelierScene = dynamic(() => import('./AtelierScene'), { ssr: false });

export default function HeroSection() {
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const introDone = useAppStore((s) => s.introDone);
    const heroRef = useRef<HTMLElement>(null);
    const sceneState = useRef<AtelierState>({ progress: 0 });
    const [ready, setReady] = useState(false);
    const onReady = useCallback(() => setReady(true), []);

    // Entrance once the preloader hands over.
    useGSAP(() => {
        if (!introDone) return;
        gsap.timeline({ defaults: { ease: 'expo.out' } })
            .fromTo('.hero-line', { yPercent: 110 }, { yPercent: 0, duration: 1.6, stagger: 0.12 })
            .fromTo('.hero-fade', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, '-=1.2')
            .fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, '-=1.4');
    }, { scope: heroRef, dependencies: [introDone] });

    // Scroll: the camera pushes into the arch while the copy lifts away.
    useGSAP(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            ScrollTrigger.create({
                trigger: hero,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => { sceneState.current.progress = self.progress; },
            });
            gsap.to('.hero-copy', {
                yPercent: -12,
                autoAlpha: 0,
                ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: '45% top', scrub: true },
            });
            gsap.to('.hero-veil', {
                opacity: 1,
                ease: 'none',
                scrollTrigger: { trigger: hero, start: '60% top', end: 'bottom bottom', scrub: true },
            });
        });
        return () => mm.revert();
    }, { scope: heroRef });

    return (
        <section id="hero-section" ref={heroRef} className="relative md:h-[180vh]" style={{ background: '#0d0c0a', color: '#EEE9E1' }}>
            <div className="md:sticky md:top-0 relative h-[100svh] min-h-[620px] overflow-hidden">
                {/* Live 3D */}
                <div className="absolute inset-0 transition-opacity duration-[1800ms]" style={{ opacity: ready && introDone ? 1 : 0 }}>
                    {introDone && <AtelierScene state={sceneState} onReady={onReady} />}
                </div>
                {/* Legibility gradients + scroll veil */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(13,12,10,0.85) 0%, rgba(13,12,10,0.15) 45%, rgba(13,12,10,0) 60%), linear-gradient(to bottom, rgba(13,12,10,0.6), rgba(13,12,10,0) 22%)' }} />
                <div className="hero-veil absolute inset-0 pointer-events-none opacity-0" style={{ background: '#0d0c0a' }} />

                <div className="hero-copy relative z-10 h-full container-site flex flex-col pt-24 md:pt-28 pb-8 md:pb-10 pointer-events-none">
                    {/* Meta row */}
                    <div className="hero-fade invisible grid grid-cols-2 md:grid-cols-3 gap-4 label" style={{ color: 'var(--color-ash)' }}>
                        <span>( Est. 2014 )</span>
                        <span className="hidden md:block text-center">Interior architecture &amp; joinery</span>
                        <span className="text-right">Delhi NCR — 28.6° N</span>
                    </div>

                    <div className="mt-auto">
                        <h1 className="display uppercase" style={{ fontSize: 'clamp(52px, 10.4vw, 188px)' }}>
                            <span className="line-mask block"><span className="hero-line block">Interiors of</span></span>
                            <span className="line-mask block"><span className="hero-line block"><em className="not-italic md:pl-[0.9em]">quiet</em> <span className="italic font-light normal-case tracking-tight" style={{ color: 'var(--color-brass-light)' }}>luxury</span></span></span>
                        </h1>
                        <span className="sr-only">AMS Interiors — interiors of quiet luxury in Delhi NCR</span>

                        <div className="hero-rule hairline origin-left mt-8 md:mt-10" />

                        <div className="mt-6 md:mt-8 grid md:grid-cols-[1fr_auto] items-end gap-6 md:gap-16">
                            <p className="hero-fade invisible max-w-xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                                Modular kitchens, wardrobes and complete homes — drawn in 3D, built in our own factory and finished by hand. Material-led design for families who notice the details.
                            </p>
                            <div className="hero-fade invisible flex items-center gap-8 pointer-events-auto">
                                <button onClick={() => scrollToTarget('#work')} className="label link-draw pb-1">
                                    View the work ↓
                                </button>
                                <button
                                    onClick={() => openLeadModal({ service: 'Full Home Interior' })}
                                    className="label px-7 py-4 rounded-full transition-colors duration-500 hover:bg-transparent hover:text-[#EEE9E1] border"
                                    style={{ background: '#EEE9E1', color: '#141310', borderColor: '#EEE9E1' }}
                                >
                                    Book a site visit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
