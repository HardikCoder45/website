'use client';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { GalleryPhoto } from '@/lib/data/gallery';

interface LightboxWrapperProps {
    photos: GalleryPhoto[];
    isOpen: boolean;
    currentIndex: number;
    onClose: () => void;
}

export default function LightboxWrapper({ photos, isOpen, currentIndex, onClose }: LightboxWrapperProps) {
    // Map our customized photo objects into YARL slides
    const slides = photos.map(p => ({
        src: p.src, // Currently dummy paths, YARL will try to load but we can just use the DOM elements or ignore broken images in demo
        title: p.alt,
        description: `${p.category} | ${p.scope} | ${p.location} | ${p.materials}`,
        alt: p.alt
    }));

    return (
        <Lightbox
            open={isOpen}
            close={onClose}
            index={currentIndex}
            slides={slides}
            plugins={[Captions]}
            carousel={{ padding: 64, spacing: 24 }}
            styles={{
                container: { backgroundColor: 'rgba(20, 15, 8, 0.95)' },
                button: { filter: 'none', color: 'var(--color-brass-light)' },
            }}
            render={{
                // Custom slide to handle dummy images gracefully
                slide: ({ slide }) => (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <div className="relative w-full max-w-5xl aspect-video md:aspect-[16/9] flex items-center justify-center rounded-2xl border" style={{ background: 'var(--color-charcoal)', borderColor: 'var(--color-border)' }}>
                            <div className="text-center flex flex-col items-center gap-4">
                                <svg width="48" height="48" fill="none" stroke="var(--color-brass)" strokeWidth="1" viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <div>
                                    <h3 className="text-xl font-display text-white mb-2">{slide.title}</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-brass-light)' }}>{slide.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
