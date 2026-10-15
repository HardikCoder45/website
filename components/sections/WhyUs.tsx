'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { WHY_US } from '@/lib/data/config';
import { useCountUp } from '@/lib/hooks/useCountUp';
import Icon from '@/components/ui/Icon';

/** Card with a soft brass spotlight that follows the pointer. */
function SpotlightCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    return (
        <div onPointerMove={onMove} className={`why-card group relative overflow-hidden rounded-3xl border ${className}`} style={style}>
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(184,137,42,0.14), transparent 60%)' }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}

export default function WhyUs() {
    const sectionRef = useRef<HTMLElement>(null);
    const { ref: countRef, display } = useCountUp<HTMLSpanElement>(1000, { duration: 2200 });

    useGSAP(() => {
        gsap.fromTo('.why-card',
            { autoAlpha: 0, y: 60 },
            {
                autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
            });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="why-us" className="section-pad relative" style={{ background: 'var(--color-sand)' }}>
            <div className="container-site">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {/* Hero card */}
                    <SpotlightCard
                        className="md:col-span-2 lg:row-span-2 p-8 md:p-12 flex flex-col justify-between min-h-[420px]"
                        style={{ background: 'var(--color-charcoal)', borderColor: 'rgba(212,168,75,0.15)' }}
                    >
                        <div className="flex h-full flex-col justify-between gap-10">
                            <div>
                                <span className="inline-block px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full border" style={{ borderColor: 'rgba(212,168,75,0.3)', color: 'var(--color-brass-light)' }}>
                                    Why AMS
                                </span>
                                <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.02] tracking-tight" style={{ color: '#F5EFE0' }}>
                                    Designed with care.<br />
                                    <span className="italic font-normal text-brass-gradient">Built to last.</span>
                                </h2>
                            </div>
                            <div className="flex items-end justify-between gap-6 flex-wrap">
                                <div>
                                    <span ref={countRef} className="block font-display font-bold text-7xl md:text-8xl tabular-nums leading-none" style={{ color: 'var(--color-brass-light)' }}>
                                        {Number(display).toLocaleString('en-IN')}+
                                    </span>
                                    <span className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: 'rgba(245,239,224,0.45)' }}>Delhi homes transformed</span>
                                </div>
                                <p className="max-w-[260px] text-sm leading-relaxed" style={{ color: 'rgba(245,239,224,0.6)' }}>
                                    One team from first sketch to final screw — no subcontracting, no surprises.
                                </p>
                            </div>
                        </div>
                    </SpotlightCard>

                    {WHY_US.map((item, i) => (
                        <SpotlightCard
                            key={item.title}
                            className={`p-7 md:p-8 ${i === WHY_US.length - 1 ? 'md:col-span-2 lg:col-span-4' : ''}`}
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            <div className={`flex gap-6 ${i === WHY_US.length - 1 ? 'flex-col sm:flex-row sm:items-center' : 'flex-col'}`}>
                            <span className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" style={{ background: 'rgba(184,137,42,0.1)', color: 'var(--color-brass-dark)' }}>
                                <Icon name={item.icon} />
                            </span>
                            <div>
                                <h3 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--color-charcoal)' }}>{item.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mute)' }}>{item.description}</p>
                            </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
