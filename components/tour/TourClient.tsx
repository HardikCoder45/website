'use client';
import dynamic from 'next/dynamic';
import { TOURS, type TourDef } from '@/lib/data/tours';

// WebGL needs the browser, so the whole experience (and each scene) is client-only.
const TourExperience = dynamic(() => import('./TourExperience'), { ssr: false });
const scenes = {
    kitchen: dynamic(() => import('./scenes/KitchenScene'), { ssr: false }),
    wardrobe: dynamic(() => import('./scenes/WardrobeScene'), { ssr: false }),
    interior: dynamic(() => import('./scenes/InteriorScene'), { ssr: false }),
};

export default function TourClient({ slug }: { slug: TourDef['slug'] }) {
    return <TourExperience tour={TOURS[slug]} Scene={scenes[slug]} />;
}
