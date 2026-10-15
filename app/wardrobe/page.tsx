import type { Metadata } from 'next';
import TourClient from '@/components/tour/TourClient';

export const metadata: Metadata = {
    title: 'Wardrobe 3D Tour',
    description: 'Open the doors of a four-door AMS wardrobe in 3D, change finishes and handles, and get an instant estimate.',
    alternates: { canonical: '/wardrobe' },
};

export default function WardrobePage() {
    return <TourClient slug="wardrobe" />;
}
