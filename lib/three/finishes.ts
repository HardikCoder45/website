// Finish options shared by the 3D configurators. Each choice describes how to
// restyle the matching materials of a model; `original` keeps the authored look.

export interface FinishChoice {
    id: string;
    label: string;
    swatch: string;
    /** Price per sq.ft added on top of the base package, in ₹. */
    priceDelta: number;
    original?: boolean;
    color?: string;
    roughness?: number;
    metalness?: number;
    /** Keep the authored texture (tinted by `color`) instead of a flat finish. */
    keepMap?: boolean;
}

export interface FinishGroup {
    id: string;
    label: string;
    /** Material names in the model this group restyles. */
    materials: string[];
    choices: FinishChoice[];
}

export const KITCHEN_FINISHES: FinishGroup[] = [
    {
        id: 'cabinets',
        label: 'Cabinet shutters',
        materials: ['Cabinet_Dark_Wood_Wenge', 'Mat_Pantry_Dark', 'Dark_Wood_Panel'],
        choices: [
            { id: 'wenge', label: 'Wenge Veneer', swatch: '#3b2a1e', priceDelta: 250, original: true },
            { id: 'ivory', label: 'Ivory Matte', swatch: '#ece4d2', priceDelta: 0, color: '#e9e1cf', roughness: 0.55, metalness: 0 },
            { id: 'sage', label: 'Sage Acrylic', swatch: '#8b9a7d', priceDelta: 150, color: '#7f8f72', roughness: 0.25, metalness: 0 },
            { id: 'navy', label: 'Navy Lacquer', swatch: '#1f2a44', priceDelta: 350, color: '#1d2740', roughness: 0.12, metalness: 0.05 },
            { id: 'walnut', label: 'Natural Walnut', swatch: '#7a5537', priceDelta: 300, color: '#c49a72', roughness: 0.5, keepMap: true },
        ],
    },
    {
        id: 'countertop',
        label: 'Countertop',
        materials: ['Marble_Countertop_Dark', 'Mat_DarkMarble_Countertop'],
        choices: [
            { id: 'nero', label: 'Nero Marquina', swatch: '#1c1c1e', priceDelta: 200, original: true },
            { id: 'calacatta', label: 'Calacatta Quartz', swatch: '#efebe5', priceDelta: 250, color: '#eeeae3', roughness: 0.18, metalness: 0 },
            { id: 'granite', label: 'Black Galaxy Granite', swatch: '#2a2622', priceDelta: 0, color: '#2b2723', roughness: 0.3, metalness: 0.1 },
            { id: 'concrete', label: 'Concrete Grey', swatch: '#9a958e', priceDelta: 120, color: '#97928b', roughness: 0.75, metalness: 0 },
        ],
    },
    {
        id: 'backsplash',
        label: 'Backsplash',
        materials: ['Emerald_Backsplash_Tile'],
        choices: [
            { id: 'emerald', label: 'Emerald Zellige', swatch: '#1f5a46', priceDelta: 80, original: true },
            { id: 'terracotta', label: 'Terracotta', swatch: '#b5653d', priceDelta: 60, color: '#b8693f', roughness: 0.4, keepMap: true },
            { id: 'subway', label: 'White Subway', swatch: '#f2f0ea', priceDelta: 0, color: '#f4f2ec', roughness: 0.2, keepMap: true },
            { id: 'charcoal', label: 'Charcoal Gloss', swatch: '#2c2c2e', priceDelta: 70, color: '#2d2d30', roughness: 0.15, keepMap: true },
        ],
    },
    {
        id: 'hardware',
        label: 'Handles & hardware',
        materials: ['Brushed_Champagne_Gold'],
        choices: [
            { id: 'champagne', label: 'Champagne Gold', swatch: '#c9a86a', priceDelta: 60, original: true },
            { id: 'black', label: 'Matte Black', swatch: '#1a1a1a', priceDelta: 30, color: '#151515', roughness: 0.6, metalness: 0.4 },
            { id: 'chrome', label: 'Polished Chrome', swatch: '#d6d8db', priceDelta: 40, color: '#e2e4e7', roughness: 0.08, metalness: 1 },
        ],
    },
];

export type FinishSelection = Record<string, string>;

export function defaultSelection(groups: FinishGroup[]): FinishSelection {
    return Object.fromEntries(groups.map((g) => [g.id, g.choices.find((c) => c.original)?.id ?? g.choices[0].id]));
}

export function selectionPriceDelta(groups: FinishGroup[], sel: FinishSelection) {
    return groups.reduce((sum, g) => sum + (g.choices.find((c) => c.id === sel[g.id])?.priceDelta ?? 0), 0);
}

export function describeSelection(groups: FinishGroup[], sel: FinishSelection) {
    return groups.map((g) => `${g.label}: ${g.choices.find((c) => c.id === sel[g.id])?.label ?? '—'}`);
}
