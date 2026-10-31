'use client';
import SheetHeader from '@/components/brand/SheetHeader';
import { INTERIOR_RATES, RATE_NOTE } from '@/lib/data/pricing';

export default function InteriorRates() {
    return (
        <section id="interior-rates" className="relative py-24 md:py-36 scroll-mt-16" style={{ background: 'var(--color-surface)', color: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <SheetHeader
                    sheet="I-01"
                    eyebrow="Interiors rate card"
                    title={<>Kitchens, wardrobes<br /><span style={{ color: 'var(--color-brass)' }}>and whole homes.</span></>}
                    intro="Rates for carpentry made in our Indirapuram factory, measured on shutter area. Hardware is Hettich or Hafele unless you choose otherwise."
                />
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-14">
                    {INTERIOR_RATES.map((g) => (
                        <div key={g.group}>
                            <h3 className="display text-3xl mb-4 pb-3 border-b" style={{ borderColor: 'var(--color-charcoal)' }}>{g.group}</h3>
                            <dl>
                                {g.rows.map((r) => (
                                    <div key={r.item} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-3.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                        <dt className="text-[15px] font-medium">{r.item}</dt>
                                        <dd className="mono text-sm tabular-nums text-right whitespace-nowrap">{r.price}</dd>
                                        <dd className="col-span-2 text-xs" style={{ color: 'var(--color-mute)' }}>{r.spec}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    ))}
                </div>
                <p className="mono text-[11px] mt-10" style={{ color: 'var(--color-mute)' }}>{RATE_NOTE}</p>
            </div>
        </section>
    );
}
