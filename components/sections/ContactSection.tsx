'use client';
import { CONTACT_INFO } from '@/lib/data/config';
import LeadForm from '../forms/LeadForm';

export default function ContactSection() {
    return (
        <section id="contact" className="relative py-24 md:py-36 scroll-mt-16" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }}>
            <div className="container-site grid lg:grid-cols-[1fr_1fr] gap-14 lg:gap-24">
                <div>
                    <p className="label mb-5" style={{ color: 'var(--color-mute)' }}>Start a project</p>
                    <h2 className="display mb-8" style={{ fontSize: 'clamp(46px, 7vw, 120px)' }}>
                        Tell us about<br /><em style={{ color: 'var(--color-brass)' }}>your home.</em>
                    </h2>
                    <p className="max-w-md text-base leading-relaxed mb-12" style={{ color: 'var(--color-mute)' }}>
                        An engineer or designer calls within one working day and visits your site for free. Bring the plot papers or the flat layout if you have them.
                    </p>
                    <dl className="grid sm:grid-cols-2 gap-px max-w-xl" style={{ background: 'var(--color-border-strong)' }}>
                        {[
                            { k: 'Construction', v: CONTACT_INFO.phone1Display, href: `tel:${CONTACT_INFO.phone1}` },
                            { k: 'Interiors', v: CONTACT_INFO.phone2Display, href: `tel:${CONTACT_INFO.phone2}` },
                            { k: 'Email', v: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                            { k: 'Hours', v: 'Mon–Sat, 10:00–19:00' },
                        ].map((r) => (
                            <div key={r.k} className="p-5" style={{ background: 'var(--color-sand)' }}>
                                <dt className="label mb-2" style={{ color: 'var(--color-mute)' }}>{r.k}</dt>
                                <dd className="mono text-sm">{r.href ? <a href={r.href} className="link-draw">{r.v}</a> : r.v}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="p-7 md:p-10 self-start" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)' }}>
                    <p className="label mb-8 flex justify-between" style={{ color: 'var(--color-mute)' }}>
                        <span>Site survey request</span><span>Form 01</span>
                    </p>
                    <LeadForm />
                </div>
            </div>
        </section>
    );
}
