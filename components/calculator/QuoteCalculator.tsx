'use client';
import { useMemo, useState } from 'react';
import SheetHeader from '@/components/brand/SheetHeader';
import { BUILD_PACKAGES, DEFAULT_COVERAGE, HOME_SIZES, INTERIOR_TIERS, SQYD_TO_SQFT, STILT_RATE, buildMonths, formatINR, type BuildTier } from '@/lib/data/pricing';
import { CONTACT_INFO } from '@/lib/data/config';

const PLOTS = [50, 100, 150, 200, 300];
const FLOORS = [
    { n: 2, label: 'G+1' },
    { n: 3, label: 'G+2' },
    { n: 4, label: 'G+3' },
];

function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; t: string }[]; onChange: (v: T) => void; label: string }) {
    return (
        <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
            {options.map((o) => {
                const on = o.v === value;
                return (
                    <button key={String(o.v)} role="radio" aria-checked={on} onClick={() => onChange(o.v)} className="mono text-xs px-3.5 py-2.5 transition-colors" style={on ? { background: 'var(--color-charcoal)', color: '#F1EEE7' } : { border: '1px solid var(--color-border-strong)' }}>
                        {o.t}
                    </button>
                );
            })}
        </div>
    );
}

function Row({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-2.5 border-b" style={{ borderColor: 'var(--color-line-dark)' }}>
            <dt className="mono text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--color-ash)' }}>{k}</dt>
            <dd className="mono text-sm tabular-nums">{v}</dd>
        </div>
    );
}

export default function QuoteCalculator() {
    const [mode, setMode] = useState<'build' | 'interiors'>('build');
    const [plot, setPlot] = useState(150);
    const [floors, setFloors] = useState(3);
    const [stilt, setStilt] = useState(true);
    const [tier, setTier] = useState<BuildTier>('signature');
    const [home, setHome] = useState('3bhk');
    const [itier, setItier] = useState('standard');

    const build = useMemo(() => {
        const perFloor = Math.round(plot * SQYD_TO_SQFT * DEFAULT_COVERAGE);
        const area = perFloor * floors;
        const rate = BUILD_PACKAGES.find((p) => p.id === tier)!.rate;
        const base = area * rate + (stilt ? perFloor * STILT_RATE : 0);
        return { perFloor, area, rate, low: base * 0.94, high: base * 1.06, months: buildMonths(floors, stilt) };
    }, [plot, floors, stilt, tier]);

    const interiors = useMemo(() => {
        const h = HOME_SIZES.find((x) => x.id === home)!;
        const t = INTERIOR_TIERS.find((x) => x.id === itier)!;
        return { area: h.area, label: h.label, tier: t, low: h.area * t.rate[0], high: h.area * t.rate[1], days: h.area < 1000 ? '45–60' : h.area < 1600 ? '60–75' : '75–100' };
    }, [home, itier]);

    const message = mode === 'build'
        ? `Hi AMS, I'd like a construction quote.\nPlot: ${plot} sq yd\nFloors: ${FLOORS.find((f) => f.n === floors)?.label}${stilt ? ' + stilt parking' : ''}\nPackage: ${BUILD_PACKAGES.find((p) => p.id === tier)?.name}\nEstimate shown: ${formatINR(build.low)} – ${formatINR(build.high)}`
        : `Hi AMS, I'd like an interiors quote.\nHome: ${interiors.label} (~${interiors.area} sq ft)\nFinish: ${interiors.tier.name}\nEstimate shown: ${formatINR(interiors.low)} – ${formatINR(interiors.high)}`;
    const wa = `${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;

    return (
        <section id="estimate" className="relative py-24 md:py-36 scroll-mt-16" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <SheetHeader
                    sheet="A-04"
                    eyebrow="Estimate"
                    title={<>What will it<br /><span style={{ color: 'var(--color-brass)' }}>cost you?</span></>}
                    intro="A first number in under a minute. It uses the same rates as our quotes; the exact figure follows a site survey and soil report."
                />

                <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16">
                    <div>
                        <div className="flex gap-0 mb-10 border-b" style={{ borderColor: 'var(--color-border-strong)' }} role="tablist" aria-label="Estimate type">
                            {(['build', 'interiors'] as const).map((m) => (
                                <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className="label px-1 mr-8 pb-4 -mb-px border-b-2 transition-colors" style={{ borderColor: mode === m ? 'var(--color-brass)' : 'transparent', color: mode === m ? 'var(--color-charcoal)' : 'var(--color-mute)' }}>
                                    {m === 'build' ? 'Build a house' : 'Interiors'}
                                </button>
                            ))}
                        </div>

                        {mode === 'build' ? (
                            <div className="space-y-9">
                                <div>
                                    <p className="label mb-3">Plot size</p>
                                    <Seg label="Plot size" value={plot} onChange={setPlot} options={PLOTS.map((p) => ({ v: p, t: `${p} sq yd` }))} />
                                    <p className="mono text-[11px] mt-2" style={{ color: 'var(--color-mute)' }}>{plot} sq yd = {(plot * SQYD_TO_SQFT).toLocaleString('en-IN')} sq ft of land</p>
                                </div>
                                <div>
                                    <p className="label mb-3">Floors</p>
                                    <Seg label="Floors" value={floors} onChange={setFloors} options={FLOORS.map((f) => ({ v: f.n, t: f.label }))} />
                                </div>
                                <div>
                                    <p className="label mb-3">Stilt parking</p>
                                    <Seg label="Stilt parking" value={stilt ? 'yes' : 'no'} onChange={(v) => setStilt(v === 'yes')} options={[{ v: 'yes', t: 'With stilt' }, { v: 'no', t: 'No stilt' }]} />
                                </div>
                                <div>
                                    <p className="label mb-3">Package</p>
                                    <Seg label="Package" value={tier} onChange={setTier} options={BUILD_PACKAGES.map((p) => ({ v: p.id, t: `${p.name} · ₹${p.rate.toLocaleString('en-IN')}` }))} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-9">
                                <div>
                                    <p className="label mb-3">Home</p>
                                    <Seg label="Home size" value={home} onChange={setHome} options={HOME_SIZES.map((h) => ({ v: h.id, t: `${h.label} · ${h.area} sq ft` }))} />
                                </div>
                                <div>
                                    <p className="label mb-3">Finish</p>
                                    <Seg label="Finish level" value={itier} onChange={setItier} options={INTERIOR_TIERS.map((t) => ({ v: t.id, t: t.name }))} />
                                    <p className="text-sm mt-3" style={{ color: 'var(--color-mute)' }}>{interiors.tier.note}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Result sheet */}
                    <div className="p-7 md:p-10 self-start" style={{ background: 'var(--color-charcoal)', color: '#F1EEE7' }} aria-live="polite">
                        <p className="label mb-4" style={{ color: 'var(--color-ash)' }}>Estimated cost</p>
                        <p className="display tabular-nums" style={{ fontSize: 'clamp(40px, 4.6vw, 72px)' }}>
                            {formatINR(mode === 'build' ? build.low : interiors.low)}
                            <span style={{ color: 'var(--color-brass-light)' }}> – </span>
                            {formatINR(mode === 'build' ? build.high : interiors.high)}
                        </p>
                        <dl className="mt-8">
                            {mode === 'build' ? (
                                <>
                                    <Row k="Built-up per floor" v={`${build.perFloor.toLocaleString('en-IN')} sq ft`} />
                                    <Row k="Total built-up" v={`${build.area.toLocaleString('en-IN')} sq ft`} />
                                    <Row k="Rate" v={`₹${build.rate.toLocaleString('en-IN')} / sq ft`} />
                                    {stilt && <Row k="Stilt floor" v={`₹${STILT_RATE.toLocaleString('en-IN')} / sq ft`} />}
                                    <Row k="Time on site" v={`about ${build.months} months`} />
                                </>
                            ) : (
                                <>
                                    <Row k="Carpet area" v={`${interiors.area.toLocaleString('en-IN')} sq ft`} />
                                    <Row k="Rate" v={`₹${interiors.tier.rate[0].toLocaleString('en-IN')}–${interiors.tier.rate[1].toLocaleString('en-IN')} / sq ft`} />
                                    <Row k="Time on site" v={`${interiors.days} days`} />
                                </>
                            )}
                        </dl>
                        <p className="mono text-[10.5px] mt-5 leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                            {mode === 'build'
                                ? `Assumes ${Math.round(DEFAULT_COVERAGE * 100)}% ground coverage per floor. Excludes GST, approvals fees and interiors.`
                                : 'Excludes GST, civil changes and loose furniture.'}
                        </p>
                        <a href={wa} target="_blank" rel="noreferrer" className="label mt-8 flex items-center justify-center py-4 w-full" style={{ background: '#F1EEE7', color: '#121212' }}>
                            Send this to a designer →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
