export interface ServiceSpec {
    label: string;
    value: string;
}

export interface ServicePhoto {
    src: string;
    alt: string;
}

export interface Service {
    id: string;
    anchor: string;
    name: string;
    tagline: string;
    description: string;
    priceRange: string;
    priceUnit: string;
    image: string;
    imageAlt: string;
    specs: ServiceSpec[];
    photos: ServicePhoto[];
    hasBeforeAfter: boolean;
    materials: string[];
    tags: string[];
}

export const services: Service[] = [
    {
        id: "modular-kitchens",
        anchor: "kitchens",
        name: "Modular Kitchens",
        tagline: "Where every meal begins with beauty",
        description:
            "From sleek L-shaped acrylic kitchens to sprawling island layouts — we craft modular kitchens built for the Indian home. HDHMR carcass with Godrej soft-close hardware, 10-year warranty, factory-made precision. Over 50 variants across shapes, finishes, and budgets.",
        priceRange: "₹1,000 – ₹1,800",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Modern L-shaped modular kitchen with acrylic gloss finish",
        specs: [
            { label: "Timeline", value: "10–25 days" },
            { label: "Warranty", value: "5–15 years" },
            { label: "Min Order", value: "100 sq.ft" },
            { label: "Materials", value: "HDHMR, Acrylic, BWP Ply" },
            { label: "Hardware", value: "Godrej / Hettich soft-close" },
            { label: "Countertop", value: "Granite / Quartz / Steel" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop", alt: "U-shaped HDHMR kitchen in white" },
            { src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop", alt: "Acrylic gloss L-shape kitchen" },
            { src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop", alt: "Parallel wooden modular kitchen" },
            { src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop", alt: "Island kitchen with brass fittings" },
        ],
        hasBeforeAfter: false,
        materials: ["HDHMR", "Acrylic", "BWP Plywood", "MDF", "PVC", "Lacquered Glass"],
        tags: ["L-Shape", "U-Shape", "Parallel", "Island", "Straight"],
    },
    {
        id: "wardrobes",
        anchor: "wardrobes",
        name: "Wardrobes",
        tagline: "Organised living, beautifully engineered",
        description:
            "Sliding, modular, kids' themed or walk-in — our wardrobes are built with 18mm HDHMR, Hettich telescopic channels, and custom internal accessories. Anti-termite treatment, mirror integration, soft-close doors. Every inch crafted to your bedroom dimensions.",
        priceRange: "₹1,000 – ₹2,500",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1595526114101-118b6256f1dc?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Sliding wardrobe with acrylic high-gloss finish and mirror",
        specs: [
            { label: "Timeline", value: "7–20 days" },
            { label: "Warranty", value: "3–5 years" },
            { label: "Door Types", value: "Sliding / Hinged / Handleless" },
            { label: "Materials", value: "HDHMR, Plywood, MDF" },
            { label: "Hardware", value: "Hettich soft-close channels" },
            { label: "Extras", value: "Mirror, Loft, Internal organisers" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800&auto=format&fit=crop", alt: "White sliding wardrobe 4-door" },
            { src: "https://images.unsplash.com/photo-1595526114101-118b6256f1dc?q=80&w=800&auto=format&fit=crop", alt: "Acrylic gloss wardrobe with mirror" },
            { src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop", alt: "Kids room wardrobe with colour accents" },
        ],
        hasBeforeAfter: false,
        materials: ["HDHMR", "Plywood", "MDF", "Acrylic", "Laminate"],
        tags: ["Sliding", "Modular", "Kids Room", "Walk-in", "Mirrored", "Loft"],
    },
    {
        id: "interior-design",
        anchor: "interiors",
        name: "Interior Design",
        tagline: "Full home transformations, start to finish",
        description:
            "From 1BHK apartments to luxury row houses, our interior design services cover every room — false ceiling, flooring, wardrobes, kitchen, TV unit, lighting design, and paint. Free 3D visualisation, dedicated project manager, and 30–90 day delivery.",
        priceRange: "₹600 – ₹1,500",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
        imageAlt: "3BHK flat interior design with modern living room",
        specs: [
            { label: "Timeline", value: "30–90 days" },
            { label: "Budget Range", value: "₹5–25 lakhs" },
            { label: "3D Design", value: "Free with project" },
            { label: "Scope", value: "Full home / room-wise" },
            { label: "Materials", value: "Plywood, Glass, Laminates" },
            { label: "Brands", value: "Godrej, Hettich, Asian Paints" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop", alt: "Modern living room interior" },
            { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop", alt: "Bedroom with false ceiling and wardrobe" },
            { src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop", alt: "Home office with wooden panelling" },
        ],
        hasBeforeAfter: true,
        materials: ["Plywood", "Glass", "Laminates", "Fabric", "Metal", "MDF"],
        tags: ["1 BHK", "2 BHK", "3 BHK", "Row House", "Office", "Luxury"],
    },
    {
        id: "false-ceilings",
        anchor: "ceilings",
        name: "False Ceilings",
        tagline: "Elevate your space from above",
        description:
            "Gypsum, POP, and grid false ceilings for homes, offices, and commercial spaces. Sound absorption, moisture resistance, fire retardancy, and LED cove lighting integration. Smooth finish or custom textures — we handle concept to installation.",
        priceRange: "₹70 – ₹140",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Modern gypsum false ceiling with LED cove lighting",
        specs: [
            { label: "Timeline", value: "5–15 days" },
            { label: "Min Order", value: "1000 sq.ft" },
            { label: "Materials", value: "Gypsum / POP / Grid" },
            { label: "Thickness", value: "8–15 mm" },
            { label: "Features", value: "Sound proof, moisture resistant" },
            { label: "Lighting", value: "LED cove (extra ₹20–50/sqft)" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1541123437800-141315123d46?q=80&w=800&auto=format&fit=crop", alt: "Office grid false ceiling" },
            { src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop", alt: "Bedroom gypsum ceiling with LED strip" },
            { src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop", alt: "Drawing room pop false ceiling" },
        ],
        hasBeforeAfter: false,
        materials: ["Gypsum", "POP", "Grid Tile", "Mineral Fibre"],
        tags: ["Gypsum", "POP", "Grid", "Cove Lighting", "Office", "Bedroom"],
    },
    {
        id: "renovation",
        anchor: "renovation",
        name: "Renovation & Remodelling",
        tagline: "Breathe new life into existing spaces",
        description:
            "Complete home renovation, bathroom remodelling, office makeovers, and old residence restoration. We handle structural assessments, civil work, plumbing, tiling, waterproofing, and finishing — under one roof. Bathroom renovation starting at ₹95,000 flat.",
        priceRange: "₹1,000 – ₹1,800",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Before and after bathroom renovation with premium tiles",
        specs: [
            { label: "Timeline", value: "25–90 days" },
            { label: "Bathroom", value: "₹95,000 flat rate" },
            { label: "Full Home", value: "₹10–20 lakhs (3BHK)" },
            { label: "Brands", value: "Hindware, Cera, Asian Paints" },
            { label: "Waterproofing", value: "Included in bathroom" },
            { label: "Warranty", value: "1 year civil, 5 yr fittings" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop", alt: "Modern bathroom renovation" },
            { src: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=800&auto=format&fit=crop", alt: "Old flat transformed with new interiors" },
            { src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop", alt: "Office renovation complete makeover" },
        ],
        hasBeforeAfter: true,
        materials: ["Tiles", "Waterproofing membrane", "Plywood", "Glass", "POP"],
        tags: ["Bathroom", "Home", "Office", "Old Residence", "Plumbing"],
    },
    {
        id: "painting",
        anchor: "painting",
        name: "Painting Services",
        tagline: "Colour that transforms every wall",
        description:
            "Asian Paints certified applicators for residential, commercial, and industrial projects. Interior emulsion, exterior weatherproof, textured finishes, and wallpaper installation. Labor and material bundled. Free colour consultation included.",
        priceRange: "₹10 – ₹60",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Professional wall painting with premium emulsion texture",
        specs: [
            { label: "Interior", value: "₹10–18/sqft (emulsion)" },
            { label: "Exterior", value: "₹25–40/sqft (weatherproof)" },
            { label: "Textured", value: "₹35–60/sqft" },
            { label: "Brand", value: "Asian Paints" },
            { label: "Min Area", value: "1000 sq.ft" },
            { label: "Warranty", value: "1 year on paint job" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=800&auto=format&fit=crop", alt: "Smooth interior wall painting" },
            { src: "https://images.unsplash.com/photo-1562664377-709f2c337eb2?q=80&w=800&auto=format&fit=crop", alt: "Textured accent wall" },
            { src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", alt: "Commercial building exterior painting" },
        ],
        hasBeforeAfter: false,
        materials: ["Emulsion", "Enamel", "Texture Paint", "Distemper", "Weathershield"],
        tags: ["Interior", "Exterior", "Textured", "Commercial", "Industrial"],
    },
    {
        id: "office-interiors",
        anchor: "office",
        name: "Office Interiors",
        tagline: "Professional spaces that inspire productivity",
        description:
            "Complete office interior solutions — workstations, cabins, reception, conference rooms, and lounge areas. Glass partitions, modular furniture, LED lighting, and gypsum/grid ceilings. Minimum 1000 sq.ft project. Serving Noida, Ghaziabad, and Delhi NCR.",
        priceRange: "₹1,100 – ₹1,500",
        priceUnit: "per sq.ft",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Modern open-plan office interior with glass partitions",
        specs: [
            { label: "Min Area", value: "1000 sq.ft" },
            { label: "Timeline", value: "30–90 days" },
            { label: "Partitions", value: "Glass / Gypsum / Aluminium" },
            { label: "Furniture", value: "Modular, ergonomic" },
            { label: "Warranty", value: "1 year" },
            { label: "3D Design", value: "Included" },
        ],
        photos: [
            { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop", alt: "Open plan office with workstations" },
            { src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop", alt: "Glass partition conference room" },
            { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop", alt: "Executive cabin with wooden panelling" },
        ],
        hasBeforeAfter: false,
        materials: ["Glass", "MDF", "Gypsum", "Aluminium", "Century Ply", "Laminates"],
        tags: ["Open Plan", "Cabin", "Conference", "Reception", "Gurgaon", "Noida"],
    },
];
