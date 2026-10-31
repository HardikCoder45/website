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
    { id: 'frame', title: 'Frame', weeks: 'Weeks 6–12', body: 'RCC columns in M25 concrete with Fe-550D steel. Every lift is cured for 14 days before the next.' },
    { id: 'slabs', title: 'Slabs', weeks: 'Weeks 8–16', body: 'Each slab is cast in a single pour and kept ponded for 21 days. Shuttering stays up for 14.' },
    { id: 'walls', title: 'Walls', weeks: 'Weeks 12–20', body: '9-inch brick outer walls and 4.5-inch partitions. Conduits and plumbing go in before plaster.', price: 'Grey structure ₹1,350–1,650 / sq ft' },
    { id: 'openings', title: 'Openings', weeks: 'Weeks 18–24', body: 'Window frames, balcony glazing and terrace parapet. Roof and wet areas waterproofed and pond-tested.' },
    { id: 'finishes', title: 'Finishes', weeks: 'Weeks 22–30', body: 'Plaster, flooring, bathroom fittings, terracotta cladding and two coats of paint inside and out.' },
    { id: 'interiors', title: 'Interiors', weeks: 'Weeks 28–36', body: 'Kitchen and wardrobes from our Indirapuram factory, false ceilings and lights. Then the keys.', price: 'Turnkey from ₹1,950 / sq ft' },
];
