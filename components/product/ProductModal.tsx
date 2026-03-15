'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center, Box } from '@react-three/drei';
import { useProductStore } from '@/lib/store/useProductStore';
import { useAppStore } from '@/lib/store/useAppStore';
import { Suspense } from 'react';

// Placeholder 3D viewer (since we don't have .glb files yet)
function ProductViewer3D({ category }: { category: string }) {
    return (
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
            <Suspense fallback={null}>
                <Stage adjustCamera intensity={0.5} environment="city">
                    <Center>
                        {category === 'wardrobe' ? (
                            <Box args={[1.5, 2.5, 0.8]}>
                                <meshStandardMaterial color="#2C2416" roughness={0.1} metalness={0.2} />
                            </Box>
                        ) : category === 'interior' ? (
                            <group>
                                <Box position={[-1, 0, 0]} args={[1, 2, 1]}><meshStandardMaterial color="#B8892A" /></Box>
                                <Box position={[1, -0.5, 0]} args={[1.5, 1, 1]}><meshStandardMaterial color="#FAFAF7" /></Box>
                            </group>
                        ) : (
                            <Box args={[2, 1, 1]}>
                                <meshStandardMaterial color="#FAFAF7" roughness={0.08} />
                            </Box>
                        )}
                    </Center>
                </Stage>
            </Suspense>
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} enableZoom={false} />
        </Canvas>
    );
}

export default function ProductModal() {
    const { isOpen, activeProduct, closeModal } = useProductStore();
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    // Close on Escape mapped to window
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen || !activeProduct) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4 md:p-8"
                onClick={closeModal}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                    >
                        <svg width="24" height="24" fill="none" stroke="var(--color-charcoal)" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left: 3D Viewer */}
                    <div className="w-full md:w-3/5 h-[40vh] md:h-full relative bg-charcoal/5 cursor-grab active:cursor-grabbing">
                        <ProductViewer3D category={activeProduct.category} />
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg glass text-[10px] uppercase font-bold tracking-widest text-charcoal shadow-sm">
                                Interact to Rotate
                            </span>
                        </div>
                    </div>

                    {/* Right: Details & Variants */}
                    <div className="w-full md:w-2/5 h-full overflow-y-auto p-8 lg:p-10 flex flex-col hide-scrollbar">
                        <p className="text-xs uppercase tracking-widest font-bold mb-2 text-brass">
                            {activeProduct.category || "Product Detail"}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-charcoal">
                            {activeProduct.name}
                        </h2>
                        <p className="text-mute mb-8 leading-relaxed">
                            {activeProduct.description}
                        </p>

                        {/* Spec list */}
                        <div className="mb-8">
                            <h4 className="text-xs uppercase font-bold tracking-widest text-charcoal mb-4">Features & Inclusions</h4>
                            <ul className="space-y-3">
                                {activeProduct.tags.map(tag => (
                                    <li key={tag} className="flex items-center gap-3 text-sm text-mute">
                                        <svg width="16" height="16" fill="none" stroke="var(--color-brass)" strokeWidth="2" viewBox="0 0 24 24">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Spacer */}
                        <div className="mt-auto pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-mute">Starting from</p>
                                    <p className="text-3xl font-bold text-charcoal">
                                        ₹{activeProduct.startingPrice.toLocaleString('en-IN')}
                                        <span className="text-sm font-normal text-mute">/sq.ft</span>
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    closeModal();
                                    setTimeout(() => {
                                        openLeadModal({ service: activeProduct.name });
                                    }, 300);
                                }}
                                className="w-full py-4 rounded-xl text-white font-medium shadow-xl hover:scale-[1.02] transition-transform duration-300"
                                style={{ background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))' }}
                            >
                                Get Quote for This
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
