'use client';
import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CONTACT_INFO, OFFICE_GEO } from '@/lib/data/config';
import type { GlobeState } from './EarthScene';

gsap.registerPlugin(ScrollTrigger);

const EarthScene = dynamic(() => import('./EarthScene'), { ssr: false });

const PHASES = [
    { from: 0, label: 'Where we are', title: 'Projects across Delhi NCR.', body: 'Delhi, Noida, Ghaziabad, Gurugram and Faridabad. One studio, one factory, eight kilometres apart.' },
    { from: 0.42, label: 'Closing in', title: 'East Delhi.', body: 'Our studio is on Main Road, Jagat Puri. The factory is across the Yamuna in Indirapuram.' },
];

export default function GlobeFinale() {
    const section = useRef<HTMLElement>(null);
    const state = useRef<GlobeState>({ t: 0 });
    const alt = useRef<HTMLSpanElement>(null);
    // The scene reports camera altitude each frame; write it straight to the DOM.
    const onAltitude = useCallback((km: number) => {
        if (alt.current) alt.current.textContent = Math.round(km).toLocaleString('en-IN');
    }, []);
    const [phase, setPhase] = useState(0);
    const [arrived, setArrived] = useState(false);
    const [reduced, setReduced] = useState(false);

    useGSAP(() => {
        const el = section.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            state.current.t = 1;
            setReduced(true);
            setArrived(true);
            return;
        }
        let lastPhase = -1;
        let lastArrived = false;
        ScrollTrigger.create({
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            onUpdate: (self) => {
                const t = self.progress;
                state.current.t = t;
                const ph = t >= PHASES[1].from ? 1 : 0;
                if (ph !== lastPhase) { lastPhase = ph; setPhase(ph); }
                const a = t > 0.86;
                if (a !== lastArrived) { lastArrived = a; setArrived(a); }
            },
        });
    }, { scope: section });

    const p = PHASES[phase];
    const directions = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_GEO.lat},${OFFICE_GEO.lon}`;

    return (
        <section id="visit" ref={section} className={`relative ${reduced ? 'h-[100svh]' : 'h-[420vh]'} scroll-mt-0`} style={{ background: '#0b0b0c', color: '#F5EFE0' }} aria-label="Find our studio">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                <EarthScene state={state} onAltitude={onAltitude} />

                {/* Scrim for caption legibility over bright land */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(11,11,12,0.85) 0%, rgba(11,11,12,0.35) 35%, rgba(11,11,12,0) 60%), linear-gradient(to bottom, rgba(11,11,12,0.6), rgba(11,11,12,0) 20%)' }} />

                {/* Readouts */}
                <div className="absolute top-20 md:top-24 inset-x-0 container-site flex justify-between label pointer-events-none" style={{ color: 'var(--color-ash)' }}>
                    <span>Sheet V-01 · Location</span>
                    <span className="tabular-nums text-right">Alt <span ref={alt}>20,000</span> km<br className="sm:hidden" /><span className="hidden sm:inline"> · </span>{OFFICE_GEO.lat.toFixed(4)}° N, {OFFICE_GEO.lon.toFixed(4)}° E</span>
                </div>

                {/* Phase caption */}
                <div className={`absolute left-0 right-0 bottom-0 container-site pb-10 md:pb-16 pointer-events-none transition-opacity duration-700 ${arrived ? 'opacity-0' : 'opacity-100'}`}>
                    <div key={phase} className="max-w-xl" style={{ animation: 'stageIn 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
                        <p className="label mb-4" style={{ color: 'var(--color-brass-light)' }}>{p.label}</p>
                        <h2 className="display" style={{ fontSize: 'clamp(44px, 7vw, 120px)' }}>{p.title}</h2>
                        <p className="mt-5 text-base leading-relaxed max-w-md" style={{ color: 'var(--color-ash)' }}>{p.body}</p>
                    </div>
                </div>

                {/* Arrival card */}
                <div
                    className="absolute z-[30] right-0 left-0 bottom-0 md:left-auto md:right-8 lg:right-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[420px] transition-[opacity,transform] duration-700"
                    style={{ opacity: arrived ? 1 : 0, transform: arrived ? undefined : 'translateY(24px)', pointerEvents: arrived ? 'auto' : 'none' }}
                    aria-hidden={!arrived}
                >
                    <div className="m-4 md:m-0" style={{ background: '#F5EFE0', color: '#2C2416' }}>
                        <div className="relative aspect-[16/10] overflow-hidden hidden md:block" style={{ background: '#EBE2CF' }}>
                            {arrived && (
                                <iframe
                                    title="AMS studio on Google Maps"
                                    src={`https://maps.google.com/maps?q=${CONTACT_INFO.mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 0, filter: 'grayscale(0.9) contrast(1.05)' }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            )}
                        </div>
                        <div className="p-6 md:p-7">
                            <p className="label mb-3" style={{ color: 'var(--color-brass)' }}>Studio · open Mon–Sat, 10–7</p>
                            <address className="not-italic display text-3xl leading-[0.95]">72-A, Main Road<br />Jagat Puri, Shahdara<br />New Delhi 110051</address>
                            <p className="mono text-[11px] mt-4" style={{ color: 'var(--color-mute)' }}>Factory: Royal Tower, Indirapuram, Ghaziabad (8 km)</p>
                            <div className="mt-6 grid grid-cols-2 gap-2">
                                <a href={directions} target="_blank" rel="noreferrer" className="label py-3.5 text-center" style={{ background: '#2C2416', color: '#F5EFE0' }}>Directions →</a>
                                <a href={`tel:${CONTACT_INFO.phone1}`} className="label py-3.5 text-center border" style={{ borderColor: 'rgba(44,36,22,0.25)' }}>Call studio</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
