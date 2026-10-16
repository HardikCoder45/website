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
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Atelier", href: "#atelier" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
];

export const SITE_URL = "https://amsinteriors.in";
export const FOUNDED_YEAR = 2014;

// Headline numbers shown in the hero and the "Why AMS" grid. Keep these in
// sync with TRUST_BADGES so the site never contradicts itself.
export const STATS = [
    { value: 10, suffix: "Y", label: "Warranty" },
    { value: 1000, suffix: "+", label: "Families Served" },
    { value: 4.7, suffix: "★", label: "IndiaMart Rating", decimals: 1 },
    { value: new Date().getFullYear() - FOUNDED_YEAR, suffix: "+", label: "Years in NCR" },
];

export const PROCESS_STEPS = [
    {
        step: "01",
        title: "Free Site Visit",
        duration: "Day 1",
        description: "A senior designer visits your home, takes laser measurements and understands how your family actually lives.",
    },
    {
        step: "02",
        title: "3D Design & Quote",
        duration: "Day 3–7",
        description: "Photo-real 3D renders of every room with a line-item quote. Revise until it feels exactly right — no charge.",
    },
    {
        step: "03",
        title: "Factory Production",
        duration: "Day 8–20",
        description: "Panels are CNC-cut and edge-banded at our Indirapuram factory, so finishes are precise and site dust is minimal.",
    },
    {
        step: "04",
        title: "Installation",
        duration: "Day 21–30",
        description: "Our in-house crew installs, aligns and tests every hinge and channel. A dedicated site manager reports to you daily.",
    },
    {
        step: "05",
        title: "Handover & Warranty",
        duration: "Move in",
        description: "Deep-cleaned, snag-free handover with a written warranty of up to 10 years and lifetime service support.",
    },
];

export const WHY_US = [
    {
        title: "Own factory, no middlemen",
        description: "Manufactured in-house at Indirapuram, so you pay factory prices and get factory precision.",
        icon: "factory",
    },
    {
        title: "Free 3D design",
        description: "See your exact kitchen or bedroom in 3D before a single panel is cut.",
        icon: "cube",
    },
    {
        title: "Up to 10-year warranty",
        description: "Written warranty on carcass and hardware, backed by Godrej and Hettich fittings.",
        icon: "shield",
    },
    {
        title: "Transparent pricing",
        description: "Line-item quotes with no hidden charges. GST-verified invoices for every rupee.",
        icon: "receipt",
    },
    {
        title: "On-time delivery",
        description: "Most modular kitchens are installed in 15–25 days from design sign-off.",
        icon: "clock",
    },
];

export const FAQS = [
    {
        q: "How much does a modular kitchen cost in Delhi?",
        a: "Our modular kitchens start at around ₹1,000 per sq.ft for an HDHMR + laminate finish and go up to ₹2,500 per sq.ft for lacquered glass with Hettich hardware. A typical 10×8 ft L-shaped kitchen lands between ₹1.2 and ₹2 lakh. Use the estimate calculator above for a quick range, then book a free visit for an exact quote.",
    },
    {
        q: "Is the site visit really free?",
        a: "Yes. A designer visits anywhere in Delhi NCR, measures your space and discusses layouts at no cost and with no obligation to book.",
    },
    {
        q: "How long does a project take?",
        a: "Modular kitchens and wardrobes usually take 15–25 days from design approval. Full-home interiors take 30–90 days depending on the scope of civil, electrical and false-ceiling work.",
    },
    {
        q: "What warranty do you give?",
        a: "Up to 10 years on the carcass and modular hardware depending on the material package, plus lifetime service support. All warranties are given in writing at handover.",
    },
    {
        q: "Which areas do you serve?",
        a: "All of Delhi NCR — East Delhi, Shahdara, Noida, Greater Noida, Ghaziabad, Indirapuram, Gurugram and Faridabad. Our studio is in Jagat Puri and our factory is in Indirapuram.",
    },
    {
        q: "Can I see the design before production starts?",
        a: "Absolutely. Every project gets a 3D design you can review and revise. You can also explore our interactive 3D kitchen, wardrobe and interior walkthroughs on this site.",
    },
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
