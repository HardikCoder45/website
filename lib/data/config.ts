export type PackageKey = "basic" | "standard" | "premium";

export interface PackageRate {
    min: number;
    max: number;
    label: string;
    description: string;
    materials: string[];
    popular?: boolean;
}

export const PACKAGE_RATES: Record<PackageKey, PackageRate> = {
    basic: {
        min: 900,
        max: 1100,
        label: "Basic",
        description: "Essential modular setup with quality materials",
        materials: ["HDHMR carcass", "High-gloss laminate shutters", "Standard handles", "Basic granite countertop"],
    },
    standard: {
        min: 1200,
        max: 1600,
        label: "Standard",
        description: "Popular choice — acrylic + Godrej hardware",
        materials: ["HDHMR carcass", "Acrylic / matte shutters", "Godrej soft-close hinges", "Quartz countertop"],
        popular: true,
    },
    premium: {
        min: 1800,
        max: 2500,
        label: "Premium",
        description: "Luxury finish with lacquered glass & Hettich",
        materials: ["BWP plywood carcass", "Lacquered glass shutters", "Hettich premium hardware", "Natural stone countertop"],
    },
};

export const TRUST_BADGES = [
    { icon: "verified", label: "GST Verified", sub: "07BWGPA2702L1ZT" },
    { icon: "trade", label: "TradeIndia Listed", sub: "Verified Supplier" },
    { icon: "star", label: "4.7★ IndiaMart", sub: "37 Reviews" },
    { icon: "photo", label: "103 Project Photos", sub: "Real client work" },
    { icon: "location", label: "Serving Delhi NCR", sub: "Since 2014" },
];

export const SERVICES_NAV = [
    { label: "Kitchens", href: "#kitchens" },
    { label: "Wardrobes", href: "#wardrobes" },
    { label: "Gallery", href: "#gallery" },
    { label: "Services", href: "#interiors" },
    { label: "Contact", href: "#contact" },
];

export const CONTACT_INFO = {
    address: "72-A, Main Road Jagat Puri, Shahdara, New Delhi – 110051",
    addressShort: "Jagat Puri, Karkarduma, New Delhi",
    phone1: "+917840005522",
    phone1Display: "+91 78400 05522",
    phone2: "+919250005522",
    phone2Display: "+91 92500 05522",
    whatsapp: "https://wa.me/917840005522",
    email: "info@amsinteriors.in",
    hours: "Monday–Saturday, 10am–7pm",
    gstNo: "07BWGPA2702L1ZT",
    mapQuery: "72-A,+Main+Road,+Jagat+Puri,+Shahdara,+New+Delhi",
    factoryAddress: "Royal Tower, Indirapuram, Ghaziabad, Uttar Pradesh",
    factoryMapQuery: "Royal+Tower+Indirapuram+Ghaziabad",
};

export const PRODUCT_CATEGORIES = [
    {
        id: "kitchen",
        name: "Modular Kitchens",
        icon: "🍳",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=2000",
        startingPrice: 1000,
        priceUnit: "/sqft",
        description: "L, U, Parallel, Island shapes with HDHMR, Acrylic & Lacquered Glass finishes",
        tags: ["HDHMR", "Acrylic", "Godrej Hardware", "10-year warranty"],
        badge: "Most Popular",
    },
    {
        id: "wardrobe",
        name: "Wardrobes",
        icon: "🚪",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=2000",
        startingPrice: 1000,
        priceUnit: "/sqft",
        description: "Sliding & modular wardrobes with Hettich channels, mirror integration, and custom internals",
        tags: ["Sliding Doors", "Hettich", "Mirror", "Custom Sizes"],
        badge: null,
    },
    {
        id: "interior",
        name: "Interior Design",
        icon: "🏠",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
        startingPrice: 600,
        priceUnit: "/sqft",
        description: "Full home interiors from concept to completion — 3D design, all trades, single contractor",
        tags: ["Free 3D Design", "30–90 days", "All inclusive"],
        badge: "All-in-one",
    },
    {
        id: "ceiling",
        name: "False Ceilings",
        icon: "✨",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2000",
        startingPrice: 70,
        priceUnit: "/sqft",
        description: "Gypsum, POP, and grid ceilings with LED cove lighting and sound insulation",
        tags: ["Gypsum", "LED Cove", "Sound proof"],
        badge: null,
    },
    {
        id: "renovation",
        name: "Renovation",
        icon: "🔨",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000",
        startingPrice: 1000,
        priceUnit: "/sqft",
        description: "Complete home and bathroom renovations including civil, plumbing, and finishing work",
        tags: ["Bathroom ₹95K", "Full Home", "Civil Work"],
        badge: null,
    },
    {
        id: "office",
        name: "Office Interiors",
        icon: "💼",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
        startingPrice: 1100,
        priceUnit: "/sqft",
        description: "Workstations, cabins, glass partitions, and conference rooms for Delhi NCR offices",
        tags: ["Glass Partitions", "1000+ sqft", "NCR wide"],
        badge: null,
    },
];
