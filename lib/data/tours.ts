import { KITCHEN_FINISHES, type FinishGroup } from '@/lib/three/finishes';

export type Vec3 = [number, number, number];

export interface TourStop {
    id: string;
    label: string;
    description: string;
    position: Vec3;
    target: Vec3;
    /** Where the clickable hotspot sits in the scene. Defaults to `target`. */
    hotspot?: Vec3;
}

export interface TourToggle {
    id: string;
    label: string;
    default: boolean;
}

export interface TourDef {
    slug: 'kitchen' | 'wardrobe' | 'interior';
    title: string;
    eyebrow: string;
    intro: string;
    /** Service name passed to the lead form. */
    service: string;
    /** Typical area used for the live estimate, in sq.ft. */
    area: number;
    /** Base ₹/sq.ft range before finish upgrades. */
    rate: [number, number];
    stops: TourStop[];
    finishes: FinishGroup[];
    toggles: TourToggle[];
    hdri: { day: string; evening: string };
}

export const WARDROBE_FINISHES: FinishGroup[] = [
    {
        id: 'shutters',
        label: 'Shutter finish',
        materials: ['wardrobe-shutter'],
        choices: [
            { id: 'oak', label: 'Smoked Oak', swatch: '#6d5440', priceDelta: 200, original: true },
            { id: 'cream', label: 'Cream Matte', swatch: '#e8dfcc', priceDelta: 0, color: '#e6ddca', roughness: 0.6 },
            { id: 'olive', label: 'Olive Fluted', swatch: '#6f7558', priceDelta: 250, color: '#6c7356', roughness: 0.45 },
            { id: 'espresso', label: 'Espresso Gloss', swatch: '#2b2019', priceDelta: 300, color: '#2a1f18', roughness: 0.12 },
        ],
    },
    {
        id: 'glass',
        label: 'Centre panel',
        materials: ['wardrobe-glass'],
        choices: [
            { id: 'bronze', label: 'Bronze Mirror', swatch: '#8a6a4a', priceDelta: 180, original: true },
            { id: 'smoke', label: 'Smoked Glass', swatch: '#3a3a3c', priceDelta: 150, color: '#2e2e31', roughness: 0.05, metalness: 0.6 },
            { id: 'clear', label: 'Clear Mirror', swatch: '#cfd6dc', priceDelta: 120, color: '#d9e0e6', roughness: 0.02, metalness: 1 },
            { id: 'match', label: 'Match Shutters', swatch: '#a08c76', priceDelta: 0, color: '#9c8771', roughness: 0.5, metalness: 0 },
        ],
    },
    {
        id: 'handles',
        label: 'Profile handles',
        materials: ['wardrobe-handle'],
        choices: [
            { id: 'gold', label: 'Brushed Gold', swatch: '#c9a86a', priceDelta: 40, original: true },
            { id: 'black', label: 'Matte Black', swatch: '#1a1a1a', priceDelta: 20, color: '#161616', roughness: 0.6, metalness: 0.4 },
            { id: 'steel', label: 'Brushed Steel', swatch: '#b9bcc0', priceDelta: 30, color: '#c4c7cb', roughness: 0.35, metalness: 1 },
        ],
    },
];

export const INTERIOR_FINISHES: FinishGroup[] = [
    {
        id: 'walls',
        label: 'Wall colour',
        materials: ['room-wall'],
        choices: [
            { id: 'linen', label: 'Warm Linen', swatch: '#e7dccb', priceDelta: 0, original: true },
            { id: 'clay', label: 'Desert Clay', swatch: '#c79a7c', priceDelta: 15, color: '#c59779' },
            { id: 'sage', label: 'Soft Sage', swatch: '#a9b39b', priceDelta: 15, color: '#a6b097' },
            { id: 'ink', label: 'Midnight Ink', swatch: '#2c3140', priceDelta: 25, color: '#2b303e' },
        ],
    },
    {
        id: 'panel',
        label: 'Feature wall',
        materials: ['room-panel'],
        choices: [
            { id: 'walnut', label: 'Walnut Fluted', swatch: '#5c4130', priceDelta: 180, original: true },
            { id: 'oak', label: 'Light Oak', swatch: '#b48c62', priceDelta: 160, color: '#b38a60' },
            { id: 'marble', label: 'Travertine', swatch: '#d8cbb6', priceDelta: 260, color: '#d6c9b3', roughness: 0.35 },
            { id: 'charcoal', label: 'Charcoal Slats', swatch: '#2a2826', priceDelta: 170, color: '#282624' },
        ],
    },
    {
        id: 'floor',
        label: 'Flooring',
        materials: ['room-floor'],
        choices: [
            { id: 'herringbone', label: 'Honey Oak', swatch: '#a57a4f', priceDelta: 120, original: true },
            { id: 'marble', label: 'Italian Marble', swatch: '#ebe6dd', priceDelta: 220, color: '#ece7de', roughness: 0.12 },
            { id: 'ash', label: 'Ash Grey', swatch: '#8d867c', priceDelta: 90, color: '#8b847a' },
        ],
    },
    {
        id: 'cove',
        label: 'Cove lighting',
        materials: ['room-cove'],
        choices: [
            { id: 'warm', label: 'Warm 2700K', swatch: '#ffc27a', priceDelta: 0, original: true },
            { id: 'neutral', label: 'Neutral 4000K', swatch: '#fff1dc', priceDelta: 0, color: '#fff1dc' },
            { id: 'amber', label: 'Amber Glow', swatch: '#ff9a3d', priceDelta: 0, color: '#ff9a3d' },
        ],
    },
];

export const TOURS: Record<TourDef['slug'], TourDef> = {
    kitchen: {
        slug: 'kitchen',
        title: 'The Modular Kitchen',
        eyebrow: 'Live 3D tour · 01',
        intro: 'An island kitchen with tall pantry units, LED-lit shelving and a breakfast bar. Change every finish and see it instantly.',
        service: 'Modular Kitchen',
        area: 120,
        rate: [1200, 1600],
        finishes: KITCHEN_FINISHES,
        toggles: [],
        hdri: { day: '/hdri/apartment.exr', evening: '/hdri/night.exr' },
        stops: [
            { id: 'overview', label: 'Overview', description: 'L-shaped run with a full island — the most popular layout for 10×12 ft Delhi kitchens.', position: [3.3, 2.15, 2.35], target: [-0.6, 1.0, -1.6], hotspot: [0.6, 1.1, -0.4] },
            { id: 'island', label: 'Island & breakfast bar', description: 'Seating for three, soft-close drawers on both sides and an LED kick that floats the island at night.', position: [2.4, 1.45, 2.3], target: [0.4, 0.9, 0.0], hotspot: [0.8, 1.0, 0.25] },
            { id: 'cooking', label: 'Cooking wall', description: 'Built-in oven, chimney with ducting and a full-height zellige backsplash that wipes clean.', position: [0.2, 1.55, -0.2], target: [0.0, 1.3, -3.85], hotspot: [0.0, 1.35, -3.6] },
            { id: 'pantry', label: 'Tall pantry', description: 'Floor-to-ceiling pantry with pull-out wire baskets, sized for a month of groceries.', position: [0.9, 1.65, 1.5], target: [-3.4, 1.35, -1.5], hotspot: [-3.0, 1.5, -1.5] },
            { id: 'details', label: 'Hardware & details', description: 'Profile handles, under-cabinet LED strips and Hettich soft-close channels on every drawer.', position: [1.6, 1.35, -1.4], target: [-1.2, 1.1, -3.6], hotspot: [-1.2, 1.2, -3.5] },
        ],
    },
    wardrobe: {
        slug: 'wardrobe',
        title: 'The Master Wardrobe',
        eyebrow: 'Live 3D tour · 02',
        intro: 'A 9-foot, four-door wardrobe with a mirrored centre panel, internal LED and a dresser drawer bank. Open the doors to see inside.',
        service: 'Wardrobe',
        area: 72,
        rate: [1000, 1500],
        finishes: WARDROBE_FINISHES,
        toggles: [{ id: 'open', label: 'Open doors', default: false }],
        hdri: { day: '/hdri/apartment.exr', evening: '/hdri/night.exr' },
        stops: [
            { id: 'overview', label: 'Overview', description: 'Four doors across 9 ft, ceiling-height for maximum storage and a seamless look.', position: [0.4, 1.5, 4.4], target: [0, 1.25, 0], hotspot: [0, 2.0, 0.35] },
            { id: 'hanging', label: 'Long hanging', description: 'A full-length hanging bay for sarees and coats, with an oval chrome rail and a lit interior.', position: [-0.6, 1.35, 2.1], target: [-0.9, 1.4, 0], hotspot: [-0.9, 1.6, 0.3] },
            { id: 'drawers', label: 'Drawer bank', description: 'Three soft-close drawers with velvet-lined jewellery trays and an internal locker.', position: [1.1, 1.0, 1.9], target: [0.95, 0.6, 0], hotspot: [0.95, 0.6, 0.3] },
            { id: 'loft', label: 'Loft storage', description: 'Top lofts for suitcases and seasonal bedding, with gas-lift shutters.', position: [0.3, 2.05, 2.9], target: [0, 2.3, 0], hotspot: [0, 2.5, 0.33] },
            { id: 'corner', label: 'Reading corner', description: 'A styled corner showing how the wardrobe sits in a complete master bedroom.', position: [2.6, 1.3, 2.9], target: [1.5, 0.6, 1.2], hotspot: [2.3, 0.7, 1.4] },
        ],
    },
    interior: {
        slug: 'interior',
        title: 'The Living Suite',
        eyebrow: 'Live 3D tour · 03',
        intro: 'A full living room — fluted feature wall, floating TV console, cove-lit false ceiling and curated furniture. Restyle the whole room live.',
        service: 'Full Home Interior',
        area: 320,
        rate: [600, 1100],
        finishes: INTERIOR_FINISHES,
        toggles: [{ id: 'leather', label: 'Leather sofa', default: false }],
        hdri: { day: '/hdri/apartment.exr', evening: '/hdri/night.exr' },
        stops: [
            { id: 'overview', label: 'Overview', description: 'An open 16×20 ft living room styled end to end — civil, ceiling, carpentry, lighting and décor.', position: [4.6, 2.3, 4.6], target: [-0.4, 0.9, -0.6], hotspot: [0, 1.6, -2.9] },
            { id: 'feature', label: 'Feature wall & TV unit', description: 'Fluted panelling with a floating, handle-less console and hidden cable management.', position: [0.2, 1.4, 1.6], target: [0, 1.3, -3], hotspot: [1.4, 1.4, -2.85] },
            { id: 'seating', label: 'Seating zone', description: 'Sofa, accent chair and side lamp arranged around a 2.4 m rug for easy conversation.', position: [-2.4, 1.3, -1.2], target: [0.4, 0.55, 1.4], hotspot: [0, 0.8, 1.5] },
            { id: 'ceiling', label: 'False ceiling', description: 'Gypsum false ceiling with a recessed cove, LED strip and spotlights on separate circuits.', position: [2.6, 1.5, 2.8], target: [-1.2, 2.4, -1.6], hotspot: [-1.5, 2.85, -1.5] },
            { id: 'window', label: 'Window seat', description: 'A cushioned window bench with storage below — perfect morning light.', position: [-1.0, 1.4, 1.4], target: [-3.8, 1.0, 0.0], hotspot: [-3.4, 0.6, 0.2] },
        ],
    },
};
