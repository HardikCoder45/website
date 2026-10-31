'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { STATS } from '@/lib/data/config';
import { useCountUp } from '@/lib/hooks/useCountUp';

gsap.registerPlugin(ScrollTrigger);

const TEXT = 'Since 2014 we have built and fitted out homes across Delhi NCR. The crew that pours your slab is the crew that fits your kitchen, so nothing gets lost between contractors and the drawing you approve is the house you get.';
const EMPHASIS = new Set(['slab', 'kitchen,']);

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
    const { ref, display } = useCountUp<HTMLSpanElement>(value, { decimals, duration: 2200 });
    return (
        <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border-strong)' }}>
            <span ref={ref} className="display block text-5xl md:text-6xl tabular-nums">
                {Number(display).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
                <span style={{ color: 'var(--color-brass)' }}>{suffix}</span>
            </span>
            <span className="label mt-3 block" style={{ color: 'var(--color-mute)' }}>{label}</span>
        </div>
    );
}

export default function Manifesto() {
    const ref = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Each word brightens as the paragraph scrolls through the viewport.
        gsap.fromTo('.mf-word', { opacity: 0.14 }, {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: '.mf-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        });
    }, { scope: ref });

    return (
        <section ref={ref} id="studio" className="relative py-28 md:py-44" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <div className="grid md:grid-cols-[1fr_3fr] gap-10 md:gap-16">
                    <p className="label" style={{ color: 'var(--color-mute)' }}>Studio · since 2014</p>
                    <p className="mf-text display" style={{ fontSize: 'clamp(34px, 4.8vw, 78px)', lineHeight: 0.98 }}>
                        {TEXT.split(' ').map((w, i) => (
                            <span key={i} className={`mf-word inline-block mr-[0.24em] ${EMPHASIS.has(w) ? 'italic' : ''}`} style={EMPHASIS.has(w) ? { color: 'var(--color-brass-dark)' } : undefined}>
                                {w}
                            </span>
                        ))}
                    </p>
                </div>

                <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                    {STATS.map((s) => <Stat key={s.label} {...s} />)}
                </div>
            </div>
        </section>
    );
}
