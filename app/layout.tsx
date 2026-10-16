import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { CONTACT_INFO, FAQS, SITE_URL, FOUNDED_YEAR } from "@/lib/data/config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const title = "AMS Interiors — Premium Modular Kitchens & Interiors in Delhi NCR";
const description =
  "Delhi NCR's trusted interior design studio. Modular kitchens, wardrobes, false ceilings, renovations & full-home interiors. Free site visit, free 3D design, up to 10-year warranty. 4.7★ rated, GST verified.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s · AMS Interiors",
  },
  description,
  keywords: [
    "modular kitchen Delhi",
    "interior designer Delhi",
    "interior design East Delhi",
    "wardrobe Delhi",
    "false ceiling Delhi",
    "home renovation Delhi NCR",
    "modular kitchen Noida",
    "modular kitchen Ghaziabad",
    "Jagat Puri interiors",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "AMS Interiors — Spaces That Define Luxury",
    description: "Trusted by 1000+ Delhi families. Free site visit, free 3D design, up to 10-year warranty, GST verified.",
    type: "website",
    url: SITE_URL,
    siteName: "AMS Interiors",
    locale: "en_IN",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "AMS Interiors — wenge and Nero Marquina kitchen, ray-traced 3D visualisation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMS Interiors — Spaces That Define Luxury",
    description: "Modular kitchens, wardrobes and turnkey interiors across Delhi NCR.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#140F08",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "AMS Interiors",
    slogan: "Love to Make Designs & Ideas",
    url: SITE_URL,
    telephone: CONTACT_INFO.phone1,
    email: CONTACT_INFO.email,
    foundingDate: String(FOUNDED_YEAR),
    priceRange: "₹₹",
    taxID: CONTACT_INFO.gstNo,
    address: {
      "@type": "PostalAddress",
      streetAddress: "72-A, Main Road Jagat Puri, Shahdara",
      addressLocality: "New Delhi",
      postalCode: "110051",
      addressRegion: "DL",
      addressCountry: "IN",
    },
    areaServed: ["Delhi", "Noida", "Ghaziabad", "Gurugram", "Faridabad", "Greater Noida"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "37",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-charcoal text-white selection:bg-brass selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[30000] focus:px-5 focus:py-3 focus:rounded-xl focus:bg-brass focus:text-white focus:font-semibold"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
