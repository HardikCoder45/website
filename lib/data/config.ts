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
    { value: 10, suffix: " yr", label: "Structural warranty" },
    { value: 4.7, suffix: "★", label: "IndiaMart rating", decimals: 1 },
    { value: new Date().getFullYear() - FOUNDED_YEAR, suffix: "", label: "Years building in NCR" },
];

export const FAQS = [
    {
        q: "What does it cost to build a house in Delhi?",
        a: "Our turnkey rates are ₹1,950, ₹2,450 and ₹3,150 per sq ft of built-up area for the Essential, Signature and Bespoke packages. A G+2 builder floor with stilt parking on a 150 sq yd plot comes to roughly ₹84–95 lakh in Signature. Grey structure alone is ₹1,350–1,650 per sq ft. The estimate tool above gives a figure for your plot.",
    },
    {
        q: "What is included in the per-square-foot rate?",
        a: "Structure, brickwork, plaster, plumbing, electrical wiring, waterproofing, flooring, doors, windows, bathroom fittings and paint, with the brands listed in the specification schedule. Approvals fees, boundary walls, borewells, lifts and interiors are quoted separately.",
    },
    {
        q: "Do you handle MCD approvals and structural drawings?",
        a: "Yes. Our engineer prepares the structural drawings and we prepare the submission set and follow it through. Government fees are paid at actuals.",
    },
    {
        q: "How long does construction take?",
        a: "About 11 months for a G+2 house with stilt parking, and 8 months for G+1. Interiors add 6–10 weeks if we start them before handover, which we usually do.",
    },
    {
        q: "How do payments work?",
        a: "In stages tied to work on site: booking, plinth, each slab, brickwork, finishes and handover. You pay for what has been built, never ahead of it.",
    },
    {
        q: "How much does a modular kitchen cost?",
        a: "From ₹1,500 per sq ft for laminate on HDHMR, ₹2,000–2,600 for acrylic and ₹2,600–3,200 for PU or glass. An L-shaped kitchen for a 2BHK usually lands between ₹2.5 and ₹4.5 lakh with hardware.",
    },
    {
        q: "Which areas do you work in?",
        a: "All of Delhi NCR: East and South Delhi, Noida, Greater Noida, Ghaziabad, Indirapuram, Gurugram and Faridabad. Our studio is in Jagat Puri and our factory is in Indirapuram.",
    },
    {
        q: "What warranty do you give?",
        a: "10 years on structure in the Signature and Bespoke packages, 5 years in Essential, and up to 10 years on modular carpentry and hardware. Every warranty is written into the handover file.",
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
