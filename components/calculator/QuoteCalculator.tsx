'use client';
import { useMemo, useState } from 'react';
import SheetHeader from '@/components/brand/SheetHeader';
import { BUILD_PACKAGES, DEFAULT_COVERAGE, HOME_SIZES, KITCHEN_SIZES, KITCHEN_TYPES, SELLERS, SQYD_TO_SQFT, buildMonths, formatINR, type BuildTier } from '@/lib/data/pricing';
import { CONTACT_INFO } from '@/lib/data/config';

const PLOTS = [50, 100, 150, 200, 300];
const FLOORS = [
    { n: 2, label: 'G+1' },
    { n: 3, label: 'G+2' },
    { n: 4, label: 'G+3' },
];
type Mode = 'build' | 'kitchen' | 'home';
const MODES: { id: Mode; label: string }[] = [
    { id: 'build', label: 'Build a house' },
    { id: 'kitchen', label: 'Modular kitchen' },
    { id: 'home', label: 'Full home' },
];

function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; t: string }[]; onChange: (v: T) => void; label: string }) {
    return (
        <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
            {options.map((o) => {
                const on = o.v === value;
                return (
                    <button key={String(o.v)} role="radio" aria-checked={on} onClick={() => onChange(o.v)} className="mono text-xs px-3.5 py-2.5 transition-colors" style={on ? { background: 'var(--color-charcoal)', color: '#F5EFE0' } : { border: '1px solid var(--color-border-strong)' }}>
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
    const [mode, setMode] = useState<Mode>('build');
    const [plot, setPlot] = useState(100);
    const [floors, setFloors] = useState(2);
    const [tier, setTier] = useState<BuildTier>('standard');
    const [kType, setKType] = useState('acrylic-gloss');
    const [kSize, setKSize] = useState(100);
    const [home, setHome] = useState('2bhk');

    const build = useMemo(() => {
        const perFloor = Math.round(plot * SQYD_TO_SQFT * DEFAULT_COVERAGE);
        const area = perFloor * floors;
        const pkg = BUILD_PACKAGES.find((p) => p.id === tier)!;
        const cost = area * pkg.rate;
        return { perFloor, area, pkg, low: cost, high: cost, months: buildMonths(floors) };
    }, [plot, floors, tier]);

    const kitchen = useMemo(() => {
        const k = KITCHEN_TYPES.find((x) => x.id === kType)!;
        return { k, low: k.rate * kSize, high: k.rate * kSize };
    }, [kType, kSize]);

    const interiors = useMemo(() => {
        const h = HOME_SIZES.find((x) => x.id === home)!;
        return { h, low: h.area * h.rate[0], high: h.area * h.rate[1], days: h.area < 1000 ? '45–60' : h.area < 1600 ? '60–75' : '75–100' };
    }, [home]);

    const result = mode === 'build' ? build : mode === 'kitchen' ? kitchen : interiors;
    const range = result.low === result.high ? formatINR(result.low) : null;

    const message = mode === 'build'
        ? `Hi AMS, I'd like a construction quote.\nPlot: ${plot} sq yd\nFloors: ${FLOORS.find((f) => f.n === floors)?.label}\nPackage: ${build.pkg.name} (₹${build.pkg.rate}/sq ft)\nEstimate shown: ${formatINR(build.low)}`
        : mode === 'kitchen'
            ? `Hi AMS, I'd like a kitchen quote.\nType: ${kitchen.k.name} (₹${kitchen.k.rate}/sq ft)\nSize: ${kSize} sq ft\nEstimate shown: ${formatINR(kitchen.low)}`
            : `Hi AMS, I'd like an interiors quote.\nHome: ${interiors.h.label} (~${interiors.h.area} sq ft)\nEstimate shown: ${formatINR(interiors.low)}${interiors.high !== interiors.low ? ` – ${formatINR(interiors.high)}` : ''}`;
    const wa = `${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;

    return (
        <section id="estimate" className="relative py-24 md:py-36 scroll-mt-16" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <SheetHeader
                    sheet="A-04"
                    eyebrow="Estimate"
                    title={<>What will it<br /><em style={{ color: 'var(--color-brass)' }}>cost you?</em></>}
                    intro="A first number in under a minute, worked out from our IndiaMart rates. The exact figure follows a free site visit."
                />

                <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16">
                    <div>
                        <div className="flex gap-0 mb-10 border-b" style={{ borderColor: 'var(--color-border-strong)' }} role="tablist" aria-label="Estimate type">
                            {MODES.map((m) => (
                                <button key={m.id} role="tab" aria-selected={mode === m.id} onClick={() => setMode(m.id)} className="label px-1 mr-6 md:mr-8 pb-4 -mb-px border-b-2 transition-colors" style={{ borderColor: mode === m.id ? 'var(--color-brass)' : 'transparent', color: mode === m.id ? 'var(--color-charcoal)' : 'var(--color-mute)' }}>
                                    {m.label}
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
                                    <p className="label mb-3">Package</p>
                                    <Seg label="Package" value={tier} onChange={setTier} options={BUILD_PACKAGES.map((p) => ({ v: p.id, t: `${p.name} · ₹${p.rate.toLocaleString('en-IN')}` }))} />
                                    <p className="text-sm mt-3" style={{ color: 'var(--color-mute)' }}>IndiaMart listing: “{build.pkg.listing}”, {SELLERS[build.pkg.seller]}</p>
                                </div>
                            </div>
                        ) : mode === 'kitchen' ? (
                            <div className="space-y-9">
                                <div>
                                    <p className="label mb-3">Kitchen type</p>
                                    <div role="radiogroup" aria-label="Kitchen type" className="grid sm:grid-cols-2 gap-px" style={{ background: 'var(--color-border)' }}>
                                        {KITCHEN_TYPES.map((k) => {
                                            const on = k.id === kType;
                                            return (
                                                <button key={k.id} role="radio" aria-checked={on} onClick={() => setKType(k.id)} className="flex items-baseline justify-between gap-3 text-left px-4 py-3 transition-colors" style={on ? { background: 'var(--color-charcoal)', color: '#F5EFE0' } : { background: 'var(--color-sand)' }}>
                                                    <span className="text-[13px]">{k.name}</span>
                                                    <span className="mono text-xs whitespace-nowrap">₹{k.rate.toLocaleString('en-IN')}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-sm mt-3" style={{ color: 'var(--color-mute)' }}>{kitchen.k.spec}. Listed by {SELLERS[kitchen.k.seller]}.</p>
                                </div>
                                <div>
                                    <p className="label mb-3">Size</p>
                                    <Seg label="Kitchen size" value={kSize} onChange={setKSize} options={KITCHEN_SIZES.map((n) => ({ v: n, t: `${n} sq ft` }))} />
                                    <p className="mono text-[11px] mt-2" style={{ color: 'var(--color-mute)' }}>Minimum order 100 sq ft. A 10×10 ft L-shaped kitchen is usually 100–120 sq ft of units.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-9">
                                <div>
                                    <p className="label mb-3">Home</p>
                                    <Seg label="Home size" value={home} onChange={setHome} options={HOME_SIZES.map((h) => ({ v: h.id, t: `${h.label} · ${h.area} sq ft` }))} />
                                    <p className="text-sm mt-3" style={{ color: 'var(--color-mute)' }}>IndiaMart listing: “{interiors.h.listing}”. Covers false ceiling, kitchen, wardrobes, flooring and 3D design.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Result sheet */}
                    <div className="p-7 md:p-10 self-start" style={{ background: 'var(--color-charcoal)', color: '#F5EFE0' }} aria-live="polite">
                        <p className="label mb-4" style={{ color: 'var(--color-ash)' }}>Estimated cost</p>
                        <p className="display tabular-nums" style={{ fontSize: 'clamp(40px, 4.6vw, 72px)' }}>
                            {range ?? (<>{formatINR(result.low)}<span style={{ color: 'var(--color-brass-light)' }}> – </span>{formatINR(result.high)}</>)}
                        </p>
                        <dl className="mt-8">
                            {mode === 'build' ? (
                                <>
                                    <Row k="Built-up per floor" v={`${build.perFloor.toLocaleString('en-IN')} sq ft`} />
                                    <Row k="Total built-up" v={`${build.area.toLocaleString('en-IN')} sq ft`} />
                                    <Row k="Rate" v={`₹${build.pkg.rate.toLocaleString('en-IN')} / sq ft`} />
                                    <Row k="Time on site" v={`about ${build.months} months`} />
                                </>
                            ) : mode === 'kitchen' ? (
                                <>
                                    <Row k="Kitchen" v={kitchen.k.name} />
                                    <Row k="Size" v={`${kSize} sq ft`} />
                                    <Row k="Rate" v={`₹${kitchen.k.rate.toLocaleString('en-IN')} / sq ft`} />
                                    <Row k="Delivery" v="15–20 days" />
                                </>
                            ) : (
                                <>
                                    <Row k="Carpet area" v={`${interiors.h.area.toLocaleString('en-IN')} sq ft`} />
                                    <Row k="Rate" v={interiors.h.rate[0] === interiors.h.rate[1] ? `₹${interiors.h.rate[0].toLocaleString('en-IN')} / sq ft` : `₹${interiors.h.rate[0].toLocaleString('en-IN')}–${interiors.h.rate[1].toLocaleString('en-IN')} / sq ft`} />
                                    <Row k="Time on site" v={`${interiors.days} days`} />
                                </>
                            )}
                        </dl>
                        <p className="mono text-[10.5px] mt-5 leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                            {mode === 'build'
                                ? `Assumes ${Math.round(DEFAULT_COVERAGE * 100)}% ground coverage per floor. Excludes GST, approval fees and interiors.`
                                : mode === 'kitchen' ? 'Excludes GST, appliances and chimney.' : 'Excludes GST and loose furniture.'}
                        </p>
                        <a href={wa} target="_blank" rel="noreferrer" className="label mt-8 flex items-center justify-center py-4 w-full" style={{ background: '#F5EFE0', color: '#2C2416' }}>
                            Send this to a designer →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
