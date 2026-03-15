'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function WardrobePage() {
    const router = useRouter();

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="fixed top-8 left-8 z-[100] flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all group"
            >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Home</span>
            </motion.button>

            {/* Hint Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
            >
                <div className="px-6 py-3 rounded-full bg-brass/20 backdrop-blur-md border border-brass/30 text-brass-light text-[10px] font-bold uppercase tracking-[0.3em]">
                    Use Scroll to Navigate the 3D Wardrobe Studio
                </div>
            </motion.div>

            {/* The Walkthrough Canvas */}
            <iframe
                src="/wardrobe.html"
                className="w-full h-full border-none"
                title="Wardrobe Portfolio Walkthrough"
            />
        </main>
    );
}
