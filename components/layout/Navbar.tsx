'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { SERVICES_NAV, CONTACT_INFO } from '@/lib/data/config';
import { scrollToTarget } from '@/components/providers/SmoothScroll';

const EASE = [0.65, 0, 0.35, 1] as const;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const activeSection = useAppStore((s) => s.activeSection);
    const setActiveSection = useAppStore((s) => s.setActiveSection);

    // Scroll spy for every section linked from the nav.
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
        }, { rootMargin: '-45% 0px -50% 0px' });
        SERVICES_NAV.forEach(({ href }) => {
            const el = document.getElementById(href.slice(1));
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [setActiveSection]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const go = (href: string) => {
        setOpen(false);
        setTimeout(() => scrollToTarget(href), open ? 500 : 0);
    };

    return (
        <>
            {/* Difference blend keeps the bar legible over both ink and bone sections. */}
            <nav aria-label="Primary" className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-[#EEE9E1]">
                <div className="container-site h-20 md:h-24 flex items-center justify-between gap-6">
                    <a
                        href="#main"
                        aria-label="AMS Interiors — back to top"
                        onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}
                        className="flex items-baseline gap-3"
                    >
                        <span className="font-display text-[28px] md:text-[32px] font-light tracking-[0.14em] leading-none">AMS</span>
                        <span className="label hidden sm:inline opacity-70">Interiors</span>
                    </a>

                    <ul className="hidden lg:flex items-center gap-10">
                        {SERVICES_NAV.map((item, i) => {
                            const active = activeSection === item.href.slice(1);
                            return (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => { e.preventDefault(); go(item.href); }}
                                        aria-current={active ? 'true' : undefined}
                                        className="label flex items-baseline gap-1.5 transition-opacity hover:opacity-100"
                                        style={{ opacity: active ? 1 : 0.62 }}
                                    >
                                        <span className="text-[9px] tabular-nums opacity-60">0{i + 1}</span>
                                        <span className="link-draw pb-0.5">{item.label}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex items-center gap-6 md:gap-8">
                        <button onClick={() => openLeadModal({ service: 'General Enquiry' })} className="label hidden md:inline link-draw pb-0.5">
                            Book a visit ↗
                        </button>
                        <button
                            onClick={() => setOpen(true)}
                            className="label flex items-center gap-3"
                            aria-label="Open menu"
                            aria-expanded={open}
                        >
                            <span className="hidden sm:inline">Menu</span>
                            <span className="flex flex-col gap-[5px]">
                                <span className="block w-6 h-px bg-current" />
                                <span className="block w-6 h-px bg-current" />
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                        initial={{ clipPath: 'inset(0 0 100% 0)' }}
                        animate={{ clipPath: 'inset(0 0 0% 0)' }}
                        exit={{ clipPath: 'inset(0 0 100% 0)' }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="fixed inset-0 z-[120] flex flex-col"
                        style={{ background: 'var(--color-charcoal)', color: '#EEE9E1' }}
                        data-lenis-prevent
                    >
                        <div className="container-site w-full h-20 md:h-24 flex items-center justify-between">
                            <span className="font-display text-[32px] font-light tracking-[0.14em]">AMS</span>
                            <button onClick={() => setOpen(false)} className="label flex items-center gap-3" aria-label="Close menu">
                                Close
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="container-site w-full flex-1 grid lg:grid-cols-[1.4fr_1fr] gap-12 py-10 overflow-y-auto">
                            <ul className="flex flex-col justify-center">
                                {[...SERVICES_NAV, { label: '3D Kitchen Tour', href: '/kitchen' }].map((item, i) => (
                                    <li key={item.href} className="overflow-hidden border-b" style={{ borderColor: 'var(--color-line-dark)' }}>
                                        <motion.a
                                            href={item.href}
                                            onClick={(e) => { if (item.href.startsWith('#')) { e.preventDefault(); go(item.href); } }}
                                            initial={{ y: '100%' }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                            className="group flex items-baseline justify-between py-4 md:py-5"
                                        >
                                            <span className="display text-5xl md:text-7xl transition-transform duration-700 group-hover:translate-x-4">{item.label}</span>
                                            <span className="label opacity-40 tabular-nums">0{i + 1}</span>
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="flex flex-col justify-end gap-10 lg:pl-16 lg:border-l"
                                style={{ borderColor: 'var(--color-line-dark)' }}
                            >
                                <div>
                                    <p className="label opacity-50 mb-3">Studio</p>
                                    <p className="font-display text-2xl font-light leading-snug">{CONTACT_INFO.address}</p>
                                </div>
                                <div>
                                    <p className="label opacity-50 mb-3">Talk to a designer</p>
                                    <a href={`tel:${CONTACT_INFO.phone1}`} className="block font-display text-3xl font-light link-draw w-fit">{CONTACT_INFO.phone1Display}</a>
                                    <a href={`mailto:${CONTACT_INFO.email}`} className="block mt-1 text-sm opacity-70 link-draw w-fit">{CONTACT_INFO.email}</a>
                                </div>
                                <button
                                    onClick={() => { setOpen(false); openLeadModal({ service: 'General Enquiry' }); }}
                                    className="self-start px-8 py-4 rounded-full label border transition-colors hover:bg-[#EEE9E1] hover:text-[#141310]"
                                    style={{ borderColor: 'rgba(238,233,225,0.4)' }}
                                >
                                    Book a free site visit
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
