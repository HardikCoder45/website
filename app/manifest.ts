import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AMS Interiors",
    short_name: "AMS",
    description: "Modular kitchens, interiors and house construction in Delhi NCR.",
    start_url: "/",
    display: "standalone",
    background_color: "#2C2416",
    theme_color: "#2C2416",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
