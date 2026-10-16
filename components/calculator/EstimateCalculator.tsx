'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { PACKAGE_RATES, PackageKey } from '@/lib/data/config';
import CostBar from './CostBar';
import { useAppStore } from '@/lib/store/useAppStore';

/** ₹ in Indian notation: 95,000 → ₹95K, 1,20,000 → ₹1.2L, 1,50,00,000 → ₹1.5Cr */
function formatINR(n: number) {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(n >= 1e8 ? 1 : 2).replace(/\.?0+$/, '')}Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(n >= 1e6 ? 1 : 2).replace(/\.?0+$/, '')}L`;
    return `₹${Math.round(n / 1000)}K`;
}

/** Smoothly tweens the displayed amount whenever the estimate changes. */
function AnimatedINR({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const prev = useRef(value);
    useEffect(() => {
        const controls = animate(prev.current, value, {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => { if (ref.current) ref.current.textContent = formatINR(v); },
        });
        prev.current = value;
        return () => controls.stop();
    }, [value]);
    return <span ref={ref}>{formatINR(value)}</span>;
}

const QUICK_AREAS = [
    { label: 'Kitchen', area: 100 },
    { label: 'Bedroom', area: 250 },
    { label: '2 BHK', area: 900 },
    { label: '3 BHK', area: 1400 },
];

export default function EstimateCalculator() {
    const [area, setArea] = useState<number>(100);
    const [selectedPack, setSelectedPack] = useState<PackageKey>('standard');
    const openLeadModal = useAppStore(s => s.openLeadModal);

    const activeRate = PACKAGE_RATES[selectedPack];
    const estMin = activeRate.min * area;
    const estMax = activeRate.max * area;

    // Simple hardcoded breakdown for visual effect based on package
    const breakdown = useMemo(() => {
        if (selectedPack === 'basic') return { mat: 50, lab: 40, fin: 10 };
        if (selectedPack === 'standard') return { mat: 55, lab: 30, fin: 15 };
        return { mat: 65, lab: 25, fin: 10 };
    }, [selectedPack]);

    return (
        <section id="estimate" className="section-pad border-y scroll-mt-16" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="container-site">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

                    {/* Controls */}
                    <div className="w-full lg:w-1/2">
                        <p className="label mb-6" style={{ color: 'var(--color-mute)' }}>( 08 ) &nbsp;Estimate</p>
                        <h2 className="display mb-6" style={{ color: 'var(--color-charcoal)', fontSize: 'clamp(40px, 5vw, 84px)' }}>
                            Plan the <span className="italic" style={{ color: 'var(--color-brass-dark)' }}>budget.</span>
                        </h2>
                        <p className="text-mute mb-10 text-lg">
                            Get an instant approximate calculation for your modular kitchen, wardrobe, or full home interior based on your carpet area.
                        </p>

                        <div className="space-y-10">
                            {/* Area Slider */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label htmlFor="area-slider" className="text-sm font-bold tracking-wider uppercase text-charcoal">
                                        Estimated Area (Sq.Ft)
                                    </label>
                                    <span className="text-2xl font-display font-light text-brass-dark">{area} sq.ft</span>
                                </div>
                                <input
                                    id="area-slider"
                                    type="range"
                                    min="50"
                                    max="2000"
                                    step="10"
                                    value={area}
                                    onChange={(e) => setArea(Number(e.target.value))}
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-charcoal/10"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-brass) ${(area - 50) / 1950 * 100}%, rgba(44,36,22,0.1) ${(area - 50) / 1950 * 100}%)`
                                    }}
                                />
                                <div className="flex justify-between text-xs text-mute mt-2 font-medium">
                                    <span>50 sq.ft</span>
                                    <span>2000+ sq.ft</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="Quick area presets">
                                    {QUICK_AREAS.map((q) => (
                                        <button
                                            key={q.label}
                                            type="button"
                                            onClick={() => setArea(q.area)}
                                            aria-pressed={area === q.area}
                                            className="px-4 py-2 rounded-full text-xs font-semibold border transition-all"
                                            style={{
                                                background: area === q.area ? 'var(--color-charcoal)' : 'transparent',
                                                color: area === q.area ? '#F5EFE0' : 'var(--color-charcoal)',
                                                borderColor: area === q.area ? 'var(--color-charcoal)' : 'var(--color-border-strong)',
                                            }}
                                        >
                                            {q.label} · {q.area} sq.ft
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Package Selector */}
                            <div>
                                <label className="block text-sm font-bold tracking-wider uppercase text-charcoal mb-4">
                                    Select Finish Level
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {(Object.entries(PACKAGE_RATES) as [PackageKey, typeof PACKAGE_RATES[PackageKey]][]).map(([key, pack]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            aria-pressed={selectedPack === key}
                                            onClick={() => setSelectedPack(key)}
                                            className="relative p-4 rounded-xl border text-left flex flex-col transition-all"
                                            style={{
                                                background: selectedPack === key ? 'rgba(184,137,42,0.06)' : 'transparent',
                                                borderColor: selectedPack === key ? 'var(--color-brass)' : 'var(--color-border)',
                                                boxShadow: selectedPack === key ? 'var(--shadow-brass)' : 'none',
                                            }}
                                        >
                                            {pack.popular && (
                                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white bg-brass-dark shadow-sm whitespace-nowrap">
                                                    Most Popular
                                                </span>
                                            )}
                                            <span className="text-sm font-bold mb-1" style={{ color: selectedPack === key ? 'var(--color-brass-dark)' : 'var(--color-charcoal)' }}>
                                                {pack.label}
                                            </span>
                                            <span className="text-xs text-mute leading-relaxed">
                                                {pack.description}
                                            </span>
                                            <span className="mt-2 text-[11px] font-bold tracking-wide" style={{ color: 'var(--color-brass-dark)' }}>
                                                ₹{pack.min.toLocaleString('en-IN')}–{pack.max.toLocaleString('en-IN')}/sq.ft
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            className="p-8 md:p-12 rounded-3xl shadow-2xl border flex flex-col relative overflow-hidden"
                            style={{ background: 'var(--color-charcoal)', borderColor: 'rgba(245,239,224,0.1)' }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Subtle accent glow */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brass/20 rounded-full blur-3xl" />

                            <span className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-brass)' }}>
                                Estimated Range
                            </span>

                            <div className="flex items-baseline gap-2 mb-2" aria-live="polite">
                                <span className="text-5xl md:text-6xl font-display font-light tabular-nums" style={{ color: '#F5EFE0' }}>
                                    <AnimatedINR value={estMin} /> <span className="text-3xl font-light text-brass-light">–</span> <AnimatedINR value={estMax} />
                                </span>
                            </div>
                            <p className="text-xs mb-8" style={{ color: 'rgba(245,239,224,0.45)' }}>
                                Approximate, for {area.toLocaleString('en-IN')} sq.ft · {activeRate.label} finish · excl. GST
                            </p>

                            <div className="mb-10 p-5 rounded-xl border" style={{ borderColor: 'rgba(245,239,224,0.08)', background: 'rgba(245,239,224,0.03)' }}>
                                <h4 className="text-sm font-semibold mb-3" style={{ color: '#F5EFE0' }}>
                                    What&apos;s included in {activeRate.label}?
                                </h4>
                                <ul className="space-y-2">
                                    {activeRate.materials.map(mat => (
                                        <li key={mat} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,239,224,0.7)' }}>
                                            <svg width="14" height="14" fill="none" stroke="var(--color-brass)" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            {mat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <CostBar materialsPct={breakdown.mat} laborPct={breakdown.lab} finishingPct={breakdown.fin} />

                            <button
                                onClick={() => openLeadModal({ package: activeRate.label })}
                                className="btn-sheen w-full mt-10 py-4 rounded-xl font-semibold text-charcoal shadow-xl hover:scale-[1.02] transition-transform"
                                style={{ background: 'linear-gradient(135deg, var(--color-sand) 0%, #E8E0CB 100%)' }}
                            >
                                Get Exact Quote for {area.toLocaleString('en-IN')} sq.ft
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
