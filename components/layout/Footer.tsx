'use client';
import { CONTACT_INFO } from '@/lib/data/config';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import { LogoMark } from '@/components/brand/Logo';

const COLUMNS = [
    {
        title: 'Build',
        links: [
            { label: 'House construction', href: '#construction' },
            { label: 'Home renovation', href: '#renovation' },
            { label: 'Packages & specs', href: '#pricing' },
            { label: 'Cost estimate', href: '#estimate' },
        ],
    },
    {
        title: 'Interiors',
        links: [
            { label: 'Modular kitchens', href: '#kitchens' },
            { label: 'Wardrobes', href: '#wardrobes' },
            { label: 'Rate card', href: '#interior-rates' },
            { label: '3D kitchen tour', href: '/kitchen' },
        ],
    },
    {
        title: 'Studio',
        links: [
            { label: 'Work', href: '#work' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Visit us', href: '#visit' },
            { label: 'WhatsApp', href: CONTACT_INFO.whatsapp },
        ],
    },
];

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="relative overflow-hidden pt-20 md:pt-28" style={{ background: 'var(--color-charcoal)', color: '#F5EFE0' }}>
            <div className="container-site">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-10 pb-16 border-b" style={{ borderColor: 'var(--color-line-dark)' }}>
                    <div className="col-span-2 md:col-span-4">
                        <LogoMark size={44} accent="var(--color-brass-light)" title="AMS Interiors" />
                        <address className="not-italic mt-6 text-sm leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                            72-A, Main Road Jagat Puri, Shahdara<br />New Delhi 110051
                        </address>
                        <p className="mono text-xs mt-4" style={{ color: 'var(--color-ash)' }}>
                            <a href={`tel:${CONTACT_INFO.phone1}`} className="link-draw">{CONTACT_INFO.phone1Display}</a> · <a href={`mailto:${CONTACT_INFO.email}`} className="link-draw">{CONTACT_INFO.email}</a>
                        </p>
                    </div>
                    {COLUMNS.map((c) => (
                        <nav key={c.title} aria-label={c.title} className="md:col-span-2 md:col-start-auto">
                            <p className="label mb-5" style={{ color: 'var(--color-ash)' }}>{c.title}</p>
                            <ul className="space-y-2.5">
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
                        </nav>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-3 py-6 mono text-[10.5px]" style={{ color: 'var(--color-ash)' }}>
                    <p>© {year} AMS Interiors · GST {CONTACT_INFO.gstNo}</p>
                    <p>Earth maps: Solar System Scope (CC BY 4.0) · Furniture models: Khronos glTF samples (CC0 / CC BY 4.0, © Wayfair)</p>
                </div>
            </div>

            {/* Full-width wordmark set on the ground line */}
            <div aria-hidden="true" className="select-none relative">
                <div className="display leading-[0.78] whitespace-nowrap text-center" style={{ fontSize: '31vw', letterSpacing: '-0.02em', color: '#F5EFE0', marginBottom: '-0.04em' }}>
                    AMS<span style={{ color: 'var(--color-brass-light)' }}>.</span>
                </div>
            </div>
        </footer>
    );
}
