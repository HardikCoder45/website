'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import SheetHeader from '@/components/brand/SheetHeader';
import { SERVICE_LINES } from '@/lib/data/pricing';
import { useAppStore } from '@/lib/store/useAppStore';

const EASE = [0.16, 1, 0.3, 1] as const;
const FILTERS = ['All', 'Build', 'Interiors'] as const;

export default function ServicesIndex() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
    const [hover, setHover] = useState<string | null>(null);
    const [open, setOpen] = useState<string | null>(null);
    const preview = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    const lines = SERVICE_LINES.filter((l) => filter === 'All' || l.discipline === filter);

    // Preview image trails the cursor over the list (desktop pointers only).
    useEffect(() => {
        const el = preview.current;
        const list = listRef.current;
        if (!el || !list || !window.matchMedia('(pointer: fine)').matches) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
        const onMove = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
        list.addEventListener('pointermove', onMove);
        return () => list.removeEventListener('pointermove', onMove);
    }, []);

    return (
        <section id="services" className="relative py-24 md:py-36 scroll-mt-16" style={{ background: 'var(--color-charcoal)', color: '#F1EEE7' }}>
            <div className="container-site">
                <SheetHeader
                    dark
                    sheet="A-02"
                    eyebrow="Services"
                    title={<>From bare plot<br /><span style={{ color: 'var(--color-brass-light)' }}>to the last shelf.</span></>}
                    intro="Nine services, two disciplines, one team. Starting rates are shown on every line; open a line for what it includes."
                />

                <div className="flex gap-1.5 mb-8" role="tablist" aria-label="Filter services">
                    {FILTERS.map((f) => (
                        <button key={f} role="tab" aria-selected={filter === f} onClick={() => { setFilter(f); setOpen(null); }} className="mono text-xs px-4 py-2.5 transition-colors" style={filter === f ? { background: '#F1EEE7', color: '#121212' } : { border: '1px solid var(--color-line-dark)', color: 'var(--color-ash)' }}>
                            {f}
                        </button>
                    ))}
                </div>

                <ul ref={listRef} className="border-t" style={{ borderColor: 'var(--color-line-dark)' }} onPointerLeave={() => setHover(null)}>
                    {lines.map((s, i) => {
                        const isOpen = open === s.id;
                        return (
                            <li key={s.id} id={s.anchor} className="border-b scroll-mt-24" style={{ borderColor: 'var(--color-line-dark)' }}>
                                <button
                                    onClick={() => setOpen(isOpen ? null : s.id)}
                                    onPointerEnter={() => setHover(s.id)}
                                    aria-expanded={isOpen}
                                    className="w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[64px_1fr_140px_220px_40px] items-center gap-4 md:gap-6 py-6 md:py-7 text-left"
                                >
                                    <span className="mono text-xs tabular-nums" style={{ color: 'var(--color-ash)' }}>{String(i + 1).padStart(2, '0')}</span>
                                    <span className="display text-[34px] md:text-6xl transition-colors duration-300" style={{ color: hover === s.id ? 'var(--color-brass-light)' : undefined }}>{s.name}</span>
                                    <span className="hidden md:block mono text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--color-ash)' }}>{s.discipline}</span>
                                    <span className="hidden md:block mono text-sm tabular-nums text-right">
                                        from {s.from} <span style={{ color: 'var(--color-ash)' }}>{s.unit}</span>
                                    </span>
                                    <span className="w-9 h-9 border flex items-center justify-center justify-self-end transition-transform duration-500" style={{ borderColor: 'var(--color-line-dark)', transform: isOpen ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
                                    <span className="md:hidden col-start-2 mono text-xs tabular-nums -mt-2" style={{ color: 'var(--color-ash)' }}>from {s.from} {s.unit}</span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="overflow-hidden">
                                            <div className="grid md:grid-cols-[64px_1fr_1fr] gap-8 pb-10">
                                                <span />
                                                <div>
                                                    <p className="text-base leading-relaxed max-w-lg mb-7" style={{ color: 'rgba(241,238,231,0.82)' }}>{s.detail}</p>
                                                    <button onClick={() => openLeadModal({ service: s.name })} className="label px-6 py-3.5" style={{ background: '#F1EEE7', color: '#121212' }}>
                                                        Quote {s.name.toLowerCase()} →
                                                    </button>
                                                </div>
                                                <ul className="grid gap-0">
                                                    {s.scope.map((x, k) => (
                                                        <li key={x} className="flex gap-4 py-2.5 border-t text-sm" style={{ borderColor: 'var(--color-line-dark)' }}>
                                                            <span className="mono text-[11px] tabular-nums" style={{ color: 'var(--color-brass-light)' }}>{String(k + 1).padStart(2, '0')}</span>
                                                            {x}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div ref={preview} className="hidden md:block fixed top-0 left-0 z-30 pointer-events-none" aria-hidden="true">
                <div
                    className="translate-x-6 -translate-y-1/2 w-[280px] h-[340px] overflow-hidden"
                    style={{ clipPath: hover && !open ? 'inset(0% 0% 0% 0%)' : 'inset(50% 50% 50% 50%)', opacity: hover && !open ? 1 : 0, transition: 'clip-path 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.4s' }}
                >
                    {SERVICE_LINES.map((s) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={s.id} src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{ opacity: hover === s.id ? 1 : 0, background: '#E3DED4' }} />
                    ))}
                </div>
            </div>
        </section>
    );
}
