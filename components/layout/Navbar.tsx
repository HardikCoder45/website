'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { SERVICES_NAV, CONTACT_INFO } from '@/lib/data/config';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);
    const activeSection = useAppStore((s) => s.activeSection);

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
                className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
                    boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div className="container-site h-20 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2 shrink-0 group">
                        <LogoSVG />
                    </a>

                    {/* Desktop Nav Links */}
                    <ul className="hidden lg:flex items-center gap-10">
                        {SERVICES_NAV.map((item) => {
                            const sectionId = item.href.replace('#', '');
                            const isActive = activeSection === sectionId;
                            return (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="text-sm font-body transition-all duration-300 hover:text-brass"
                                        style={{
                                            color: isActive ? 'var(--color-brass)' : 'var(--color-mute)',
                                            fontWeight: isActive ? '700' : '500',
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    {/* CTA + hamburger */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => openLeadModal({ service: 'General' })}
                            className="hidden md:flex items-center gap-3 px-6 py-3.5 rounded-2xl text-xs font-bold text-white transition-all uppercase tracking-widest"
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
                            className="lg:hidden flex flex-col gap-1.5 p-3 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 transition-colors"
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                        >
                            <span className="block w-6 h-0.5 bg-charcoal rounded" />
                            <span className="block w-6 h-0.5 bg-charcoal rounded" />
                            <span className="block w-4 h-0.5 bg-charcoal rounded self-end" />
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
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                            <ul className="flex flex-col gap-8">
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
function LogoSVG() {
    return (
        <div className="flex items-center gap-3">
            {/* Logo Image */}
            <div className="relative shrink-0 group-hover:scale-110 transition-transform duration-500">
                 
                <div className="absolute inset-0 bg-brass/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Company Name */}
            <div className="flex flex-col justify-center -space-y-1 leading-none">
                <div className="flex items-baseline gap-1">
                    <span
                        className="font-display text-3xl md:text-4xl font-black tracking-tighter"
                        style={{ color: 'var(--color-charcoal)' }}
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
                    className="font-body text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 ml-0.5"
                    style={{ color: 'var(--color-charcoal)' }}
                >
                    Delhi&apos;s Elite Interior Studio
                </span>
            </div>
        </div>
    );
}
 