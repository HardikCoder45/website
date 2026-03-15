'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import LeadForm from './LeadForm';

export default function LeadModal() {
    const { isLeadModalOpen, closeLeadModal, leadFormData } = useAppStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLeadModal(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeLeadModal]);

    useEffect(() => {
        document.body.style.overflow = isLeadModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isLeadModalOpen]);

    if (!isLeadModalOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4"
                onClick={closeLeadModal}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-8 md:p-12"
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 0 80px -20px rgba(184, 137, 42, 0.15), 0 50px 100px -20px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Decorative Ambient Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brass/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brass/5 blur-[100px] rounded-full pointer-events-none" />

                    <button
                        onClick={closeLeadModal}
                        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-charcoal/5 hover:bg-charcoal/10 flex items-center justify-center transition-all hover:rotate-90"
                    >
                        <svg width="20" height="20" fill="none" stroke="var(--color-charcoal)" strokeWidth="2.5"><path d="M15 5L5 15M5 5l10 10" /></svg>
                    </button>

                    <div className="relative z-10 mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[1px] bg-brass/40" />
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase" style={{ color: 'var(--color-brass)' }}>
                                Bespoke Experience
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4 tracking-tight">
                            Design Your <span className="text-brass">Legacy.</span>
                        </h2>
                        <p className="text-mute/80 text-sm font-medium leading-relaxed max-w-md">
                            Book a free premium site visit with our lead designers to transform your vision into reality.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <LeadForm onSuccess={closeLeadModal} defaultService={leadFormData.service || leadFormData.package} />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
