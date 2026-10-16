'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonials } from '@/lib/data/testimonials';

export default function Voices() {
    const [i, setI] = useState(0);
    const [paused, setPaused] = useState(false);
    const t = testimonials[i];
    const n = testimonials.length;

    useEffect(() => {
        if (paused) return;
        const id = setTimeout(() => setI((x) => (x + 1) % n), 7000);
        return () => clearTimeout(id);
    }, [i, paused, n]);

    return (
        <section
            id="voices"
            className="relative py-28 md:py-44"
            style={{ background: 'var(--color-charcoal)', color: '#EEE9E1' }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
        >
            <div className="container-site">
                <div className="flex items-baseline justify-between gap-6 mb-16 md:mb-24">
                    <p className="label" style={{ color: 'var(--color-ash)' }}>( 07 ) &nbsp;Client voices</p>
                    <p className="label" style={{ color: 'var(--color-ash)' }}>4.7 ★ · 37 verified reviews</p>
                </div>

                <div className="min-h-[340px] md:min-h-[380px]" aria-live="polite">
                    <AnimatePresence mode="wait">
                        <motion.figure
                            key={t.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <blockquote className="display max-w-5xl" style={{ fontSize: 'clamp(30px, 4.4vw, 72px)', lineHeight: 1.1 }}>
                                <span style={{ color: 'var(--color-brass-light)' }}>“</span>{t.quote}<span style={{ color: 'var(--color-brass-light)' }}>”</span>
                            </blockquote>
                            <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                                <span className="font-display text-2xl font-light italic">{t.name}</span>
                                <span className="label" style={{ color: 'var(--color-ash)' }}>{t.project} · {t.city} · via {t.source}</span>
                            </figcaption>
                        </motion.figure>
                    </AnimatePresence>
                </div>

                <div className="mt-16 flex items-center justify-between gap-6 border-t pt-8" style={{ borderColor: 'var(--color-line-dark)' }}>
                    <div className="hidden sm:flex gap-2" role="tablist" aria-label="Reviews">
                        {testimonials.map((x, k) => (
                            <button
                                key={x.id}
                                role="tab"
                                aria-selected={k === i}
                                aria-label={`Review ${k + 1}`}
                                onClick={() => setI(k)}
                                className="py-3"
                            >
                                <span className="block h-px transition-all duration-700" style={{ width: k === i ? 56 : 20, backgroundColor: k === i ? '#EEE9E1' : 'rgba(238,233,225,0.3)' }} />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                        <span className="label tabular-nums" style={{ color: 'var(--color-ash)' }}>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                        <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous review" className="w-11 h-11 rounded-full border flex items-center justify-center hover:bg-[#EEE9E1] hover:text-[#141310] transition-colors" style={{ borderColor: 'rgba(238,233,225,0.35)' }}>←</button>
                        <button onClick={() => setI((i + 1) % n)} aria-label="Next review" className="w-11 h-11 rounded-full border flex items-center justify-center hover:bg-[#EEE9E1] hover:text-[#141310] transition-colors" style={{ borderColor: 'rgba(238,233,225,0.35)' }}>→</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
