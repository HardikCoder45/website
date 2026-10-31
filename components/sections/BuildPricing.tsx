'use client';
import { useState } from 'react';
import SheetHeader from '@/components/brand/SheetHeader';
import { BUILD_PACKAGES, BUILD_SPECS, GREY_STRUCTURE, RATE_NOTE, STILT_RATE, type BuildTier } from '@/lib/data/pricing';
import { useAppStore } from '@/lib/store/useAppStore';

export default function BuildPricing() {
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    // On phones the schedule shows one package at a time.
    const [mobileTier, setMobileTier] = useState<BuildTier>('signature');

    return (
        <section id="pricing" className="relative py-24 md:py-36 scroll-mt-16" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <SheetHeader
                    sheet="A-03"
                    eyebrow="Construction packages"
                    title={<>Priced per square foot.<br /><span style={{ color: 'var(--color-brass)' }}>Specified to the brand.</span></>}
                    intro="Three turnkey packages for houses and builder floors. Each rate covers structure, services and finishes on the built-up area, and every material is named below so quotes are easy to compare."
                />

                {/* Package columns */}
                <div className="grid md:grid-cols-3 border-t border-l" style={{ borderColor: 'var(--color-border-strong)' }}>
                    {BUILD_PACKAGES.map((p) => (
                        <article key={p.id} className="relative border-r border-b p-7 md:p-9 flex flex-col" style={{ borderColor: 'var(--color-border-strong)', background: p.popular ? 'var(--color-surface)' : 'transparent' }}>
                            {p.popular && <span className="absolute -top-px left-0 right-0 h-[3px]" style={{ background: 'var(--color-brass)' }} aria-hidden="true" />}
                            <div className="flex items-baseline justify-between mb-8">
                                <h3 className="display text-4xl">{p.name}</h3>
                                {p.popular && <span className="label" style={{ color: 'var(--color-brass)' }}>Most chosen</span>}
                            </div>
                            <p className="display tabular-nums" style={{ fontSize: 'clamp(56px, 6vw, 92px)' }}>₹{p.rate.toLocaleString('en-IN')}</p>
                            <p className="mono text-xs mt-2" style={{ color: 'var(--color-mute)' }}>per sq ft of built-up area</p>
                            <p className="mt-6 text-sm leading-relaxed flex-1" style={{ color: 'var(--color-mute)' }}>{p.summary}</p>
                            <button
                                onClick={() => openLeadModal({ service: `House Construction (${p.name})` })}
                                className="label mt-8 py-4 w-full transition-colors"
                                style={p.popular ? { background: 'var(--color-charcoal)', color: '#F1EEE7' } : { border: '1px solid var(--color-border-strong)' }}
                            >
                                Quote this package →
                            </button>
                        </article>
                    ))}
                </div>

                {/* Specification schedule */}
                <div className="mt-16 md:mt-20">
                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
                        <h3 className="label">Specification schedule</h3>
                        <div className="flex md:hidden gap-1" role="tablist" aria-label="Choose package">
                            {BUILD_PACKAGES.map((p) => (
                                <button key={p.id} role="tab" aria-selected={mobileTier === p.id} onClick={() => setMobileTier(p.id)} className="label px-3 py-2" style={mobileTier === p.id ? { background: 'var(--color-charcoal)', color: '#F1EEE7' } : { border: '1px solid var(--color-border-strong)' }}>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="hidden md:table-header-group">
                                <tr className="border-y" style={{ borderColor: 'var(--color-charcoal)' }}>
                                    <th className="label py-3 pr-6 w-[22%]" style={{ color: 'var(--color-mute)' }}>Item</th>
                                    {BUILD_PACKAGES.map((p) => <th key={p.id} className="label py-3 pr-6">{p.name}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {BUILD_SPECS.map((row) => (
                                    <tr key={row.item} className="border-b align-top" style={{ borderColor: 'var(--color-border)' }}>
                                        <th scope="row" className="mono text-[11px] uppercase tracking-[0.06em] font-normal py-3.5 pr-6" style={{ color: 'var(--color-mute)' }}>{row.item}</th>
                                        {BUILD_PACKAGES.map((p) => (
                                            <td key={p.id} className={`text-sm py-3.5 pr-6 ${p.id === mobileTier ? '' : 'hidden md:table-cell'}`}>{row[p.id]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Other civil rates */}
                <div className="mt-12 grid sm:grid-cols-3 gap-px" style={{ background: 'var(--color-border-strong)' }}>
                    {[
                        { k: 'Grey structure only', v: `₹${GREY_STRUCTURE.min.toLocaleString('en-IN')}–${GREY_STRUCTURE.max.toLocaleString('en-IN')} / sq ft`, n: 'Foundation, frame, slabs, walls, plaster' },
                        { k: 'Stilt parking floor', v: `₹${STILT_RATE.toLocaleString('en-IN')} / sq ft`, n: 'Structure, flooring, lighting, gate' },
                        { k: 'Extra floor on existing house', v: 'from ₹2,100 / sq ft', n: 'After a structural load check' },
                    ].map((r) => (
                        <div key={r.k} className="p-6" style={{ background: 'var(--color-sand)' }}>
                            <p className="label mb-3" style={{ color: 'var(--color-mute)' }}>{r.k}</p>
                            <p className="display text-3xl">{r.v}</p>
                            <p className="text-xs mt-2" style={{ color: 'var(--color-mute)' }}>{r.n}</p>
                        </div>
                    ))}
                </div>
                <p className="mono text-[11px] mt-6" style={{ color: 'var(--color-mute)' }}>{RATE_NOTE} Approvals fees, boundary wall, borewell and interiors are quoted separately.</p>
            </div>
        </section>
    );
}
