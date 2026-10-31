'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BUILD_STAGES } from '@/lib/data/build';
import { useAppStore } from '@/lib/store/useAppStore';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import type { BuildState } from './HouseScene';

gsap.registerPlugin(ScrollTrigger);

const HouseScene = dynamic(() => import('./HouseScene'), { ssr: false });

const P_MIN = -0.6;
const P_MAX = 8.4;

export default function BuildHero() {
    const section = useRef<HTMLElement>(null);
    const intro = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLSpanElement>(null);
    const state = useRef<BuildState>({ p: P_MIN });
    const [stage, setStage] = useState(0);
    const [done, setDone] = useState(false);
    const introDone = useAppStore((s) => s.introDone);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    useGSAP(() => {
        const el = section.current;
        if (!el) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            state.current.p = P_MAX;
            setStage(7);
            setDone(true);
            return;
        }
        let lastStage = -1;
        let lastDone = false;
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
                // Intro copy hands over to the stage panel in the first beat.
                const k = gsap.utils.clamp(0, 1, (p - P_MIN) / 0.75);
                if (intro.current) { intro.current.style.opacity = String(1 - k); intro.current.style.transform = `translateY(${-40 * k}px)`; intro.current.style.pointerEvents = k > 0.6 ? 'none' : 'auto'; }
                if (panel.current) { panel.current.style.opacity = String(gsap.utils.clamp(0, 1, (p + 0.1) / 0.5)); }
                if (bar.current) bar.current.style.transform = `scaleY(${gsap.utils.clamp(0, 1, p / 8)})`;
            },
        });
    }, { scope: section });

    useGSAP(() => {
        if (!introDone) return;
        gsap.fromTo('.bh-line', { yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.08, ease: 'expo.out' });
        gsap.fromTo('.bh-fade', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: 'expo.out', delay: 0.4 });
    }, { scope: section, dependencies: [introDone] });

    const s = BUILD_STAGES[stage];

    return (
        <section id="build" ref={section} className="relative h-[620vh] md:h-[680vh]" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }} aria-label="How we build a house">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                {introDone && <HouseScene state={state} />}

                {/* Soft paper wash on the left keeps type readable over the model */}
                <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: 'linear-gradient(90deg, rgba(241,238,231,0.94) 0%, rgba(241,238,231,0.7) 32%, rgba(241,238,231,0) 55%)' }} />
                <div className="absolute inset-x-0 bottom-0 h-[52%] pointer-events-none md:hidden" style={{ background: 'linear-gradient(0deg, rgba(241,238,231,0.97) 40%, rgba(241,238,231,0) 100%)' }} />

                {/* Intro */}
                <div ref={intro} className="absolute inset-x-0 top-0 container-site pt-24 md:pt-32 z-10">
                    <p className="bh-fade invisible label mb-6 md:mb-8" style={{ color: 'var(--color-mute)' }}>Design · Build · Interiors &nbsp;/&nbsp; Delhi NCR since 2014</p>
                    <h1 className="display max-w-[16ch]" style={{ fontSize: 'clamp(54px, 9vw, 152px)' }}>
                        <span className="line-mask block"><span className="bh-line block">We build the house.</span></span>
                        <span className="line-mask block"><span className="bh-line block">Then we finish</span></span>
                        <span className="line-mask block"><span className="bh-line block" style={{ color: 'var(--color-brass)' }}>every room.</span></span>
                    </h1>
                    <p className="bh-fade invisible mt-7 max-w-md text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-mute)' }}>
                        Construction, modular kitchens and full interiors on one contract, with one site manager from soil test to the last light switch.
                    </p>
                    <div className="bh-fade invisible mt-8 flex flex-wrap items-center gap-3">
                        <button onClick={() => scrollToTarget('#pricing')} className="label px-6 py-4" style={{ background: 'var(--color-charcoal)', color: '#F1EEE7' }}>
                            Price my house →
                        </button>
                        <button onClick={() => openLeadModal({ service: 'House Construction' })} className="label px-6 py-4 border" style={{ borderColor: 'var(--color-border-strong)' }}>
                            Book a site survey
                        </button>
                    </div>
                    <p className="bh-fade invisible label mt-10 hidden md:flex items-center gap-3" style={{ color: 'var(--color-mute)' }}>
                        <span className="inline-block w-8 h-px" style={{ background: 'currentColor' }} /> Scroll to build a G+1 house on a 50 ft plot
                    </p>
                </div>

                {/* Stage panel */}
                <div ref={panel} className="absolute z-10 left-0 right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 container-site pb-8 md:pb-0 opacity-0" aria-live="polite">
                    <div className="max-w-md">
                        <p className="label mb-4 flex items-center gap-3" style={{ color: 'var(--color-mute)' }}>
                            <span className="tabular-nums">Stage {String(stage + 1).padStart(2, '0')} / 08</span>
                            <span className="inline-block w-6 h-px" style={{ background: 'currentColor' }} />
                            <span>{s.weeks}</span>
                        </p>
                        <h2 key={s.id} className="display mb-4" style={{ fontSize: 'clamp(48px, 6.5vw, 108px)', animation: 'stageIn 0.6s cubic-bezier(0.16,1,0.3,1)' }}>{s.title}</h2>
                        <p className="text-[15px] md:text-base leading-relaxed max-w-sm" style={{ color: 'var(--color-mute)' }}>{s.body}</p>
                        {s.price && (
                            <p className="mono text-xs mt-5 inline-flex items-center gap-2 px-3 py-2" style={{ background: 'var(--color-brass)', color: '#fff' }}>{s.price}</p>
                        )}
                        {done && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button onClick={() => scrollToTarget('#pricing')} className="label px-6 py-4" style={{ background: 'var(--color-charcoal)', color: '#F1EEE7' }}>See packages →</button>
                                <button onClick={() => scrollToTarget('#estimate')} className="label px-6 py-4 border" style={{ borderColor: 'var(--color-border-strong)' }}>Estimate my plot</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stage rail */}
                <ol className="absolute z-10 right-6 lg:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 pl-5" aria-label="Construction stages">
                    <span className="absolute left-0 top-1 bottom-1 w-px" style={{ background: 'var(--color-border-strong)' }} aria-hidden="true" />
                    <span ref={bar} className="absolute left-0 top-1 bottom-1 w-px origin-top" style={{ background: 'var(--color-brass)', transform: 'scaleY(0)' }} aria-hidden="true" />
                    {BUILD_STAGES.map((b, i) => (
                        <li key={b.id} className="label flex items-baseline gap-3 transition-colors duration-300" style={{ color: i === stage ? 'var(--color-charcoal)' : i < stage ? 'var(--color-mute)' : 'rgba(18,18,18,0.35)' }}>
                            <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                            <span>{b.title}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
