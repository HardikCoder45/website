'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { SERVICES_NAV, CONTACT_INFO } from '@/lib/data/config';
import { scrollToTarget } from '@/components/providers/SmoothScroll';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const activeSection = useAppStore((s) => s.activeSection);
    const setActiveSection = useAppStore((s) => s.setActiveSection);

    // Tuck the bar away while scrolling down, bring it back on scroll up.
    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            if (Math.abs(y - lastY) < 6) return;
            setHidden(y > lastY && y > 400);
            lastY = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Scroll spy for every section linked from the nav.
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        SERVICES_NAV.forEach(({ href }) => {
            const el = document.getElementById(href.slice(1));
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [setActiveSection]);

    useEffect(() => {
        const sentinel = document.getElementById('nav-sentinel');
        if (!sentinel) return;
        const obs = new IntersectionObserver(
            ([entry]) => setScrolled(!entry.isIntersecting),
            { threshold: 0 }
        );
        obs.observe(sentinel);
        return () => obs.disconnect();
    }, []);

    // Close drawer on escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    // Lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <>
            <nav
                aria-label="Primary"
                className="fixed top-0 left-0 right-0 z-50"
                style={{
                    background: scrolled ? 'rgba(250,250,247,0.82)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(44,36,22,0.06)' : '1px solid transparent',
                    boxShadow: scrolled ? '0 10px 30px -10px rgba(44,36,22,0.08)' : 'none',
                    transform: hidden && !mobileOpen ? 'translateY(-100%)' : 'translateY(0)',
                    transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div className="container-site h-20 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#main"
                        aria-label="AMS Interiors — back to top"
                        className="flex items-center gap-2 shrink-0 group"
                        onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}
                    >
                        <LogoSVG light={!scrolled} />
                    </a>

                    {/* Desktop Nav Links */}
                    <ul className="hidden lg:flex items-center gap-9">
                        {SERVICES_NAV.map((item) => {
                            const sectionId = item.href.replace('#', '');
                            const isActive = activeSection === sectionId;
                            return (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        aria-current={isActive ? 'true' : undefined}
                                        className="group/link relative text-sm font-body font-medium transition-colors duration-300 hover:text-brass py-2"
                                        style={{
                                            color: isActive ? 'var(--color-brass)' : scrolled ? 'var(--color-mute)' : 'rgba(245,239,224,0.75)',
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        {item.label}
                                        <span
                                            className="absolute left-0 -bottom-0.5 h-px w-full origin-left transition-transform duration-500 group-hover/link:scale-x-100"
                                            style={{ background: 'var(--color-brass)', transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    {/* CTA + hamburger */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => openLeadModal({ service: 'General' })}
                            className="btn-sheen hidden md:flex items-center gap-3 px-6 py-3.5 rounded-2xl text-xs font-bold text-white transition-all uppercase tracking-widest"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-brass) 0%, var(--color-brass-dark) 100%)',
                                boxShadow: '0 10px 20px -5px rgba(184, 137, 42, 0.4)',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                        >
                            Book Site Visit
                        </button>
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden flex flex-col gap-1.5 p-3 rounded-xl transition-colors"
                            style={{ background: scrolled ? 'rgba(44,36,22,0.05)' : 'rgba(245,239,224,0.08)' }}
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                        >
                            <span className="block w-6 h-0.5 rounded" style={{ background: scrolled ? 'var(--color-charcoal)' : '#F5EFE0' }} />
                            <span className="block w-6 h-0.5 rounded" style={{ background: scrolled ? 'var(--color-charcoal)' : '#F5EFE0' }} />
                            <span className="block w-4 h-0.5 rounded self-end" style={{ background: scrolled ? 'var(--color-charcoal)' : '#F5EFE0' }} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-[90]"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Navigation menu"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[100] flex flex-col p-10"
                            style={{ background: 'var(--color-surface)' }}
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="self-end mb-12 w-12 h-12 flex items-center justify-center rounded-full bg-charcoal/5 text-mute hover:text-charcoal hover:rotate-90 transition-all"
                                aria-label="Close menu"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                            <ul className="flex flex-col gap-6">
                                {SERVICES_NAV.map((item, idx) => (
                                    <motion.li
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                    >
                                        <a
                                            href={item.href}
                                            className="text-4xl font-display font-bold hover:text-brass transition-colors"
                                            style={{ color: 'var(--color-charcoal)' }}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                            <div className="mt-auto pt-10 border-t-2" style={{ borderColor: 'var(--color-border)' }}>
                                <button
                                    onClick={() => { openLeadModal({}); setMobileOpen(false); }}
                                    className="w-full py-5 rounded-2xl text-white font-bold text-sm uppercase tracking-widest shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))',
                                        boxShadow: '0 15px 30px -10px rgba(184, 137, 42, 0.4)'
                                    }}
                                >
                                    Book Free Site Visit
                                </button>
                                <div className="mt-8 flex flex-col items-center gap-2">
                                    <a href={`tel:${CONTACT_INFO.phone1}`} className="text-xl font-bold font-display" style={{ color: 'var(--color-charcoal)' }}>
                                        {CONTACT_INFO.phone1Display}
                                    </a>
                                    <a href={`tel:${CONTACT_INFO.phone2}`} className="text-lg font-medium opacity-60" style={{ color: 'var(--color-charcoal)' }}>
                                        {CONTACT_INFO.phone2Display}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
function LogoSVG({ light = false }: { light?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            {/* Company Name */}
            <div className="flex flex-col justify-center -space-y-1 leading-none">
                <div className="flex items-baseline gap-1">
                    <span
                        className="font-display text-3xl md:text-4xl font-black tracking-tighter transition-colors duration-500"
                        style={{ color: light ? '#F5EFE0' : 'var(--color-charcoal)' }}
                    >
                        AMS
                    </span>
                    <span
                        className="font-display text-sm md:text-base font-bold tracking-[0.3em] uppercase"
                        style={{ color: 'var(--color-brass)' }}
                    >
                        INTERIOR
                    </span>
                </div>
                <span
                    className="font-body text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 ml-0.5 transition-colors duration-500"
                    style={{ color: light ? '#F5EFE0' : 'var(--color-charcoal)' }}
                >
                    Delhi&apos;s Elite Interior Studio
                </span>
            </div>
        </div>
    );
}
 