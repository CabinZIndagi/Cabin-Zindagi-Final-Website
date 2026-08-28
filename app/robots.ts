import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Serves /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Search engines: everything except the internal API routes.
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Assistants and answer engines are welcome — the site exists to get
        // driver stories in front of people. /llms.txt is the guided entry point.
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
