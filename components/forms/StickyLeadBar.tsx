'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { CONTACT_INFO } from '@/lib/data/config';

/** Mobile-only call / book bar, shown once the hero has scrolled away. */
export default function StickyLeadBar() {
    const [visible, setVisible] = useState(false);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    useEffect(() => {
        const hero = document.getElementById('hero-section');
        if (!hero) return;
        const obs = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
        obs.observe(hero);
        return () => obs.disconnect();
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                    className="fixed bottom-0 inset-x-0 z-40 md:hidden"
                    style={{ background: 'rgba(20,19,16,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid var(--color-line-dark)' }}
                >
                    <div className="container-site flex gap-3 py-3">
                        <a href={`tel:${CONTACT_INFO.phone1}`} className="label flex-1 flex items-center justify-center py-3.5 rounded-full border" style={{ borderColor: 'rgba(238,233,225,0.3)', color: '#EEE9E1' }}>
                            Call
                        </a>
                        <button onClick={() => openLeadModal({})} className="label flex-[2] py-3.5 rounded-full" style={{ background: '#EEE9E1', color: '#141310' }}>
                            Book a free visit
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
