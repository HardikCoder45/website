import type { Metadata } from 'next';
import TourClient from '@/components/tour/TourClient';

export const metadata: Metadata = {
    title: 'Living Room 3D Tour',
    description: 'Walk through a fully designed living room in 3D: feature wall, false ceiling, cove lighting and furniture. Restyle it live.',
    alternates: { canonical: '/interior' },
};

export default function InteriorPage() {
    return <TourClient slug="interior" />;
}
