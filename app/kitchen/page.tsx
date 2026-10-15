import type { Metadata } from 'next';
import TourClient from '@/components/tour/TourClient';

export const metadata: Metadata = {
    title: 'Modular Kitchen 3D Tour',
    description: 'Walk through an AMS modular kitchen in real-time 3D. Switch shutters, countertops, backsplash and hardware live and get an instant estimate.',
    alternates: { canonical: '/kitchen' },
};

export default function KitchenPage() {
    return <TourClient slug="kitchen" />;
}
