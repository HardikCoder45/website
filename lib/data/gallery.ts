export type GalleryCategory =
    | "All"
    | "3D Renders"
    | "Kitchen"
    | "Bedroom"
    | "Living Room"
    | "Office"
    | "Washroom"
    | "False Ceiling"
    | "Renovation";

export interface GalleryPhoto {
    id: string;
    src: string;
    alt: string;
    category: GalleryCategory;
    scope: string;
    location: string;
    materials: string;
    year: string;
    story: string; // New field for project narrative
    tall?: boolean;
}

export const galleryPhotos: GalleryPhoto[] = [
    {
        id: "r1",
        src: "/renders/kitchen-wenge.webp",
        alt: "Wenge island kitchen with emerald zellige",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Wenge veneer, Nero Marquina, champagne gold",
        year: "2026",
        tall: true,
        story: "An island layout with a breakfast bar for three, LED-lit open shelving and a full-height emerald backsplash."
    },
    {
        id: "r2",
        src: "/renders/kitchen-evening.webp",
        alt: "The same kitchen at night",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Wenge veneer, under-cabinet LED, pendant lights",
        year: "2026",
        story: "Evening mode: under-cabinet strips, a floating island kick and warm pendants turn the kitchen into a lounge."
    },
    {
        id: "r3",
        src: "/renders/kitchen-ivory-island.webp",
        alt: "Ivory matte kitchen with Calacatta quartz",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Ivory matte, Calacatta quartz, polished chrome",
        year: "2026",
        story: "The identical layout re-specified in ivory and Calacatta — proof of how much finishes change a room."
    },
    {
        id: "r4",
        src: "/renders/kitchen-navy.webp",
        alt: "Navy lacquer kitchen detail",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Navy lacquer, Calacatta quartz, champagne gold",
        year: "2026",
        tall: true,
        story: "A navy lacquer run with profile handles and LED strips under every wall cabinet."
    },
    {
        id: "r5",
        src: "/renders/kitchen-walnut-pantry.webp",
        alt: "Walnut kitchen with terracotta backsplash",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Natural walnut, terracotta tile, matte black",
        year: "2026",
        story: "Warm walnut with a terracotta splash and matte black hardware, viewed towards the tall pantry."
    },
    {
        id: "r6",
        src: "/renders/living-walnut.webp",
        alt: "Living room with fluted walnut wall",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Walnut fluted panel, honey oak floor, velvet sofa",
        year: "2026",
        tall: true,
        story: "Fluted walnut feature wall, floating console, cove-lit false ceiling and a curved velvet sofa."
    },
    {
        id: "r7",
        src: "/renders/living-evening.webp",
        alt: "Living room at night with amber cove light",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Walnut panel, amber cove LED, leather sofa",
        year: "2026",
        story: "Amber cove lighting and a tufted leather sofa make the same room feel like a private lounge."
    },
    {
        id: "r8",
        src: "/renders/living-travertine.webp",
        alt: "Clay-toned living room with travertine wall",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Travertine panel, Italian marble floor, clay walls",
        year: "2026",
        story: "A softer palette — desert clay walls, travertine feature wall and Italian marble underfoot."
    },
    {
        id: "r9",
        src: "/renders/wardrobe-open.webp",
        alt: "Four-door wardrobe, doors open",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Smoked oak, bronze mirror, brushed gold",
        year: "2026",
        tall: true,
        story: "Long hanging, shelving, a drawer bank and lofts — every bay planned around how you dress."
    },
    {
        id: "r10",
        src: "/renders/wardrobe-evening.webp",
        alt: "Espresso wardrobe interior with LED",
        category: "3D Renders",
        scope: "3D design render",
        location: "AMS Design Studio",
        materials: "Espresso gloss, internal LED, chrome rails",
        year: "2026",
        story: "Internal LED strips switch on with the doors, so every shelf is lit at night."
    },
    {
        id: "g1",
        src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
        alt: "L-shaped acrylic gloss kitchen",
        category: "Kitchen",
        scope: "3BHK",
        location: "Delhi",
        materials: "Acrylic, HDHMR",
        year: "2025",
        tall: true,
        story: "A masterclass in modern ergonomics. This kitchen was designed for a family that loves to host, featuring a dual-sink setup and high-gloss acrylic that reflects natural light beautifully."
    },
    {
        id: "g2",
        src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
        alt: "U-shaped HDHMR kitchen in white",
        category: "Kitchen",
        scope: "Row House",
        location: "Noida",
        materials: "HDHMR, Granite",
        year: "2025",
        story: "Maximizing every inch in a compact row house. The U-shaped layout provides a seamless 'Golden Triangle' workflow for the chef of the house."
    },
    {
        id: "g3",
        src: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1200&auto=format&fit=crop",
        alt: "Parallel modular kitchen grey",
        category: "Kitchen",
        scope: "2BHK",
        location: "Delhi",
        materials: "HDHMR, Quartz",
        year: "2025",
        tall: true,
        story: "Industrial chic meets modular convenience. The charcoal grey palette paired with white quartz creates a sophisticated, timeless look."
    },
    {
        id: "g4",
        src: "https://images.unsplash.com/photo-1556911223-e455d62aa05c?q=80&w=1200&auto=format&fit=crop",
        alt: "Island kitchen with brass fixtures",
        category: "Kitchen",
        scope: "Villa",
        location: "Gurgaon",
        materials: "Lacquered glass, HDHMR",
        year: "2025",
        story: "The centerpiece of a luxury villa. This island kitchen features lacquered glass shutters and premium brass fixtures for an elite, high-end feel."
    },
    {
        id: "g7",
        src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800&auto=format&fit=crop",
        alt: "Master bedroom with sliding wardrobe",
        category: "Bedroom",
        scope: "3BHK",
        location: "Delhi",
        materials: "HDHMR, Mirror",
        year: "2025",
        story: "Space-saving luxury. We integrated a full-height mirror sliding wardrobe to make the master suite feel twice as large while providing ample storage."
    },
    {
        id: "g11",
        src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
        alt: "Living room with wooden TV panel",
        category: "Living Room",
        scope: "3BHK",
        location: "Delhi",
        materials: "MDF, Veneer, Glass",
        year: "2025",
        tall: true,
        story: "A warm, inviting sanctuary. The fluted wooden TV panel serves as a focal point, complemented by soft ambient lighting for the perfect movie night."
    },
    {
        id: "g14",
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        alt: "Open plan tech office interior",
        category: "Office",
        scope: "2500 sqft",
        location: "Noida",
        materials: "Glass, MDF, Gypsum",
        year: "2025",
        tall: true,
        story: "Productivity defined. This open-plan office uses glass partitions and vibrant color accents to foster collaboration and creativity."
    },
    {
        id: "g17",
        src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
        alt: "Modern bathroom renovation tiles",
        category: "Washroom",
        scope: "Master Bath",
        location: "Delhi",
        materials: "Tiles, Glass, Fixtures",
        year: "2025",
        tall: true,
        story: "Hotel-style luxury at home. A complete overhaul with floating vanities, rain showers, and premium marble-finish vitrified tiles."
    },
    {
        id: "g23",
        src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop",
        alt: "Full home renovation old to new",
        category: "Renovation",
        scope: "3BHK Full Home",
        location: "Delhi",
        materials: "Full Interior Package",
        year: "2025",
        tall: true,
        story: "A 20-year-old apartment reborn. This full-home renovation involved structural changes to create an open-plan layout that breathes."
    },
];

export const galleryCategories: GalleryCategory[] = [
    "All",
    "3D Renders",
    "Kitchen",
    "Bedroom",
    "Living Room",
    "Office",
    "Washroom",
    "False Ceiling",
    "Renovation",
];
