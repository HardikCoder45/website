'use client';
import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useAppStore } from '@/lib/store/useAppStore';
import { CONTACT_INFO, STATS } from '@/lib/data/config';
import { defaultSelection, KITCHEN_FINISHES, type FinishSelection } from '@/lib/three/finishes';
import { useCountUp } from '@/lib/hooks/useCountUp';
import Magnetic from '@/components/ui/Magnetic';
import type { HeroSceneState } from './HeroScene';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const ROTATING_WORDS = ['luxury', 'comfort', 'elegance', 'you'];
const SWATCHES = KITCHEN_FINISHES[0].choices.slice(0, 4);

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
    const introDone = useAppStore((s) => s.introDone);
    const { ref, display } = useCountUp<HTMLSpanElement>(value, { decimals, duration: 2000, enabled: introDone });
    return (
        <div className="flex flex-col">
            <span ref={ref} className="font-display text-2xl md:text-3xl font-semibold tabular-nums text-white">
                {Number(display).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-white/60">{label}</span>
        </div>
    );
}

export default function HeroSection() {
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const introDone = useAppStore((s) => s.introDone);
    const heroRef = useRef<HTMLElement>(null);
    const slotRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const sceneState = useRef<HeroSceneState>({ progress: 0, focusOffset: 0 });
    const [selection, setSelection] = useState<FinishSelection>(() => defaultSelection(KITCHEN_FINISHES));
    const [ready, setReady] = useState(false);
    const onReady = useCallback(() => setReady(true), []);

    // Entrance choreography once the preloader has handed over.
    useGSAP(() => {
        if (!introDone) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo('.hero-word', { yPercent: 110 }, { yPercent: 0, stagger: 0.08, duration: 1.4 })
            .fromTo('.hero-fade', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 1 }, '-=1')
            .fromTo(stageRef.current, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.4 }, '-=1');

        const words = gsap.utils.toArray<HTMLElement>('.hero-rotate');
        // Italic descenders overhang the line box, so travel well past the mask edge.
        gsap.set(words.slice(1), { yPercent: 140 });
        if (reduced) return;
        let current = 0;
        const cycle = gsap.delayedCall(3, function next() {
            const out = words[current];
            current = (current + 1) % words.length;
            gsap.to(out, { yPercent: -140, duration: 0.9, ease: 'expo.inOut' });
            gsap.fromTo(words[current], { yPercent: 140 }, { yPercent: 0, duration: 0.9, ease: 'expo.inOut' });
            cycle.restart(true);
        });
    }, { scope: heroRef, dependencies: [introDone] });

    // Scroll: the framed 3D window grows to full-bleed while the camera glides in.
    useGSAP(() => {
        const stage = stageRef.current;
        const slot = slotRef.current;
        const hero = heroRef.current;
        if (!stage || !slot || !hero) return;

        const mm = gsap.matchMedia();
        mm.add({ desktop: '(min-width: 768px)', reduced: '(prefers-reduced-motion: reduce)' }, (ctx) => {
            const { desktop, reduced } = ctx.conditions as { desktop: boolean; reduced: boolean };

            // Inset of the slot inside the sticky viewport → the window's clip-path.
            const insets = () => {
                const s = slot.getBoundingClientRect();
                const v = stage.getBoundingClientRect();
                return { t: s.top - v.top, r: v.right - s.right, b: v.bottom - s.bottom, l: s.left - v.left };
            };
            const clip = (i: { t: number; r: number; b: number; l: number }, radius: number) =>
                `inset(${i.t}px ${i.r}px ${i.b}px ${i.l}px round ${radius}px)`;
            const setFocus = () => {
                const i = insets();
                sceneState.current.focusOffset = (i.t - i.b) / 2;
            };
            // Expose the visible window's edges so the overlay controls follow it.
            const setEdges = (i: { t: number; r: number; b: number; l: number }) => {
                stage.style.setProperty('--win-b', `${i.b}px`);
                stage.style.setProperty('--win-l', `${i.l}px`);
                stage.style.setProperty('--win-r', `${i.r}px`);
            };

            const apply = () => { const i = insets(); stage.style.clipPath = clip(i, 28); setEdges(i); setFocus(); };
            apply();
            window.addEventListener('resize', apply);

            if (!desktop || reduced) {
                return () => window.removeEventListener('resize', apply);
            }

            const proxy = { p: 0 };
            gsap.to(proxy, {
                p: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    onRefresh: apply,
                },
                onUpdate: () => {
                    const i = insets();
                    const k = 1 - proxy.p;
                    const cur = { t: i.t * k, r: i.r * k, b: i.b * k, l: i.l * k };
                    stage.style.clipPath = clip(cur, 28 * k);
                    setEdges(cur);
                    sceneState.current.progress = proxy.p;
                    setFocus();
                },
            });
            gsap.to('.hero-copy', {
                yPercent: -30,
                autoAlpha: 0,
                ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: '35% top', scrub: true },
            });
            gsap.fromTo('.hero-overlay', { autoAlpha: 0, y: 30 }, {
                autoAlpha: 1,
                y: 0,
                ease: 'none',
                scrollTrigger: { trigger: hero, start: '55% bottom', end: '80% bottom', scrub: true },
            });
            return () => window.removeEventListener('resize', apply);
        });
        return () => mm.revert();
    }, { scope: heroRef });

    return (
        <section id="hero-section" ref={heroRef} className="relative md:h-[240vh]" style={{ background: 'var(--color-sand)' }}>
            <div className="md:sticky md:top-0 md:h-screen relative overflow-hidden">
                {/* Copy */}
                <div className="hero-copy relative z-10 container-site pt-28 md:pt-32 md:pb-6 md:h-full flex flex-col pointer-events-none">
                    <div className="hero-fade invisible flex items-center justify-between gap-6 mb-6 md:mb-8">
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: 'var(--color-brass-dark)' }}>
                            AMS Interiors · Delhi NCR · Since 2014
                        </span>
                        <span className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--color-mute)' }}>
                            <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full pulse-ring" style={{ background: '#2fa36b' }} /><span className="relative w-2 h-2 rounded-full" style={{ background: '#2fa36b' }} /></span>
                            Live 3D · move your cursor
                        </span>
                    </div>

                    <div className="grid md:grid-cols-[1fr_auto] items-end gap-8 md:gap-16">
                        <h1 className="font-display font-light leading-[0.92] tracking-[-0.03em]" style={{ fontSize: 'clamp(52px, 8.4vw, 148px)', color: 'var(--color-charcoal)' }}>
                            <span className="line-mask mr-[0.2em]"><span className="hero-word inline-block">Spaces</span></span>
                            <span className="line-mask mr-[0.2em]"><span className="hero-word inline-block">that</span></span>
                            <span className="line-mask"><span className="hero-word inline-block">define</span></span>
                            <br />
                            <span className="line-mask">
                                <span className="hero-word inline-grid italic" style={{ color: 'var(--color-brass)' }}>
                                    {ROTATING_WORDS.map((w) => (
                                        <span key={w} className="hero-rotate col-start-1 row-start-1 inline-block pr-[0.06em]">{w}.</span>
                                    ))}
                                </span>
                            </span>
                            <span className="sr-only">Spaces that define luxury.</span>
                        </h1>

                        <div className="flex flex-col gap-6 md:max-w-[340px] md:pb-3 pointer-events-auto">
                            <p className="hero-fade invisible text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-mute)' }}>
                                Modular kitchens, wardrobes and full-home interiors — designed in 3D, made in our own factory.
                            </p>
                            <div className="hero-fade invisible flex flex-wrap items-center gap-4">
                                <Magnetic>
                                    <button
                                        onClick={() => openLeadModal({ service: 'Full Home Interior' })}
                                        className="btn-sheen px-7 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                                        style={{ background: 'var(--color-charcoal)' }}
                                    >
                                        Book free site visit
                                    </button>
                                </Magnetic>
                                <a href="#tours" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-charcoal)' }}>
                                    3D tours
                                    <span className="w-8 h-8 rounded-full border flex items-center justify-center transition-transform group-hover:translate-x-1" style={{ borderColor: 'var(--color-border-strong)' }}>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Where the 3D window sits before it expands */}
                    <div ref={slotRef} className="mt-8 md:mt-10 h-[56vh] md:h-auto md:flex-1" style={{ minHeight: 0 }} aria-hidden="true" />
                </div>

                {/* 3D stage (full viewport, revealed through a clip-path) */}
                <div
                    ref={stageRef}
                    className="invisible absolute inset-0 md:inset-0 z-0 overflow-hidden"
                    style={{ background: '#1a140e', clipPath: 'inset(100% 0 0 0)' }}
                    data-cursor="Drag"
                >
                    {/* Poster render shown until the live 3D scene is ready */}
                    <div className="absolute inset-0 z-[1] transition-opacity duration-1000 pointer-events-none" style={{ opacity: ready ? 0 : 1 }} aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/renders/kitchen-wenge.webp" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 70%' }} />
                    </div>
                    {introDone && <HeroScene state={sceneState} selection={selection} onReady={onReady} />}

                    {/* Overlay controls inside the window */}
                    <div
                        className="absolute z-10 p-5 md:p-8 flex flex-wrap items-end justify-between gap-6 pointer-events-none"
                        style={{ left: 'var(--win-l, 0px)', right: 'var(--win-r, 0px)', bottom: 'var(--win-b, 0px)', background: 'linear-gradient(to top, rgba(10,8,5,0.6), transparent)' }}
                    >
                        <div className="pointer-events-auto">
                            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/70 mb-2">Try a shutter finish</p>
                            <div className="flex gap-2">
                                {SWATCHES.map((c) => {
                                    const on = selection.cabinets === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelection((s) => ({ ...s, cabinets: c.id }))}
                                            aria-pressed={on}
                                            aria-label={`Cabinet finish: ${c.label}`}
                                            title={c.label}
                                            className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                                            style={{ background: c.swatch, boxShadow: on ? '0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px #fff' : 'inset 0 0 0 1px rgba(255,255,255,0.3)' }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div className="hero-overlay hidden md:flex gap-10">
                            {STATS.map((s) => <Stat key={s.label} {...s} />)}
                        </div>

                        <a href="/kitchen" className="pointer-events-auto inline-flex items-center gap-3 px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-xl border text-white transition-colors hover:bg-white hover:text-charcoal" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.25)' }}>
                            Enter full 3D tour
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact strip (mobile only — desktop has it in the footer and nav) */}
            <div className="md:hidden container-site flex items-center justify-between py-4 text-xs" style={{ color: 'var(--color-mute)' }}>
                <a href={`tel:${CONTACT_INFO.phone1}`} className="font-semibold" style={{ color: 'var(--color-charcoal)' }}>{CONTACT_INFO.phone1Display}</a>
                <span>{CONTACT_INFO.addressShort}</span>
            </div>
        </section>
    );
}
