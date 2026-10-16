'use client';
import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS, CONTACT_INFO } from '@/lib/data/config';
import SectionTitle from '@/components/ui/SectionTitle';
import Icon from '@/components/ui/Icon';

export default function FaqSection() {
    const [open, setOpen] = useState<number | null>(0);
    const baseId = useId();

    return (
        <section id="faq" className="section-pad scroll-mt-16" style={{ background: 'var(--color-sand)' }}>
            <div className="container-site">
                <div className="grid grid-cols-1 lg:grid-cols-[4fr_7fr] gap-12 lg:gap-24">
                    <div>
                        <SectionTitle
                            eyebrow="Good to know"
                            title="Questions, answered."
                            description="Everything families usually ask before their first site visit. Still curious? Our designers are a call away."
                            align="left"
                        />
                        <div className="flex flex-wrap gap-3 -mt-6">
                            <a href={`tel:${CONTACT_INFO.phone1}`} className="label px-6 py-3.5 rounded-full border transition-colors hover:bg-black/5" style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-charcoal)' }}>
                                Call {CONTACT_INFO.phone1Display}
                            </a>
                            <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="label px-6 py-3.5 rounded-full" style={{ background: 'var(--color-charcoal)', color: '#EEE9E1' }}>
                                Ask on WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="divide-y border-y" style={{ borderColor: 'var(--color-border-strong)' }}>
                        {FAQS.map((f, i) => {
                            const isOpen = open === i;
                            const panelId = `${baseId}-panel-${i}`;
                            const btnId = `${baseId}-btn-${i}`;
                            return (
                                <div key={f.q} style={{ borderColor: 'var(--color-border-strong)' }}>
                                    <h3>
                                        <button
                                            id={btnId}
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            onClick={() => setOpen(isOpen ? null : i)}
                                            className="w-full flex items-center justify-between gap-6 py-7 text-left group"
                                        >
                                            <span className="font-display font-light text-xl md:text-2xl transition-colors group-hover:text-brass-dark" style={{ color: 'var(--color-charcoal)' }}>
                                                {f.q}
                                            </span>
                                            <span
                                                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500"
                                                style={{
                                                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                                                    background: isOpen ? 'var(--color-brass)' : 'transparent',
                                                    borderColor: isOpen ? 'var(--color-brass)' : 'var(--color-border-strong)',
                                                    color: isOpen ? '#fff' : 'var(--color-charcoal)',
                                                }}
                                            >
                                                <Icon name="plus" size={18} />
                                            </span>
                                        </button>
                                    </h3>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={btnId}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pb-8 pr-16 text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-mute)' }}>{f.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
