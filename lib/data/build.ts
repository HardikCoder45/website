// The eight construction stages shown by the hero. Copy is concrete on purpose:
// what happens on site, in what order, and roughly when.

export interface BuildStage {
    id: string;
    title: string;
    weeks: string;
    body: string;
    /** Optional price marker shown when this stage is active. */
    price?: string;
}

export const BUILD_STAGES: BuildStage[] = [
    { id: 'setting-out', title: 'Setting out', weeks: 'Weeks 1–3', body: 'Soil test, survey and the plot marked out in lime. Structural drawings go to the MCD for sanction.' },
    { id: 'foundation', title: 'Foundation', weeks: 'Weeks 3–6', body: 'Excavation, PCC bed, isolated footings and plinth beams. Anti-termite treatment before the backfill.' },
    { id: 'frame', title: 'Frame', weeks: 'Weeks 6–12', body: 'RCC columns with ISI TMT steel. Every lift is cured for 14 days before the next.' },
    { id: 'slabs', title: 'Slabs', weeks: 'Weeks 8–16', body: 'Each slab is cast in a single pour and kept ponded for 21 days. Shuttering stays up for 14.' },
    { id: 'walls', title: 'Walls', weeks: 'Weeks 12–20', body: '9-inch brick outer walls and 4.5-inch partitions. Conduits and plumbing go in before plaster.' },
    { id: 'openings', title: 'Openings', weeks: 'Weeks 18–24', body: 'Window frames, balcony glazing and terrace parapet. Roof and wet areas waterproofed and pond-tested.' },
    { id: 'finishes', title: 'Finishes', weeks: 'Weeks 22–30', body: 'Plaster, stone cladding, flooring, bathroom fittings and two coats of paint inside and out.', price: 'House construction from ₹1,200 / sq ft' },
    { id: 'interiors', title: 'Interiors', weeks: 'Weeks 28–36', body: 'Kitchen and wardrobes from our Indirapuram factory, false ceilings and lights. Then the keys.', price: 'Modular kitchens from ₹1,000 / sq ft' },
];

// ── Hero scroll ranges ───────────────────────────────────────────────────
// p runs from `start` (empty plot) through the eight stages to `built`, then the
// camera walks through the front glass into the living room and the kitchen.
export const HERO_P = {
    start: -0.6,
    built: 8.4,
    enter: 9.3,   // inside the living room
    swap: 10.9,   // cut to the kitchen
    end: 12.6,
} as const;

export type HeroPhase = 'house' | 'living' | 'kitchen';

export function heroPhase(p: number): HeroPhase {
    if (p < HERO_P.enter) return 'house';
    return p < HERO_P.swap ? 'living' : 'kitchen';
}

/** Captions for the interior showcase that follows the build. */
export const SHOWCASE: Record<Exclude<HeroPhase, 'house'>, { eyebrow: string; title: string; body: string; price: string }> = {
    living: {
        eyebrow: 'Inside · Living room',
        title: 'Living room',
        body: 'Fluted walnut wall with a floating console, a gypsum ceiling with warm cove light, and an oak floor. Designed in 3D before a single board is cut.',
        price: 'Full-home interiors · 2BHK ₹1,100 / sq ft',
    },
    kitchen: {
        eyebrow: 'Inside · Kitchen',
        title: 'Modular kitchen',
        body: 'Wenge shutters, a dark stone counter and an island that seats three. Made in our Indirapuram factory and fitted in 15–20 days.',
        price: 'Wooden modular kitchen ₹1,300 / sq ft',
    },
};
