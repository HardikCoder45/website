'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { services } from '@/lib/data/services';
import { useAppStore } from '@/lib/store/useAppStore';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ServicesIndex() {
    const [hover, setHover] = useState<number | null>(null);
    const [open, setOpen] = useState<number | null>(null);
    const preview = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    // Floating preview image that trails the cursor over the list (desktop only).
    useEffect(() => {
        const el = preview.current;
        const list = listRef.current;
        if (!el || !list || !window.matchMedia('(pointer: fine)').matches) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
        const onMove = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
        list.addEventListener('pointermove', onMove);
        return () => list.removeEventListener('pointermove', onMove);
    }, []);

    return (
        <section id="services" className="relative py-28 md:py-44 scroll-mt-24" style={{ background: 'var(--color-charcoal)', color: '#EEE9E1' }}>
            <div className="container-site">
                <div className="grid md:grid-cols-[1fr_3fr] gap-10 md:gap-16 mb-16 md:mb-24">
                    <p className="label" style={{ color: 'var(--color-ash)' }}>( 03 ) &nbsp;Services</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <h2 className="display" style={{ fontSize: 'clamp(44px, 6.4vw, 112px)' }}>
                            One studio,<br /><span className="italic" style={{ color: 'var(--color-brass-light)' }}>every trade.</span>
                        </h2>
                        <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                            Design, manufacturing and installation under one roof — so the drawing and the finished room match.
                        </p>
                    </div>
                </div>

                <ul ref={listRef} className="border-t" style={{ borderColor: 'var(--color-line-dark)' }} onPointerLeave={() => setHover(null)}>
                    {services.map((s, i) => {
                        const isOpen = open === i;
                        return (
                            <li key={s.id} id={s.anchor} className="border-b scroll-mt-28" style={{ borderColor: 'var(--color-line-dark)' }}>
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    onPointerEnter={() => setHover(i)}
                                    aria-expanded={isOpen}
                                    className="group w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_1fr_auto] items-baseline gap-6 py-7 md:py-9 text-left"
                                >
                                    <span className="label tabular-nums" style={{ color: 'var(--color-ash)' }}>{String(i + 1).padStart(2, '0')}</span>
                                    <span
                                        className="display text-4xl md:text-6xl transition-all duration-700"
                                        style={{ transform: hover === i ? 'translateX(16px)' : 'none', fontStyle: hover === i ? 'italic' : 'normal' }}
                                    >
                                        {s.name}
                                    </span>
                                    <span className="hidden md:block text-sm" style={{ color: 'var(--color-ash)' }}>{s.tagline}</span>
                                    <span className="label flex items-center gap-4" style={{ color: 'var(--color-ash)' }}>
                                        <span className="hidden sm:inline">From {s.priceRange.split('–')[0].trim()}</span>
                                        <span className="w-9 h-9 rounded-full border flex items-center justify-center transition-transform duration-500" style={{ borderColor: 'var(--color-line-dark)', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                                        </span>
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.7, ease: EASE }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid md:grid-cols-[80px_1fr_1fr] gap-8 pb-12">
                                                <span />
                                                <div>
                                                    <p className="text-base leading-relaxed max-w-xl mb-8" style={{ color: 'rgba(238,233,225,0.8)' }}>{s.description}</p>
                                                    <button
                                                        onClick={() => openLeadModal({ service: s.name })}
                                                        className="label px-7 py-4 rounded-full border transition-colors duration-500 hover:bg-[#EEE9E1] hover:text-[#141310]"
                                                        style={{ borderColor: 'rgba(238,233,225,0.4)' }}
                                                    >
                                                        Enquire about {s.name.toLowerCase()}
                                                    </button>
                                                </div>
                                                <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
                                                    {s.specs.map((sp) => (
                                                        <div key={sp.label} className="border-t pt-3" style={{ borderColor: 'var(--color-line-dark)' }}>
                                                            <dt className="label mb-1" style={{ color: 'var(--color-ash)' }}>{sp.label}</dt>
                                                            <dd className="text-sm">{sp.value}</dd>
                                                        </div>
                                                    ))}
                                                    <div className="border-t pt-3" style={{ borderColor: 'var(--color-line-dark)' }}>
                                                        <dt className="label mb-1" style={{ color: 'var(--color-ash)' }}>Price</dt>
                                                        <dd className="text-sm">{s.priceRange} {s.priceUnit}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Cursor-following preview */}
            <div ref={preview} className="hidden md:block fixed top-0 left-0 z-30 pointer-events-none" aria-hidden="true">
                <div className="-translate-x-1/2 -translate-y-1/2 w-[300px] h-[380px] overflow-hidden transition-[clip-path,opacity] duration-700"
                    style={{ clipPath: hover !== null && open === null ? 'inset(0% 0% 0% 0%)' : 'inset(50% 50% 50% 50%)', opacity: hover !== null && open === null ? 1 : 0, transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}>
                    {services.map((s, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={s.id}
                            src={s.image.replace('w=800', 'w=600')}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                            style={{ opacity: hover === i ? 1 : 0 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
