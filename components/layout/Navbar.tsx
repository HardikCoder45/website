'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { SERVICES_NAV, CONTACT_INFO } from '@/lib/data/config';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import { Logo } from '@/components/brand/Logo';

const EASE = [0.65, 0, 0.35, 1] as const;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const activeSection = useAppStore((s) => s.activeSection);
    const setActiveSection = useAppStore((s) => s.setActiveSection);

    // Hide while scrolling down, return on scroll up; solid sheet once off the top.
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 24);
            if (Math.abs(y - last) > 6) {
                setHidden(y > last && y > 400);
                last = y;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
            <nav
                aria-label="Primary"
                className="fixed top-0 inset-x-0 z-50 transition-[transform,background-color,border-color] duration-500"
                style={{
                    transform: hidden && !open ? 'translateY(-100%)' : 'none',
                    background: scrolled ? 'rgba(245,239,224,0.88)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(14px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
                    borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
                    color: 'var(--color-charcoal)',
                }}
            >
                <div className="container-site h-16 md:h-[72px] flex items-center justify-between gap-6">
                    <a href="#main" aria-label="AMS Interiors, back to top" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}>
                        <Logo />
                    </a>

                    <ul className="hidden lg:flex items-center gap-8">
                        {SERVICES_NAV.map((item, i) => {
                            const active = activeSection === item.href.slice(1);
                            return (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => { e.preventDefault(); go(item.href); }}
                                        aria-current={active ? 'true' : undefined}
                                        className="label flex items-baseline gap-1.5 transition-colors hover:text-[var(--color-brass)]"
                                        style={{ color: active ? 'var(--color-brass)' : undefined }}
                                    >
                                        <span className="opacity-50 tabular-nums">0{i + 1}</span>
                                        <span>{item.label}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex items-center gap-5">
                        <a href={`tel:${CONTACT_INFO.phone1}`} className="label hidden md:inline tabular-nums">{CONTACT_INFO.phone1Display}</a>
                        <button
                            onClick={() => openLeadModal({ service: 'General Enquiry' })}
                            className="label hidden sm:inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
                            style={{ background: 'var(--color-charcoal)', color: '#F5EFE0' }}
                        >
                            Get a quote <span aria-hidden="true">→</span>
                        </button>
                        <button onClick={() => setOpen(true)} className="lg:hidden label flex items-center gap-2" aria-label="Open menu" aria-expanded={open}>
                            <span className="flex flex-col gap-[5px]">
                                <span className="block w-6 h-[1.5px] bg-current" />
                                <span className="block w-6 h-[1.5px] bg-current" />
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
                        transition={{ duration: 0.7, ease: EASE }}
                        className="fixed inset-0 z-[120] flex flex-col"
                        style={{ background: 'var(--color-charcoal)', color: '#F5EFE0' }}
                        data-lenis-prevent
                    >
                        <div className="container-site w-full h-16 flex items-center justify-between">
                            <Logo compact />
                            <button onClick={() => setOpen(false)} className="label" aria-label="Close menu">Close ✕</button>
                        </div>
                        <div className="container-site w-full flex-1 flex flex-col justify-between py-8 overflow-y-auto">
                            <ul>
                                {[...SERVICES_NAV, { label: '3D kitchen tour', href: '/kitchen' }].map((item, i) => (
                                    <li key={item.href} className="border-b" style={{ borderColor: 'var(--color-line-dark)' }}>
                                        <a
                                            href={item.href}
                                            onClick={(e) => { if (item.href.startsWith('#')) { e.preventDefault(); go(item.href); } }}
                                            className="flex items-baseline justify-between py-4"
                                        >
                                            <span className="display text-5xl">{item.label}</span>
                                            <span className="label opacity-50">0{i + 1}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-10 flex flex-col gap-3">
                                <a href={`tel:${CONTACT_INFO.phone1}`} className="display text-3xl">{CONTACT_INFO.phone1Display}</a>
                                <p className="mono text-xs opacity-60">{CONTACT_INFO.address}</p>
                                <button onClick={() => { setOpen(false); openLeadModal({ service: 'General Enquiry' }); }} className="label mt-4 py-4 w-full" style={{ background: '#F5EFE0', color: '#2C2416' }}>
                                    Get a quote →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
