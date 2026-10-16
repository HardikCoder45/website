'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { MATERIALS } from '@/lib/data/work';

const AtelierCanvas = dynamic(() => import('./AtelierCanvas'), { ssr: false });

export default function MaterialAtelier() {
    const [active, setActive] = useState(0);
    const m = MATERIALS[active];

    return (
        <section id="atelier" className="relative scroll-mt-24" style={{ background: 'var(--color-stone)', color: 'var(--color-charcoal)' }}>
            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-h-[100svh]">
                {/* Library */}
                <div className="container-site lg:pr-0 py-24 md:py-32 flex flex-col">
                    <p className="label mb-6" style={{ color: 'var(--color-mute)' }}>( 04 ) &nbsp;Material atelier</p>
                    <h2 className="display mb-6" style={{ fontSize: 'clamp(44px, 5.6vw, 96px)' }}>
                        Touch it<br /><span className="italic" style={{ color: 'var(--color-brass-dark)' }}>before</span> you choose.
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed mb-12" style={{ color: 'var(--color-mute)' }}>
                        The stones, woods, metals and textiles we specify most — rendered live in 3D under studio light. Pick one to inspect it from every side.
                    </p>

                    <ul className="border-t lg:max-w-md" style={{ borderColor: 'var(--color-border-strong)' }} role="listbox" aria-label="Materials">
                        {MATERIALS.map((mat, i) => (
                            <li key={mat.id} className="border-b" style={{ borderColor: 'var(--color-border-strong)' }}>
                                <button
                                    role="option"
                                    aria-selected={active === i}
                                    onClick={() => setActive(i)}
                                    onPointerEnter={() => setActive(i)}
                                    className="w-full flex items-baseline justify-between gap-6 py-3.5 text-left"
                                >
                                    <span className="flex items-baseline gap-4">
                                        <span className="label tabular-nums" style={{ color: 'var(--color-mute)' }}>{String(i + 1).padStart(2, '0')}</span>
                                        <span className={`font-display text-2xl md:text-[28px] font-light transition-all duration-500 ${active === i ? 'italic translate-x-2' : ''}`}>{mat.name}</span>
                                    </span>
                                    <span className="label transition-opacity duration-500" style={{ color: 'var(--color-mute)', opacity: active === i ? 1 : 0 }}>{mat.finish}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Live specimen */}
                <div className="relative min-h-[70svh] lg:min-h-0">
                    <AtelierCanvas material={m} />
                    <div className="absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-10 flex flex-wrap items-end justify-between gap-6 pointer-events-none">
                        <AnimatePresence mode="wait">
                            <motion.dl
                                key={m.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="grid grid-cols-2 gap-x-10 gap-y-3 max-w-md"
                            >
                                <div><dt className="label" style={{ color: 'var(--color-mute)' }}>Origin</dt><dd className="text-sm mt-1">{m.origin}</dd></div>
                                <div><dt className="label" style={{ color: 'var(--color-mute)' }}>Finish</dt><dd className="text-sm mt-1">{m.finish}</dd></div>
                                <div className="col-span-2"><dt className="label" style={{ color: 'var(--color-mute)' }}>Where we use it</dt><dd className="text-sm mt-1">{m.use}</dd></div>
                            </motion.dl>
                        </AnimatePresence>
                        <p className="label tabular-nums" style={{ color: 'var(--color-mute)' }}>Specimen {String(active + 1).padStart(2, '0')} / {String(MATERIALS.length).padStart(2, '0')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
