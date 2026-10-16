'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CONTACT_INFO } from '@/lib/data/config';
import LeadForm from '../forms/LeadForm';

const LOCATIONS = {
    studio: { title: 'Design studio', address: CONTACT_INFO.address, query: CONTACT_INFO.mapQuery, hours: 'Mon – Sat, 10:00 – 19:00' },
    factory: { title: 'Factory', address: CONTACT_INFO.factoryAddress, query: CONTACT_INFO.factoryMapQuery, hours: 'Mon – Sat, 09:30 – 18:30' },
} as const;

export default function ContactSection() {
    const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
    const [tab, setTab] = useState<keyof typeof LOCATIONS>('studio');
    const loc = LOCATIONS[tab];

    return (
        <section id="contact" className="relative py-28 md:py-44 scroll-mt-24" style={{ background: 'var(--color-surface)', color: 'var(--color-charcoal)' }}>
            <div className="container-site grid lg:grid-cols-[7fr_5fr] gap-16 lg:gap-24">
                <div>
                    <p className="label mb-6" style={{ color: 'var(--color-mute)' }}>( 09 ) &nbsp;Contact</p>
                    <h2 className="display mb-12" style={{ fontSize: 'clamp(44px, 6.4vw, 112px)' }}>
                        Visit the<br /><span className="italic" style={{ color: 'var(--color-brass-dark)' }}>studio.</span>
                    </h2>

                    <div className="flex gap-8 mb-8 border-b" style={{ borderColor: 'var(--color-border-strong)' }} role="tablist">
                        {(Object.keys(LOCATIONS) as (keyof typeof LOCATIONS)[]).map((k) => (
                            <button
                                key={k}
                                role="tab"
                                aria-selected={tab === k}
                                onClick={() => setTab(k)}
                                className="label pb-4 -mb-px border-b transition-colors"
                                style={{ borderColor: tab === k ? 'var(--color-charcoal)' : 'transparent', color: tab === k ? 'var(--color-charcoal)' : 'var(--color-mute)' }}
                            >
                                {LOCATIONS[k].title}
                            </button>
                        ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-10 mb-12">
                        <AnimatePresence mode="wait">
                            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <address className="not-italic font-display text-2xl font-light leading-snug">{loc.address}</address>
                                <p className="label mt-4" style={{ color: 'var(--color-mute)' }}>{loc.hours}</p>
                            </motion.div>
                        </AnimatePresence>
                        <div>
                            <a href={`tel:${CONTACT_INFO.phone1}`} className="block font-display text-2xl font-light link-draw w-fit">{CONTACT_INFO.phone1Display}</a>
                            <a href={`tel:${CONTACT_INFO.phone2}`} className="block font-display text-2xl font-light link-draw w-fit mt-1">{CONTACT_INFO.phone2Display}</a>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="block text-sm mt-3 link-draw w-fit" style={{ color: 'var(--color-mute)' }}>{CONTACT_INFO.email}</a>
                        </div>
                    </div>

                    <div ref={ref} className="relative aspect-[16/9] overflow-hidden" style={{ background: 'var(--color-stone)' }}>
                        {inView && (
                            <iframe
                                key={tab}
                                title={`Map — ${loc.title}`}
                                src={`https://maps.google.com/maps?q=${loc.query}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 0, filter: 'grayscale(1) contrast(1.05) sepia(0.15)' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        )}
                    </div>
                </div>

                <div className="lg:pt-24">
                    <div className="lg:sticky lg:top-32 p-8 md:p-12" style={{ background: 'var(--color-sand)' }}>
                        <h3 className="display text-4xl mb-3">Book a site visit</h3>
                        <p className="text-sm leading-relaxed mb-10 max-w-sm" style={{ color: 'var(--color-mute)' }}>
                            Tell us a little about your home. A designer will call within 24 hours to arrange a free visit.
                        </p>
                        <LeadForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
