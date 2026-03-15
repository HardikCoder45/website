'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryPhoto } from '@/lib/data/gallery';

interface MasonryGridProps {
    photos: GalleryPhoto[];
    onPhotoClick: (index: number) => void;
}

export default function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
    return (
        <div className="masonry-grid">
            <AnimatePresence mode="popLayout">
                {photos.map((photo, index) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 0.98, y: -5 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        key={photo.id}
                        className="masonry-item relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl bg-charcoal"
                        onClick={() => onPhotoClick(index)}
                    >
                        {/* Image Container */}
                        <div className={`relative w-full overflow-hidden ${photo.tall ? 'aspect-[3/4.5]' : 'aspect-square'}`}>
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                            />

                            {/* Always visible label (for V8 Balance) */}
                            <div className="absolute bottom-4 left-4 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                                <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                                    {photo.category} — {photo.location}
                                </span>
                            </div>

                            {/* Hover Reveal Content */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-brass uppercase">{photo.category}</span>
                                        <span className="text-[10px] font-medium text-white/50 uppercase">{photo.location}</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight">{photo.alt}</h3>
                                    <p className="text-[11px] text-white/70 leading-relaxed mb-4 line-clamp-3 italic opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                        &quot;{photo.story}&quot;
                                    </p>
                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] uppercase tracking-widest text-white/40">Project</span>
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">{photo.scope}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] uppercase tracking-widest text-white/40">Year</span>
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">{photo.year}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expansion Icon */}
                        <div className="absolute top-6 right-6 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
