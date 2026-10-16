'use client';
import { createRef, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { PropName } from '@/components/three/Prop';
import SectionTitle from '@/components/ui/SectionTitle';
import { useAppStore } from '@/lib/store/useAppStore';

const ShowroomCanvas = dynamic(() => import('./ShowroomCanvas'), { ssr: false });

export interface ShowroomItem {
    id: string;
    model: PropName;
    height: number;
    name: string;
    note: string;
    room: string;
    tone: string;
}

// A styling library: the kind of pieces our designers source and place in a
// finished room. Models are open glTF samples (see /models/CREDITS.md).
export const SHOWROOM: ShowroomItem[] = [
    { id: 'velvet', model: 'velvetSofa', height: 0.85, name: 'Curved velvet sofa', note: 'Deep-pile velvet, brass-tipped legs', room: 'Living room', tone: '#ece3d3' },
    { id: 'leather', model: 'leatherSofa', height: 0.85, name: 'Tufted leather sofa', note: 'Aniline leather, solid wood frame', room: 'Lounge', tone: '#e7ddcc' },
    { id: 'lounge', model: 'sheenChair', height: 0.85, name: 'Sheen lounge chair', note: 'Soft-sheen fabric, sculpted shell', room: 'Reading nook', tone: '#efe5d6' },
    { id: 'damask', model: 'damaskChair', height: 0.95, name: 'Damask accent chair', note: 'Button-tufted seat, walnut frame', room: 'Bedroom', tone: '#e9e0d1' },
    { id: 'lamp', model: 'lamp', height: 0.55, name: 'Iridescent table lamp', note: 'Pearlescent glass, linen shade', room: 'Console & bedside', tone: '#ede4d6' },
];

export default function Showroom() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRefs = useMemo<RefObject<HTMLDivElement | null>[]>(() => SHOWROOM.map(() => createRef<HTMLDivElement>()), []);
    const [mount, setMount] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    // Only start WebGL when the section is close to the viewport.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMount(true); obs.disconnect(); } }, { rootMargin: '400px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useGSAP(() => {
        gsap.fromTo('.showroom-card', { autoAlpha: 0, y: 60 }, {
            autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: '.showroom-grid', start: 'top 80%' },
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="showroom" className="section-pad relative scroll-mt-16" style={{ background: 'var(--color-surface)' }}>
            <div className="container-site relative">
                <SectionTitle
                    eyebrow="3D Showroom"
                    title="Every piece, in the round."
                    description="Spin, tilt and inspect the furniture we style into finished rooms — live 3D, no download. Drag any piece to turn it."
                />

                <div className="showroom-grid relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
                    {SHOWROOM.map((item, i) => (
                        <article
                            key={item.id}
                            className={`showroom-card group relative rounded-3xl overflow-hidden border ${i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}
                            style={{ background: item.tone, borderColor: 'var(--color-border)' }}
                        >
                            <div
                                ref={trackRefs[i]}
                                className={`relative w-full ${i < 2 ? 'h-[340px] md:h-[400px]' : 'h-[300px] md:h-[320px]'} touch-pan-y`}
                                data-cursor="Drag"
                                aria-label={`Interactive 3D model: ${item.name}`}
                                role="img"
                            />
                            <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                                <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] border" style={{ borderColor: 'rgba(44,36,22,0.15)', color: 'var(--color-mute)' }}>{item.room}</span>
                                <span className="font-display text-sm" style={{ color: 'var(--color-brass-dark)' }}>0{i + 1}</span>
                            </div>
                            <div className="px-6 pb-6 relative flex items-end justify-between gap-4">
                                <div>
                                    <h3 className="font-display font-light text-2xl" style={{ color: 'var(--color-charcoal)' }}>{item.name}</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-mute)' }}>{item.note}</p>
                                </div>
                                <span className="shrink-0 text-[9px] uppercase tracking-[0.25em] font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-charcoal)' }}>↻ Drag</span>
                            </div>
                        </article>
                    ))}

                    {/* Closing card */}
                    <article className="showroom-card lg:col-span-2 rounded-3xl p-8 flex flex-col justify-between gap-8" style={{ background: 'var(--color-charcoal)' }}>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--color-brass-light)' }}>Styling included</p>
                        <p className="font-display text-3xl leading-tight" style={{ color: '#F5EFE0' }}>
                            Our designers source, place and light every piece — so the room feels finished on day one.
                        </p>
                        <button
                            onClick={() => openLeadModal({ service: 'Full Home Interior' })}
                            className="btn-sheen self-start px-6 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-white"
                            style={{ background: 'var(--color-charcoal)' }}
                        >
                            Plan my room
                        </button>
                    </article>

                    {mount && (
                        <Suspense fallback={null}>
                            <ShowroomCanvas items={SHOWROOM} tracks={trackRefs} eventSource={sectionRef} />
                        </Suspense>
                    )}
                </div>

                <p className="mt-6 text-[11px]" style={{ color: 'var(--color-mute)' }}>
                    3D models: Khronos glTF Sample Assets — CC0 and CC BY 4.0 (furniture © Wayfair). Shown for styling reference.
                </p>
            </div>
        </section>
    );
}
