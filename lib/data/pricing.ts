// AMS Interiors rate card. Every rate below is the price AMS lists on IndiaMart
// under Anil Multi Service (72-A Main Road Jagat Puri, Shahdara):
//     indiamart.com/flavour-fottage · anilmultiservice.co.in
// Listing names are kept in `listing` so each figure can be traced back.
// IndiaMart rates are per sq ft and exclude GST. If a listing changes, change it here:
// every section of the site reads from this file.

export const SELLERS = {
    ams: 'Anil Multi Service',
    aems: 'Anil Multi Service',
} as const;
export type Seller = keyof typeof SELLERS;

export const RATE_NOTE = 'Rates as listed by AMS on IndiaMart (Anil Multi Service), per sq ft, excluding GST. Final price after a free site visit.';

// ── Construction ─────────────────────────────────────────────────────────

export type BuildTier = 'essential' | 'standard' | 'premium';

export interface BuildPackage {
    id: BuildTier;
    name: string;
    rate: number; // ₹ per sq ft
    listing: string;
    seller: Seller;
    summary: string;
    popular?: boolean;
}

export const BUILD_PACKAGES: BuildPackage[] = [
    { id: 'essential', name: 'Essential', rate: 1100, listing: 'New Home Building and Renovation', seller: 'ams', summary: 'A sound, plain-finished home or a full rebuild of an old one.' },
    { id: 'standard', name: 'Standard', rate: 1200, listing: 'House Construction Service', seller: 'aems', summary: 'Our usual house build, from footings to paint.', popular: true },
    { id: 'premium', name: 'Premium', rate: 1500, listing: 'Residential Construction Projects', seller: 'aems', summary: 'Larger homes and builder floors with better finishes.' },
];

/** What each package specifies, row by row. Brands are confirmed in the written quote. */
export const BUILD_SPECS: { item: string; essential: string; standard: string; premium: string }[] = [
    { item: 'Structure', essential: 'RCC frame, M20 concrete', standard: 'RCC frame, M20 concrete', premium: 'RCC frame, M25 concrete' },
    { item: 'Steel', essential: 'ISI Fe-500 TMT', standard: 'ISI Fe-500D TMT', premium: 'Fe-550D TMT' },
    { item: 'Cement', essential: 'OPC 43', standard: 'OPC 53', premium: 'OPC 53' },
    { item: 'Walls', essential: '9" brick outer, 4.5" inside', standard: '9" brick outer, 4.5" inside', premium: 'Brick or AAC block' },
    { item: 'Flooring', essential: 'Vitrified 600×600 mm', standard: 'Vitrified 600×1200 mm', premium: 'Vitrified 800×1600 mm' },
    { item: 'Kitchen', essential: 'Granite platform, steel sink', standard: 'Granite platform, base units', premium: 'AMS modular kitchen' },
    { item: 'Bathrooms', essential: 'ISI fittings', standard: 'Hindware / Cera', premium: 'Jaquar fittings' },
    { item: 'Electrical', essential: 'ISI wire, modular switches', standard: 'Havells / Anchor', premium: 'Legrand switches' },
    { item: 'Doors & windows', essential: 'Flush doors, aluminium windows', standard: 'Flush doors, UPVC windows', premium: 'Teak frames, UPVC windows' },
    { item: 'Paint', essential: 'Putty, primer, emulsion', standard: 'Asian Paints Apcolite', premium: 'Asian Paints Royale' },
    { item: 'Waterproofing', essential: 'Roof and wet areas', standard: 'Roof and wet areas', premium: 'Roof, wet areas, terrace' },
];

/** Other civil work listed on IndiaMart. */
export const CIVIL_RATES = [
    { item: 'Residential home renovation', rate: 1000, seller: 'aems' as Seller },
    { item: 'Bathroom renovation (flat rate)', price: '₹95,000', seller: 'ams' as Seller },
    { item: 'Aluminium office partition', rate: 220, seller: 'aems' as Seller },
];

/** Delhi plots are sold in square yards; 1 sq yd = 9 sq ft. */
export const SQYD_TO_SQFT = 9;
/** Built-up per floor as a share of plot area (typical ground coverage for Delhi builder floors). */
export const DEFAULT_COVERAGE = 0.75;

/** Rough programme in months for a house of `floors` storeys. */
export function buildMonths(floors: number) {
    return Math.round(3 + floors * 2);
}

// ── Kitchens ─────────────────────────────────────────────────────────────

export interface KitchenType { id: string; name: string; rate: number; seller: Seller; spec: string }

export const KITCHEN_TYPES: KitchenType[] = [
    { id: 'l-shape', name: 'L-shaped modular kitchen', rate: 1000, seller: 'aems', spec: 'Laminate finish, the budget layout' },
    { id: 'hdhmr-l', name: 'HDHMR L-shape kitchen', rate: 1200, seller: 'ams', spec: 'HDHMR carcass, termite and moisture resistant' },
    { id: 'designer', name: 'Designer modern kitchen', rate: 1200, seller: 'ams', spec: 'Handle-less profile, matte shutters' },
    { id: 'parallel', name: 'Parallel modular kitchen', rate: 1300, seller: 'ams', spec: 'Two facing runs for narrow kitchens' },
    { id: 'wooden', name: 'Wooden modular kitchen', rate: 1300, seller: 'aems', spec: 'Wood-grain shutters' },
    { id: 'acrylic-gloss', name: 'Acrylic high-gloss kitchen', rate: 1400, seller: 'ams', spec: 'Acrylic on HDHMR, 10-year warranty, 15–20 days', },
    { id: 'acrylic-wood', name: 'Acrylic wooden kitchen', rate: 1450, seller: 'ams', spec: 'Acrylic with wood-grain accents' },
    { id: 'acrylic', name: 'Acrylic modular kitchen', rate: 1500, seller: 'ams', spec: 'Full acrylic shutters' },
    { id: 'alu-profile', name: 'Aluminium profile kitchen', rate: 1500, seller: 'aems', spec: 'Aluminium frame shutters with glass' },
    { id: 'termite', name: 'Termite-proof modular kitchen', rate: 1600, seller: 'ams', spec: 'Treated board, sealed edges' },
    { id: 'alu-hdhmr', name: 'Aluminium HDHMR kitchen', rate: 1700, seller: 'ams', spec: 'Aluminium carcass with HDHMR shutters' },
];

/** IndiaMart minimum order for kitchens. */
export const KITCHEN_MIN_SQFT = 100;
export const KITCHEN_SIZES = [100, 120, 150, 200];

// ── Full-home interiors ──────────────────────────────────────────────────

export interface HomeSize { id: string; label: string; area: number; rate: [number, number]; seller: Seller; listing: string }

export const HOME_SIZES: HomeSize[] = [
    { id: '1bhk', label: '1BHK', area: 550, rate: [1500, 1500], seller: 'ams', listing: '1 BHK Flat Interior Design' },
    { id: '2bhk', label: '2BHK', area: 900, rate: [1100, 1100], seller: 'ams', listing: '2 BHK Interior Design' },
    { id: '3bhk', label: '3BHK', area: 1350, rate: [800, 1000], seller: 'ams', listing: '3 BHK Interior' },
    { id: '4bhk', label: '4BHK', area: 1900, rate: [1500, 1500], seller: 'aems', listing: '4 BHK Flat Interior Designing (wood work and furniture)' },
];

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
        id: 'construction', anchor: 'construction', discipline: 'Build', name: 'House construction', from: '₹1,100', unit: '/ sq ft',
        detail: 'Listed at ₹1,100 (new home building), ₹1,200 (house construction) and ₹1,500 (residential projects) per sq ft.',
        scope: ['Structural drawings and site marking', 'RCC frame, brickwork, plaster', 'Plumbing, electrical, waterproofing', 'Flooring, doors, windows, paint'],
        image: '/renders/build-house.webp',
    },
    {
        id: 'renovation', anchor: 'renovation', discipline: 'Build', name: 'Home renovation', from: '₹1,000', unit: '/ sq ft',
        detail: 'Old flats and houses stripped back and rebuilt. Bathroom renovation at a flat ₹95,000.',
        scope: ['Demolition and debris removal', 'Re-wiring and re-plumbing', 'New flooring and bathrooms', 'False ceiling and paint'],
        image: '/renders/build-walls.webp',
    },
    {
        id: 'kitchen', anchor: 'kitchens', discipline: 'Interiors', name: 'Modular kitchens', from: '₹1,000', unit: '/ sq ft',
        detail: 'Eleven kitchen types from ₹1,000 to ₹1,700 per sq ft. Acrylic high-gloss on HDHMR is ₹1,400 with a 10-year warranty.',
        scope: ['HDHMR or aluminium carcass', 'Laminate, acrylic or wood-grain shutters', 'Soft-close hinges and channels', 'Granite or quartz counter'],
        image: '/renders/cy-wenge-evening-island.webp',
    },
    {
        id: 'wardrobe', anchor: 'wardrobes', discipline: 'Interiors', name: 'Wardrobes', from: '₹1,100', unit: '/ sq ft',
        detail: 'Wooden three-door wardrobes from ₹1,100 per sq ft, with acrylic high-gloss and termite-proof options.',
        scope: ['Loft and full-height units', 'Sliding or hinged doors', 'Drawers, lockers, mirror', 'Internal LED on request'],
        image: u('photo-1595526114101-118b6256f1dc'),
    },
    {
        id: 'interiors', anchor: 'interiors', discipline: 'Interiors', name: 'Full-home interiors', from: '₹800', unit: '/ sq ft',
        detail: '1BHK ₹1,500, 2BHK ₹1,100, 3BHK ₹800–1,000 and 4BHK ₹1,500 per sq ft, with ceiling, kitchen, wardrobes and 3D design.',
        scope: ['3D design of every room', 'False ceiling and civil changes', 'Modular kitchen and wardrobes', 'Flooring, lighting, paint'],
        image: u('photo-1600210492486-724fe5c67fb0'),
    },
    {
        id: 'ceiling', anchor: 'ceilings', discipline: 'Interiors', name: 'False ceilings', from: '₹70', unit: '/ sq ft',
        detail: 'T-grid office ceilings at ₹70 per sq ft with material and fixing. Gypsum and POP ceilings are part of our room packages.',
        scope: ['T-grid, gypsum or POP', 'Cove and recessed lighting', 'Acoustic tiles for offices', 'Moisture-resistant board for baths'],
        image: u('photo-1513694203232-719a280e022f'),
    },
    {
        id: 'office', anchor: 'office', discipline: 'Interiors', name: 'Office interiors', from: '₹1,000', unit: '/ sq ft',
        detail: 'Workstations, cabins and meeting rooms. Aluminium partitions at ₹220 per sq ft.',
        scope: ['Space planning', 'Aluminium and glass partitions', 'Workstations and storage', 'Ceiling, data and power'],
        image: u('photo-1497215728101-856f4ea42174'),
    },
];

// ── Interiors rate card ──────────────────────────────────────────────────

export interface RateRow { item: string; spec: string; price: string; seller: Seller }

export const INTERIOR_RATES: { group: string; rows: RateRow[] }[] = [
    {
        group: 'Modular kitchens',
        rows: KITCHEN_TYPES.map((k) => ({ item: k.name, spec: k.spec, price: `₹${k.rate.toLocaleString('en-IN')} / sq ft`, seller: k.seller })),
    },
    {
        group: 'Wardrobes & ceilings',
        rows: [
            { item: 'Wooden 3-door wardrobe', spec: 'With or without mirror', price: '₹1,100 / sq ft', seller: 'aems' },
            { item: 'Office false ceiling', spec: 'T-grid, material and fixing', price: '₹70 / sq ft', seller: 'aems' },
            { item: 'Aluminium office partition', spec: 'Glass panels', price: '₹220 / sq ft', seller: 'aems' },
        ],
    },
    {
        group: 'Full home',
        rows: [
            { item: '1BHK flat', spec: 'Ceiling, civil changes, kitchen, wardrobes, 3D design, flooring', price: '₹1,500 / sq ft', seller: 'ams' },
            { item: '2BHK flat', spec: 'Complete interior', price: '₹1,100 / sq ft', seller: 'ams' },
            { item: '3BHK flat', spec: 'Complete interior', price: '₹800–1,000 / sq ft', seller: 'ams' },
            { item: '4BHK flat', spec: 'Wood work and furniture', price: '₹1,500 / sq ft', seller: 'aems' },
            { item: 'Row house', spec: 'Complete interior', price: '₹1,200 / sq ft', seller: 'ams' },
            { item: 'Interior design service', spec: 'Design and supervision', price: '₹1,000 / sq ft', seller: 'ams' },
        ],
    },
];

export function formatINR(n: number) {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, '')} lakh`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
}
