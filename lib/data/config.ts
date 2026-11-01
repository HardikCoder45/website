export const SERVICES_NAV = [
    { label: "Build", href: "#build" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Work", href: "#work" },
    { label: "Visit us", href: "#visit" },
];

// Office coordinates (Jagat Puri, Shahdara) and factory (Indirapuram) for the globe.
export const OFFICE_GEO = { lat: 28.6633, lon: 77.2905 };
export const FACTORY_GEO = { lat: 28.6460, lon: 77.3695 };

export const SITE_URL = "https://amsinteriors.in";
export const FOUNDED_YEAR = 2014;

// Headline numbers shown in the hero and the "Why AMS" grid. Keep these in
// sync with TRUST_BADGES so the site never contradicts itself.
export const STATS = [
    { value: 1000, suffix: "+", label: "Homes delivered" },
    { value: 10, suffix: " yr", label: "Kitchen warranty" },
    { value: 4.7, suffix: "★", label: "IndiaMart rating", decimals: 1 },
    { value: new Date().getFullYear() - FOUNDED_YEAR, suffix: "", label: "Years building in NCR" },
];

export const FAQS = [
    {
        q: "What does it cost to build a house with AMS?",
        a: "House construction is ₹1,200 per sq ft in the Essential package, ₹1,600 in Premium and ₹2,200 in Luxury, on built-up area. A G+1 house on a 100 sq yd plot (about 1,350 sq ft built-up) comes to roughly ₹16 lakh in Essential and ₹21.6 lakh in Premium. The estimate tool gives a figure for your plot.",
    },
    {
        q: "What is included in the per-square-foot rate?",
        a: "Structure, brickwork, plaster, plumbing, electrical wiring, waterproofing, flooring, doors, windows, bathroom fittings and paint, as listed in the specification table. Approval fees, boundary walls, borewells and interiors are quoted separately. Rates exclude GST.",
    },
    {
        q: "How much does a modular kitchen cost?",
        a: "From ₹1,000 per sq ft for an L-shaped laminate kitchen. HDHMR kitchens are ₹1,200–1,300, acrylic high-gloss on HDHMR is ₹1,400 with a 10-year warranty, and aluminium HDHMR kitchens are ₹1,700. The minimum order is 100 sq ft and delivery takes 15–20 days.",
    },
    {
        q: "What do full-home interiors cost?",
        a: "1BHK ₹1,500 per sq ft, 2BHK ₹1,100, 3BHK ₹800–1,000 and 4BHK ₹1,500. That covers false ceiling, civil changes, modular kitchen, wardrobes, flooring and a 3D design of every room.",
    },
    {
        q: "Do you renovate old houses and bathrooms?",
        a: "Yes. Home renovation is ₹1,000 per sq ft and a complete bathroom renovation is a flat ₹95,000, including waterproofing.",
    },
    {
        q: "How long does construction take?",
        a: "About 7 months for a G+1 house and 9 months for G+2. Interiors add 6–10 weeks if we start them before handover, which we usually do.",
    },
    {
        q: "How do payments work?",
        a: "In stages tied to work on site: booking, plinth, each slab, brickwork, finishes and handover. You pay for what has been built, never ahead of it.",
    },
    {
        q: "Which areas do you work in?",
        a: "All of Delhi NCR: East and South Delhi, Noida, Greater Noida, Ghaziabad, Indirapuram, Gurugram and Faridabad. Our studio is in Jagat Puri and our factory is in Indirapuram.",
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
