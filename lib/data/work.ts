// Selected work and the material library shown on the home page.
// Photos are hotlinked from Unsplash (as elsewhere on the site); renders are
// AMS 3D visualisations from /public/renders and are labelled as such.

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

export interface Project {
    id: string;
    title: string;
    category: string;
    place: string;
    year: string;
    image: string;
    /** True for 3D visualisations, which are captioned as renders. */
    render?: boolean;
    span: 'large' | 'small';
}

export const PROJECTS: Project[] = [
    { id: 'p1', title: 'Island kitchen in walnut & brass', category: 'Kitchen', place: 'Delhi', year: '2025', image: u('photo-1556911223-e455d62aa05c'), span: 'large' },
    { id: 'p2', title: 'Master suite with fitted wardrobe', category: 'Bedroom', place: 'Noida', year: '2025', image: u('photo-1505693314120-0d443867891c', 1200), span: 'small' },
    { id: 'p3', title: 'Wenge & Nero Marquina kitchen', category: '3D visualisation', place: 'AMS Studio', year: '2026', image: '/renders/cy-wenge-evening-island.webp', render: true, span: 'small' },
    { id: 'p4', title: 'Living room with timber media wall', category: 'Living', place: 'Ghaziabad', year: '2024', image: u('photo-1583847268964-b28dc8f51f92'), span: 'large' },
    { id: 'p5', title: 'Ivory kitchen with Calacatta quartz', category: '3D visualisation', place: 'AMS Studio', year: '2026', image: '/renders/cy-ivory-island.webp', render: true, span: 'large' },
    { id: 'p6', title: 'Bedroom with cove-lit ceiling', category: 'Bedroom', place: 'Delhi', year: '2024', image: u('photo-1600210492486-724fe5c67fb0', 1200), span: 'small' },
];

export interface Material {
    id: string;
    name: string;
    finish: string;
    origin: string;
    use: string;
    texture: 'travertine' | 'calacatta' | 'nero' | 'oak' | 'terrazzo' | 'linen' | 'brushed' | 'plaster';
    color: string;
    roughness: number;
    metalness: number;
    clearcoat: number;
}

export const MATERIALS: Material[] = [
    { id: 'travertine', name: 'Roman Travertine', finish: 'Honed, unfilled', origin: 'Tivoli, Italy', use: 'Feature walls, vanity tops, plinths', texture: 'travertine', color: '#ffffff', roughness: 0.85, metalness: 0, clearcoat: 0 },
    { id: 'calacatta', name: 'Calacatta Quartz', finish: 'Polished', origin: 'Engineered stone', use: 'Kitchen counters and waterfall islands', texture: 'calacatta', color: '#ffffff', roughness: 0.18, metalness: 0, clearcoat: 0.7 },
    { id: 'nero', name: 'Nero Marquina', finish: 'Polished', origin: 'Basque Country, Spain', use: 'Statement islands, TV consoles', texture: 'nero', color: '#ffffff', roughness: 0.14, metalness: 0, clearcoat: 0.8 },
    { id: 'oak', name: 'European Oak', finish: 'Matt lacquer veneer', origin: 'FSC-certified', use: 'Wardrobes, panelling, shutters', texture: 'oak', color: '#ffffff', roughness: 0.55, metalness: 0, clearcoat: 0.1 },
    { id: 'walnut', name: 'American Walnut', finish: 'Oiled veneer', origin: 'FSC-certified', use: 'Media walls, bedside joinery', texture: 'oak', color: '#7a5940', roughness: 0.5, metalness: 0, clearcoat: 0.15 },
    { id: 'terrazzo', name: 'Terrazzo', finish: 'Honed', origin: 'Cast in India', use: 'Floors, bathrooms, tabletops', texture: 'terrazzo', color: '#ffffff', roughness: 0.35, metalness: 0, clearcoat: 0.3 },
    { id: 'brass', name: 'Brushed Brass', finish: 'PVD coated', origin: 'Hardware & trims', use: 'Handles, profiles, lighting', texture: 'brushed', color: '#c9a46a', roughness: 0.32, metalness: 1, clearcoat: 0 },
    { id: 'linen', name: 'Belgian Linen', finish: 'Stonewashed', origin: 'Flanders', use: 'Upholstery, drapery, headboards', texture: 'linen', color: '#ffffff', roughness: 0.9, metalness: 0, clearcoat: 0 },
];
