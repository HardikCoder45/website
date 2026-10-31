// AMS rate card — indicative Delhi NCR rates for 2026, excluding GST.
//
// Ranges were set against published 2026 Delhi NCR guides (construction:
// ~₹1,800 basic / ~₹2,300 standard / ~₹3,100 premium per sq ft built-up;
// grey structure ~₹1,000–2,000; modular kitchens ₹1,500–3,000 per sq ft;
// wardrobes ₹1,000–3,500; POP ₹50–90, gypsum ₹80–135 per sq ft).
// They are starting points for a quote, not fixed prices. Update this file if
// AMS's own rates differ; every section of the site reads from here.

export const RATE_NOTE = 'Indicative 2026 rates for Delhi NCR, excluding GST. Final price after a free site survey.';

// ── Construction ─────────────────────────────────────────────────────────

export type BuildTier = 'essential' | 'signature' | 'bespoke';

export interface BuildPackage {
    id: BuildTier;
    name: string;
    rate: number; // ₹ per sq ft of built-up area
    summary: string;
    popular?: boolean;
}

export const BUILD_PACKAGES: BuildPackage[] = [
    { id: 'essential', name: 'Essential', rate: 1950, summary: 'A solid, well-finished home on a sensible budget.' },
    { id: 'signature', name: 'Signature', rate: 2450, summary: 'Better brands where you touch them every day.', popular: true },
    { id: 'bespoke', name: 'Bespoke', rate: 3150, summary: 'Stone floors, premium fittings, architect-led details.' },
];

/** What each package specifies, row by row, like a drawing schedule. */
export const BUILD_SPECS: { item: string; essential: string; signature: string; bespoke: string }[] = [
    { item: 'Structure', essential: 'RCC frame, M20 concrete', signature: 'RCC frame, M25 concrete', bespoke: 'RCC frame, M25, structural audit' },
    { item: 'Steel', essential: 'Fe-500 TMT, ISI', signature: 'Fe-550D TMT (Tata / JSW)', bespoke: 'Fe-550D TMT (Tata Tiscon)' },
    { item: 'Cement', essential: 'OPC 43, ISI brand', signature: 'UltraTech / ACC OPC 53', bespoke: 'UltraTech OPC 53' },
    { item: 'Walls', essential: 'Red clay brick, 9" outer', signature: 'Red brick or AAC block', bespoke: 'AAC block with insulation' },
    { item: 'Flooring', essential: 'Vitrified 600×600 mm', signature: 'Vitrified 800×1600 mm', bespoke: 'Italian marble / engineered wood' },
    { item: 'Kitchen', essential: 'Granite platform, steel sink', signature: 'Quartz top, modular base units', bespoke: 'Full modular kitchen (AMS)' },
    { item: 'Bathrooms', essential: 'Hindware / Cera', signature: 'Jaquar fittings, wall-hung WC', bespoke: 'Kohler / Grohe, rain shower' },
    { item: 'Electrical', essential: 'Anchor switches, Polycab wire', signature: 'Legrand switches, Havells wire', bespoke: 'Schneider / Legrand Arteor' },
    { item: 'Doors & windows', essential: 'Flush doors, aluminium windows', signature: 'Teak frames, UPVC windows', bespoke: 'Solid-wood doors, system windows' },
    { item: 'Paint', essential: 'Tractor emulsion inside', signature: 'Apcolite inside, Apex outside', bespoke: 'Royale inside, Ultima outside' },
    { item: 'Waterproofing', essential: 'Roof + wet areas', signature: 'Roof, wet areas, basement', bespoke: 'Membrane system, 10-yr warranty' },
    { item: 'Structural warranty', essential: '5 years', signature: '10 years', bespoke: '10 years' },
];

export const GREY_STRUCTURE = { min: 1350, max: 1650 };
export const STILT_RATE = 1450; // stilt parking floor, per sq ft

/** Delhi plots are sold in square yards; 1 sq yd = 9 sq ft. */
export const SQYD_TO_SQFT = 9;
/** Built-up per floor as a share of plot area (typical ground coverage for Delhi builder floors). */
export const DEFAULT_COVERAGE = 0.75;

/** Rough programme: months = base + per floor. */
export function buildMonths(floors: number, stilt: boolean) {
    return Math.round(4 + floors * 2 + (stilt ? 1 : 0));
}

// ── Services index (both disciplines) ────────────────────────────────────

export interface ServiceLine {
    id: string;
    anchor: string;
    discipline: 'Build' | 'Interiors';
    name: string;
    from: string;
    unit: string;
    detail: string;
    scope: string[];
    image: string;
}

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=700`;

export const SERVICE_LINES: ServiceLine[] = [
    {
        id: 'turnkey', anchor: 'construction', discipline: 'Build', name: 'House construction', from: '₹1,950', unit: '/ sq ft built-up',
        detail: 'Plot to keys: drawings, approvals support, structure, finishes and handover under one contract.',
        scope: ['Soil test, structural design, MCD drawings', 'RCC frame, brickwork, plaster', 'Plumbing, electrical, waterproofing', 'Flooring, doors, windows, paint'],
        image: '/renders/build-house.webp',
    },
    {
        id: 'grey', anchor: 'grey-structure', discipline: 'Build', name: 'Grey structure', from: '₹1,350', unit: '/ sq ft',
        detail: 'The civil shell only: foundation, frame, slabs, walls and plaster, for owners who finish with their own team.',
        scope: ['Excavation and footings', 'Columns, beams, slabs', 'Brick walls and internal plaster', 'Conduits and plumbing sleeves'],
        image: '/renders/build-frame.webp',
    },
    {
        id: 'floor', anchor: 'floor-addition', discipline: 'Build', name: 'Extra floor addition', from: '₹2,100', unit: '/ sq ft',
        detail: 'A new storey on an existing house, after a structural check of the columns and footings below.',
        scope: ['Load check of existing structure', 'Column extension and new slab', 'Staircase and services tie-in', 'Finishes matched to the floor below'],
        image: '/renders/build-walls.webp',
    },
    {
        id: 'renovation', anchor: 'renovation', discipline: 'Build', name: 'Renovation & remodelling', from: '₹950', unit: '/ sq ft',
        detail: 'Old flats and builder floors stripped back and rebuilt: new layout, wiring, plumbing and finishes.',
        scope: ['Demolition and debris removal', 'Re-wiring and re-plumbing', 'New flooring and bathrooms', 'False ceiling and paint'],
        image: u('photo-1620626011761-996317b8d101'),
    },
    {
        id: 'kitchen', anchor: 'kitchens', discipline: 'Interiors', name: 'Modular kitchens', from: '₹1,500', unit: '/ sq ft',
        detail: 'Factory-made in Indirapuram. Typical L-shaped kitchen for a 2BHK: ₹2.5–4.5 lakh including hardware.',
        scope: ['HDHMR or BWP ply carcass', 'Laminate, acrylic or PU shutters', 'Hettich / Hafele soft-close', 'Quartz or granite counter'],
        image: u('photo-1556911223-e455d62aa05c'),
    },
    {
        id: 'wardrobe', anchor: 'wardrobes', discipline: 'Interiors', name: 'Wardrobes', from: '₹1,200', unit: '/ sq ft',
        detail: 'Laminate from ₹1,200, acrylic from ₹2,000 and sliding systems from ₹2,600 per sq ft of shutter.',
        scope: ['Loft and full-height units', 'Sliding or hinged doors', 'Drawers, lockers, trouser racks', 'Internal LED on request'],
        image: u('photo-1595526114101-118b6256f1dc'),
    },
    {
        id: 'interiors', anchor: 'interiors', discipline: 'Interiors', name: 'Full-home interiors', from: '₹6.5 lakh', unit: '/ 2BHK',
        detail: 'Kitchen, wardrobes, TV unit, false ceiling, lighting and paint. 3BHK from ₹9.5 lakh.',
        scope: ['3D design of every room', 'All carpentry made in our factory', 'Ceiling, lighting, paint', 'One site manager, 45–75 days'],
        image: u('photo-1600210492486-724fe5c67fb0'),
    },
    {
        id: 'ceiling', anchor: 'ceilings', discipline: 'Interiors', name: 'False ceilings', from: '₹85', unit: '/ sq ft',
        detail: 'POP from ₹85 and Saint-Gobain gypsum from ₹110 per sq ft. Cove and profile lighting extra.',
        scope: ['POP or gypsum board', 'Cove and recessed lighting', 'Acoustic panels for offices', 'Moisture-resistant boards for baths'],
        image: u('photo-1513694203232-719a280e022f'),
    },
    {
        id: 'office', anchor: 'office', discipline: 'Interiors', name: 'Office interiors', from: '₹1,450', unit: '/ sq ft',
        detail: 'Workstations, cabins, glass partitions and meeting rooms, delivered around your working hours.',
        scope: ['Space planning', 'Glass and gypsum partitions', 'Workstations and storage', 'Data, power and HVAC coordination'],
        image: u('photo-1497215728101-856f4ea42174'),
    },
];

// ── Interiors rate card ──────────────────────────────────────────────────

export const INTERIOR_RATES: { group: string; rows: { item: string; spec: string; price: string }[] }[] = [
    {
        group: 'Kitchen',
        rows: [
            { item: 'Laminate kitchen', spec: 'HDHMR carcass, laminate shutters', price: '₹1,500–1,900 / sq ft' },
            { item: 'Acrylic kitchen', spec: 'BWP ply, acrylic gloss, Hettich', price: '₹2,000–2,600 / sq ft' },
            { item: 'PU / glass kitchen', spec: 'BWP ply, PU lacquer or glass', price: '₹2,600–3,200 / sq ft' },
        ],
    },
    {
        group: 'Wardrobes',
        rows: [
            { item: 'Hinged, laminate', spec: 'HDHMR, laminate, soft-close', price: '₹1,200–1,500 / sq ft' },
            { item: 'Hinged, acrylic', spec: 'BWP ply, acrylic shutters', price: '₹2,000–2,800 / sq ft' },
            { item: 'Sliding system', spec: 'Profile frame, mirror / glass', price: '₹2,600–3,500 / sq ft' },
        ],
    },
    {
        group: 'Ceilings & walls',
        rows: [
            { item: 'POP false ceiling', spec: 'Plain with cove', price: '₹85–110 / sq ft' },
            { item: 'Gypsum false ceiling', spec: 'Saint-Gobain board', price: '₹110–145 / sq ft' },
            { item: 'Interior paint', spec: 'Putty, primer, 2 coats emulsion', price: '₹18–28 / sq ft' },
            { item: 'Texture / accent wall', spec: 'Royale Play or lime wash', price: '₹45–80 / sq ft' },
        ],
    },
    {
        group: 'Full home',
        rows: [
            { item: '2BHK package', spec: 'Kitchen, 2 wardrobes, TV unit, ceiling, paint', price: '₹6.5–14 lakh' },
            { item: '3BHK package', spec: 'Kitchen, 3 wardrobes, TV unit, ceiling, paint', price: '₹9.5–22 lakh' },
            { item: '4BHK / villa', spec: 'Room-by-room design and build', price: 'from ₹18 lakh' },
        ],
    },
];

/** Interiors estimator inputs. Rates per sq ft of carpet area. */
export const INTERIOR_TIERS = [
    { id: 'basic', name: 'Essential', rate: [1100, 1400] as const, note: 'Laminate kitchen and wardrobes, POP ceiling, emulsion paint' },
    { id: 'standard', name: 'Signature', rate: [1500, 1950] as const, note: 'Acrylic kitchen, Hettich hardware, gypsum ceiling, accent walls', popular: true },
    { id: 'premium', name: 'Bespoke', rate: [2200, 2900] as const, note: 'PU / glass finishes, quartz, designer lighting, loose furniture' },
];

export const HOME_SIZES = [
    { id: '1bhk', label: '1BHK', area: 550 },
    { id: '2bhk', label: '2BHK', area: 900 },
    { id: '3bhk', label: '3BHK', area: 1350 },
    { id: '4bhk', label: '4BHK', area: 1900 },
];

export function formatINR(n: number) {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, '')} lakh`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
}
