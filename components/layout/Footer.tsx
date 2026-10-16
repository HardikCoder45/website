'use client';
import { CONTACT_INFO } from '@/lib/data/config';
import { useAppStore } from '@/lib/store/useAppStore';
import { scrollToTarget } from '@/components/providers/SmoothScroll';

const COLUMNS = [
    {
        title: 'Studio',
        links: [
            { label: 'Selected work', href: '#work' },
            { label: 'Services', href: '#services' },
            { label: 'Material atelier', href: '#atelier' },
            { label: 'Process', href: '#process' },
            { label: 'FAQ', href: '#faq' },
        ],
    },
    {
        title: '3D tours',
        links: [
            { label: 'The Kitchen', href: '/kitchen' },
            { label: 'The Wardrobe', href: '/wardrobe' },
            { label: 'The Living Room', href: '/interior' },
        ],
    },
    {
        title: 'Elsewhere',
        links: [
            { label: 'WhatsApp', href: CONTACT_INFO.whatsapp },
            { label: 'Justdial', href: 'https://www.justdial.com' },
            { label: 'TradeIndia', href: 'https://www.tradeindia.com' },
        ],
    },
];

export default function Footer() {
    const year = new Date().getFullYear();
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    return (
        <footer className="relative overflow-hidden pt-28 md:pt-40" style={{ background: '#0d0c0a', color: '#EEE9E1' }}>
            <div className="container-site">
                {/* Closing statement */}
                <div className="grid md:grid-cols-[1fr_auto] items-end gap-10 pb-20 md:pb-28 border-b" style={{ borderColor: 'var(--color-line-dark)' }}>
                    <h2 className="display" style={{ fontSize: 'clamp(56px, 9vw, 168px)' }}>
                        Let&apos;s <span className="italic" style={{ color: 'var(--color-brass-light)' }}>begin.</span>
                    </h2>
                    <div className="flex flex-col items-start gap-5 md:pb-4">
                        <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                            A designer visits, measures and listens — free, anywhere in Delhi NCR. Your 3D design follows within a week.
                        </p>
                        <button
                            onClick={() => openLeadModal({ service: 'General Enquiry' })}
                            className="label px-8 py-4 rounded-full transition-colors duration-500 border hover:bg-transparent hover:text-[#EEE9E1]"
                            style={{ background: '#EEE9E1', color: '#141310', borderColor: '#EEE9E1' }}
                        >
                            Book a free site visit
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-16 md:py-20">
                    <div className="col-span-2 md:col-span-4">
                        <p className="label mb-5" style={{ color: 'var(--color-ash)' }}>Visit</p>
                        <address className="not-italic font-display text-2xl font-light leading-snug">
                            72-A, Main Road Jagat Puri,<br />Shahdara, New Delhi 110051
                        </address>
                        <p className="mt-4 text-sm" style={{ color: 'var(--color-ash)' }}>{CONTACT_INFO.hours}</p>
                        <p className="mt-1 text-sm" style={{ color: 'var(--color-ash)' }}>Factory · {CONTACT_INFO.factoryAddress}</p>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                        <p className="label mb-5" style={{ color: 'var(--color-ash)' }}>Talk</p>
                        <a href={`tel:${CONTACT_INFO.phone1}`} className="block text-sm mb-2 link-draw w-fit">{CONTACT_INFO.phone1Display}</a>
                        <a href={`tel:${CONTACT_INFO.phone2}`} className="block text-sm mb-2 link-draw w-fit">{CONTACT_INFO.phone2Display}</a>
                        <a href={`mailto:${CONTACT_INFO.email}`} className="block text-sm link-draw w-fit">{CONTACT_INFO.email}</a>
                    </div>
                    {COLUMNS.map((c) => (
                        <div key={c.title} className="md:col-span-2">
                            <p className="label mb-5" style={{ color: 'var(--color-ash)' }}>{c.title}</p>
                            <ul className="space-y-2">
                                {c.links.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            target={l.href.startsWith('http') ? '_blank' : undefined}
                                            rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                                            onClick={(e) => { if (l.href.startsWith('#')) { e.preventDefault(); scrollToTarget(l.href); } }}
                                            className="text-sm link-draw"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-3 py-6 border-t text-xs" style={{ borderColor: 'var(--color-line-dark)', color: 'var(--color-ash)' }}>
                    <p>© {year} AMS Interiors · GST {CONTACT_INFO.gstNo}</p>
                    <p>3D furniture models: Khronos glTF Sample Assets (CC0 / CC BY 4.0, © Wayfair)</p>
                </div>
            </div>

            {/* Full-bleed wordmark */}
            <div aria-hidden="true" className="select-none leading-none text-center -mb-[0.18em] mt-4">
                <span className="display uppercase block whitespace-nowrap" style={{ fontSize: '19.5vw', letterSpacing: '-0.03em', color: 'rgba(238,233,225,0.92)' }}>
                    AMS<span className="italic normal-case" style={{ color: 'var(--color-brass)' }}> interiors</span>
                </span>
            </div>
        </footer>
    );
}
