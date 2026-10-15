import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AMS Interiors",
    short_name: "AMS Interiors",
    description: "Premium modular kitchens, wardrobes and interiors in Delhi NCR.",
    start_url: "/",
    display: "standalone",
    background_color: "#140F08",
    theme_color: "#B8892A",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
