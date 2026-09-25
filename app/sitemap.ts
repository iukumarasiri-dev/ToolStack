import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories, categoryHref, getLiveTools, toolHref } from "@/config/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => `${siteConfig.url}${path}`;

  return [
    { url: url("/"), lastModified, priority: 1 },
    ...categories.map((c) => ({ url: url(categoryHref(c)), lastModified, priority: 0.8 })),
    // Only live tools — "coming soon" tools have no page yet.
    ...getLiveTools().map((t) => ({ url: url(toolHref(t)), lastModified, priority: 0.9 })),
    ...["/about", "/contact", "/privacy-policy", "/terms"].map((path) => ({
      url: url(path),
      lastModified,
      priority: 0.3,
    })),
  ];
}
