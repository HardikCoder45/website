import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "AMS Interiors — Premium Modular Kitchens & Interiors in Delhi",
  description:
    "Delhi NCR's trusted interior design studio. Modular kitchens, wardrobes, false ceilings, renovations & more. Free site visit. 4.7★ rated. GST Verified.",
  keywords: "modular kitchen Delhi, interior design Delhi, wardrobe, false ceiling, renovation, Jagat Puri",
  openGraph: {
    title: "AMS Interiors — Premium Interiors & Modular Kitchens",
    description: "Trusted by 1000+ Delhi families. Free site visit, 10-year warranty, GST verified.",
    type: "website",
  },
};

import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-charcoal text-white selection:bg-brass selection:text-white">
        <ScrollProgress />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
