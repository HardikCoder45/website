'use client';
import { motion } from 'framer-motion';
import { GalleryCategory } from '@/lib/data/gallery';

interface GalleryFilterProps {
    categories: GalleryCategory[];
    activeCategory: GalleryCategory;
    onSelect: (c: GalleryCategory) => void;
}

export default function GalleryFilter({ categories, activeCategory, onSelect }: GalleryFilterProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 snap-x-scroll mb-10 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
            {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className="relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap snap-start transition-colors"
                        style={{
                            color: isActive ? '#F5EFE0' : 'var(--color-charcoal)',
                            background: isActive ? 'var(--color-brass)' : 'rgba(250,250,247,0.8)',
                            border: '1px solid',
                            borderColor: isActive ? 'var(--color-brass)' : 'var(--color-border)',
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-filter"
                                className="absolute inset-0 rounded-full z-0"
                                style={{ background: 'var(--color-brass)', boxShadow: 'var(--shadow-brass)' }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                        <span className="relative z-10">{cat}</span>
                    </button>
                );
            })}
        </div>
    );
}
