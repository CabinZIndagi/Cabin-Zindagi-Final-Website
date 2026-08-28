import type { MetadataRoute } from "next";
import { absoluteUrl, pages, productPaths } from "@/lib/site";

// Serves /sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = pages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const productPages = productPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
