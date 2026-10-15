import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/kitchen`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/wardrobe`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/interior`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
