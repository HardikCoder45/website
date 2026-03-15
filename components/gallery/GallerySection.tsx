'use client';
import { useState, useMemo, useRef } from 'react';
import { galleryPhotos, galleryCategories, GalleryCategory } from '@/lib/data/gallery';
import GalleryFilter from './GalleryFilter';
import MasonryGrid from './MasonryGrid';
import LightboxWrapper from './Lightbox';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
    const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    const filteredPhotos = useMemo(() => {
        if (activeCategory === 'All') return galleryPhotos;
        return galleryPhotos.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    const handlePhotoClick = (index: number) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    useGSAP(() => {
        const headerElements = sectionRef.current?.querySelectorAll('.gallery-header-el');
        const gridWrapper = sectionRef.current?.querySelector('.gallery-grid-wrapper');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        if (headerElements?.length) {
            tl.fromTo(headerElements,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );
        }

        if (gridWrapper) {
            // Parallax scrub on the entire grid
            gsap.fromTo(gridWrapper,
                { y: 50 },
                {
                    y: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    }
                }
            );
        }
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="gallery" className="section-pad scroll-mt-16" style={{ background: 'var(--color-sand)' }}>
            <div className="container-site">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span
                        className="gallery-header-el opacity-0 inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full border border-brass/30 text-brass-dark bg-brass/5"
                    >
                        Our Portfolio
                    </span>
                    <h2
                        className="gallery-header-el opacity-0 text-4xl md:text-5xl font-display font-semibold mb-6"
                        style={{ color: 'var(--color-charcoal)' }}
                    >
                        100+ Stories of <span className="text-brass-gradient">Transformation</span>
                    </h2>
                    <p
                        className="gallery-header-el opacity-0 text-mute px-4"
                    >
                        Browse real site photos from our recent projects across Delhi NCR.
                    </p>
                </div>

                {/* Filter Bar */}
                <GalleryFilter
                    categories={galleryCategories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />

                {/* Masonry Grid with parallax wrapper */}
                <div className="gallery-grid-wrapper">
                    <MasonryGrid photos={filteredPhotos} onPhotoClick={handlePhotoClick} />
                </div>

                {/* Lightbox Wrapper */}
                <LightboxWrapper
                    photos={filteredPhotos}
                    isOpen={lightboxOpen}
                    currentIndex={photoIndex}
                    onClose={() => setLightboxOpen(false)}
                />

                {/* View All CTA */}
                <div className="mt-16 text-center">
                    <a
                        href="https://www.justdial.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium border hover:bg-black/5 transition-colors"
                        style={{ color: 'var(--color-charcoal)', borderColor: 'var(--color-border-strong)' }}
                    >
                        Read client reviews on Justdial <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
