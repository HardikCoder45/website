'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BUILD_STAGES, HERO_P, SHOWCASE, heroPhase, type HeroPhase } from '@/lib/data/build';
import { useAppStore } from '@/lib/store/useAppStore';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import type { BuildState } from './HouseScene';

gsap.registerPlugin(ScrollTrigger);

const HouseScene = dynamic(() => import('./HouseScene'), { ssr: false });

const { start: P_MIN, built: P_BUILT, enter: P_ENTER, swap: P_SWAP, end: P_MAX } = HERO_P;

/** Opacity of the dark "doorway" cut: into the living room, and between rooms. */
function cutOpacity(p: number) {
    const bump = (c: number, w: number) => Math.max(0, 1 - Math.abs(p - c) / w);
    return Math.min(1, bump(P_ENTER, 0.32) * 1.6 + bump(P_SWAP, 0.26) * 1.6);
}

export default function BuildHero() {
    const section = useRef<HTMLElement>(null);
    const intro = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLSpanElement>(null);
    const cut = useRef<HTMLDivElement>(null);
    const state = useRef<BuildState>({ p: P_MIN });
    const [stage, setStage] = useState(0);
    const [done, setDone] = useState(false);
    const [phase, setPhase] = useState<HeroPhase>('house');
    const introDone = useAppStore((s) => s.introDone);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    useGSAP(() => {
        const el = section.current;
        if (!el) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            state.current.p = P_BUILT;
            setStage(7);
            setDone(true);
            return;
        }
        let lastStage = -1;
        let lastDone = false;
        let lastPhase: HeroPhase = 'house';
        ScrollTrigger.create({
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
                const p = P_MIN + self.progress * (P_MAX - P_MIN);
                state.current.p = p;
                const s = Math.max(0, Math.min(7, Math.floor(p)));
                if (s !== lastStage) { lastStage = s; setStage(s); }
                const d = p > 7.7;
                if (d !== lastDone) { lastDone = d; setDone(d); }
                const ph = heroPhase(p);
                if (ph !== lastPhase) { lastPhase = ph; setPhase(ph); }
                // Intro copy hands over to the stage panel in the first beat.
                const k = gsap.utils.clamp(0, 1, (p - P_MIN) / 0.75);
                if (intro.current) { intro.current.style.opacity = String(1 - k); intro.current.style.transform = `translateY(${-40 * k}px)`; intro.current.style.pointerEvents = k > 0.6 ? 'none' : 'auto'; }
                // The panel fades out while the camera walks to the glass, and back in inside.
                const walk = gsap.utils.clamp(0, 1, (p - P_BUILT) / 0.4) * gsap.utils.clamp(0, 1, (P_ENTER - p) / 0.15);
                if (panel.current) panel.current.style.opacity = String(gsap.utils.clamp(0, 1, (p + 0.1) / 0.5) * (1 - walk));
                if (bar.current) bar.current.style.transform = `scaleY(${gsap.utils.clamp(0, 1, (p - P_MIN) / (P_MAX - P_MIN))})`;
                if (cut.current) cut.current.style.opacity = String(cutOpacity(p));
            },
        });
    }, { scope: section });

    useGSAP(() => {
        if (!introDone) return;
        gsap.fromTo('.bh-line', { yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.08, ease: 'expo.out' });
        gsap.fromTo('.bh-fade', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: 'expo.out', delay: 0.4 });
    }, { scope: section, dependencies: [introDone] });

    const s = BUILD_STAGES[stage];
    const inside = phase !== 'house';
    const room = inside ? SHOWCASE[phase] : null;
    const sub = inside ? 'rgba(245,239,224,0.72)' : 'var(--color-mute)';
    const rail = [...BUILD_STAGES.map((b) => b.title), 'Living room', 'Kitchen'];
    const railIndex = inside ? (phase === 'living' ? 8 : 9) : stage;

    return (
        <section id="build" ref={section} className="relative h-[880vh] md:h-[960vh]" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }} aria-label="How we build and finish a house">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                {introDone && <HouseScene state={state} />}

                {/* Washes keep type readable: sand over the house, walnut over the rooms. */}
                <div className="absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-700" style={{ opacity: inside ? 0 : 1, background: 'linear-gradient(90deg, rgba(245,239,224,0.94) 0%, rgba(245,239,224,0.7) 32%, rgba(245,239,224,0) 55%)' }} />
                <div className="absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-700" style={{ opacity: inside ? 1 : 0, background: 'linear-gradient(90deg, rgba(28,21,14,0.88) 0%, rgba(28,21,14,0.55) 30%, rgba(28,21,14,0) 55%)' }} />
                <div className="absolute inset-x-0 bottom-0 h-[64%] pointer-events-none md:hidden" style={{ background: inside ? 'linear-gradient(0deg, rgba(28,21,14,0.95) 40%, rgba(28,21,14,0) 100%)' : 'linear-gradient(0deg, rgba(245,239,224,0.97) 40%, rgba(245,239,224,0) 100%)' }} />

                {/* Doorway cut between the outside and each room */}
                <div ref={cut} className="absolute inset-0 pointer-events-none z-[5]" style={{ background: '#1c150e', opacity: 0 }} aria-hidden="true" />

                {/* Intro */}
                <div ref={intro} className="absolute inset-x-0 top-0 container-site pt-24 md:pt-32 pb-14 md:pb-0 z-10 bg-[linear-gradient(180deg,rgba(245,239,224,0.96)_0%,rgba(245,239,224,0.88)_70%,rgba(245,239,224,0)_100%)] md:bg-none">
                    <p className="bh-fade invisible label mb-6 md:mb-8" style={{ color: 'var(--color-mute)' }}>AMS Interiors &nbsp;·&nbsp; Delhi NCR since 2014</p>
                    <h1 className="display max-w-[15ch]" style={{ fontSize: 'clamp(54px, 8.6vw, 148px)' }}>
                        <span className="line-mask block"><span className="bh-line block">From the foundation</span></span>
                        <span className="line-mask block"><span className="bh-line block">to the last</span></span>
                        <span className="line-mask block"><span className="bh-line block italic" style={{ color: 'var(--color-brass)' }}>kitchen drawer.</span></span>
                    </h1>
                    <p className="bh-fade invisible mt-7 max-w-md text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-mute)' }}>
                        Modular kitchens, wardrobes and full-home interiors, and the house around them if you need it built. Kitchens from ₹1,000 per sq ft.
                    </p>
                    <div className="bh-fade invisible mt-8 flex flex-wrap items-center gap-3">
                        <button onClick={() => scrollToTarget('#estimate')} className="label px-6 py-4" style={{ background: 'var(--color-charcoal)', color: '#F5EFE0' }}>
                            Get a price →
                        </button>
                        <button onClick={() => openLeadModal({ service: 'Modular Kitchen' })} className="label px-6 py-4 border" style={{ borderColor: 'var(--color-border-strong)' }}>
                            Book a free site visit
                        </button>
                    </div>
                    <p className="bh-fade invisible label mt-10 hidden md:flex items-center gap-3" style={{ color: 'var(--color-mute)' }}>
                        <span className="inline-block w-8 h-px" style={{ background: 'currentColor' }} /> Scroll to build a house, then walk inside
                    </p>
                </div>

                {/* Stage / room panel */}
                <div ref={panel} className="absolute z-10 left-0 right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 container-site pb-8 md:pb-0 opacity-0" aria-live="polite">
                    <div className="max-w-md">
                        {room ? (
                            <>
                                <p className="label mb-4" style={{ color: 'var(--color-brass-light)' }}>{room.eyebrow}</p>
                                <h2 key={phase} className="display mb-4" style={{ fontSize: 'clamp(48px, 6.2vw, 104px)', color: '#F5EFE0', animation: 'stageIn 0.7s cubic-bezier(0.16,1,0.3,1)' }}>{room.title}</h2>
                                <p className="text-[15px] md:text-base leading-relaxed max-w-sm" style={{ color: sub }}>{room.body}</p>
                                <p className="mono text-xs mt-5 inline-flex items-center gap-2 px-3 py-2" style={{ background: 'var(--color-brass)', color: '#fff' }}>{room.price}</p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button onClick={() => scrollToTarget('#interior-rates')} className="label px-6 py-4" style={{ background: '#F5EFE0', color: '#2C2416' }}>See the rate card →</button>
                                    <button onClick={() => openLeadModal({ service: phase === 'kitchen' ? 'Modular Kitchen' : 'Full Home Interior' })} className="label px-6 py-4 border" style={{ borderColor: 'rgba(245,239,224,0.35)', color: '#F5EFE0' }}>Design mine</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="label mb-4 flex items-center gap-3" style={{ color: 'var(--color-mute)' }}>
                                    <span className="tabular-nums">Stage {String(stage + 1).padStart(2, '0')} / 08</span>
                                    <span className="inline-block w-6 h-px" style={{ background: 'currentColor' }} />
                                    <span>{s.weeks}</span>
                                </p>
                                <h2 key={s.id} className="display mb-4" style={{ fontSize: 'clamp(48px, 6.2vw, 104px)', animation: 'stageIn 0.6s cubic-bezier(0.16,1,0.3,1)' }}>{s.title}</h2>
                                <p className="text-[15px] md:text-base leading-relaxed max-w-sm" style={{ color: 'var(--color-mute)' }}>{s.body}</p>
                                {s.price && (
                                    <p className="mono text-xs mt-5 inline-flex items-center gap-2 px-3 py-2" style={{ background: 'var(--color-brass)', color: '#fff' }}>{s.price}</p>
                                )}
                                {done && (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button onClick={() => scrollToTarget('#pricing')} className="label px-6 py-4" style={{ background: 'var(--color-charcoal)', color: '#F5EFE0' }}>Construction rates →</button>
                                        <button onClick={() => scrollToTarget('#estimate')} className="label px-6 py-4 border" style={{ borderColor: 'var(--color-border-strong)' }}>Estimate my plot</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Progress rail: eight build stages, then the two rooms */}
                <ol className="absolute z-10 right-6 lg:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 pl-5" aria-label="Build stages and rooms">
                    <span className="absolute left-0 top-1 bottom-1 w-px" style={{ background: inside ? 'rgba(245,239,224,0.25)' : 'var(--color-border-strong)' }} aria-hidden="true" />
                    <span ref={bar} className="absolute left-0 top-1 bottom-1 w-px origin-top" style={{ background: 'var(--color-brass)', transform: 'scaleY(0)' }} aria-hidden="true" />
                    {rail.map((title, i) => (
                        <li key={title} className={`label flex items-baseline gap-3 transition-colors duration-300 ${i === 8 ? 'mt-3' : ''}`} style={{ color: i === railIndex ? (inside ? '#F5EFE0' : 'var(--color-charcoal)') : i < railIndex ? sub : inside ? 'rgba(245,239,224,0.4)' : 'rgba(44,36,22,0.35)' }}>
                            <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                            <span>{title}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
