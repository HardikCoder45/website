'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { CONTACT_INFO } from '@/lib/data/config';

export default function StickyLeadBar() {
    const [visible, setVisible] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    useEffect(() => {
        const hero = document.getElementById('hero-section');
        if (!hero) return;
        const obs = new IntersectionObserver(
            ([entry]) => setVisible(!entry.isIntersecting),
            { threshold: 0 }
        );
        obs.observe(hero);
        return () => obs.disconnect();
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Mobile — bottom bar */}
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
                        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
                        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}
                    >
                        <div className="container-site flex gap-3 py-3">
                            <a
                                href={`tel:${CONTACT_INFO.phone1}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border"
                                style={{ borderColor: 'var(--color-border)', color: 'var(--color-charcoal)' }}
                            >
                                <PhoneIcon /> Call Now
                            </a>
                            <button
                                onClick={() => openLeadModal({})}
                                className="flex-1 py-3 rounded-xl text-sm font-medium text-white"
                                style={{ background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))' }}
                            >
                                Book Site Visit
                            </button>
                        </div>
                    </motion.div>

                    {/* Desktop — bottom-right FAB */}
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => openLeadModal({})}
                        className="hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-brass) 0%, var(--color-brass-dark) 100%)',
                            boxShadow: '0 8px 32px rgba(184,137,42,0.35)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <CalendarIcon />
                        Book Free Site Visit
                    </motion.button>
                </>
            )}
        </AnimatePresence>
    );
}

const PhoneIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16v2.92z" />
    </svg>
);
const CalendarIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
