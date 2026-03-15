'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PACKAGE_RATES, PackageKey } from '@/lib/data/config';
import CostBar from './CostBar';
import { useAppStore } from '@/lib/store/useAppStore';

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
        <section className="section-pad border-y" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="container-site">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

                    {/* Controls */}
                    <div className="w-full lg:w-1/2">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--color-brass)' }}>
                            Instant Estimate
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6" style={{ color: 'var(--color-charcoal)' }}>
                            Plan Your <span className="text-brass-gradient">Budget</span>
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
                                    <span className="text-2xl font-display font-semibold text-brass-dark">{area} sq.ft</span>
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
                            animate={{ scale: [0.98, 1] }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            key={selectedPack + area} // Re-animate subtly when estimate changes
                        >
                            {/* Subtle accent glow */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brass/20 rounded-full blur-3xl" />

                            <span className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-brass)' }}>
                                Estimated Range
                            </span>

                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl md:text-5xl font-display font-semibold" style={{ color: '#F5EFE0' }}>
                                    ₹{Math.floor(estMin / 1000)}k <span className="text-3xl font-light text-brass-light">–</span> ₹{Math.floor(estMax / 1000)}k
                                </span>
                            </div>

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
                                className="w-full mt-10 py-4 rounded-xl font-medium text-charcoal shadow-xl hover:scale-[1.02] transition-transform"
                                style={{ background: 'linear-gradient(135deg, var(--color-sand) 0%, #E8E0CB 100%)' }}
                            >
                                Get Exact Quote for {area} sq.ft
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
