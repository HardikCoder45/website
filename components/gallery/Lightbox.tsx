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
    const slides = photos.map(p => ({
        src: p.src,
        alt: p.alt,
        title: p.alt,
        description: [p.category, p.scope, p.location, p.materials].filter(Boolean).join('  ·  '),
    }));

    return (
        <Lightbox
            open={isOpen}
            close={onClose}
            index={currentIndex}
            slides={slides}
            plugins={[Captions]}
            captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 2 }}
            carousel={{ padding: 48, spacing: 24 }}
            animation={{ fade: 400, swipe: 500 }}
            styles={{
                container: { backgroundColor: 'rgba(20, 15, 8, 0.96)' },
                button: { filter: 'none', color: 'var(--color-brass-light)' },
            }}
        />
    );
}
