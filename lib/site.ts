import type { Metadata } from "next";
import { products } from "@/data/products";

// Canonical origin for every absolute URL the site emits (sitemap, robots,
// llms.txt, OG tags). The live site is served from the apex — www.cabinzindagi.com
// 301s here — so that is what canonicals and the sitemap must point at.
// NEXT_PUBLIC_SITE_URL is an optional override (e.g. a staging domain); leaving
// it unset is the correct configuration for production.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cabinzindagi.com"
).replace(/\/$/, "");

export const siteName = "Cabin Zindagi";

export const siteTagline = "The Human Side of Logistics";

export const siteDescription =
  "Cabin Zindagi documents, amplifies and protects the lives of India's 9 million truck drivers — real stories from the cabin, driver care products, and safe parking, dhabas and rest stops on the highway.";

/**
 * The generated social card (app/opengraph-image.tsx). Next merges metadata
 * shallowly — a page that declares `openGraph` replaces the layout's entirely —
 * so every page has to restate the image rather than inherit it.
 */
export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteName} — ${siteTagline}`,
};

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Product detail pages that actually exist (cards with a custom href link elsewhere). */
export const productPaths = products
  .filter((prod) => !prod.href)
  .map((prod) => `/products/${prod.id}`);

type PageEntry = {
  path: string;
  title: string;
  description: string;
  /** Sitemap hints. */
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
};

/** The site's public pages — the single source for sitemap.xml and llms.txt. */
export const pages: PageEntry[] = [
  {
    path: "/",
    title: `${siteName} — ${siteTagline}`,
    description:
      "The story of India's 9 million truck drivers, told from inside the cabin — what we do, who we build for, and why the wheels turning matters.",
    priority: 1,
    changeFrequency: "monthly",
  },
  {
    path: "/impact",
    title: "Our Impact",
    description:
      "A timeline of Cabin Zindagi's work with India's truck drivers — the milestones so far, and how a one-time contribution goes straight back onto the road.",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/stories",
    title: "Driver Stories",
    description:
      "Unscripted video stories recorded inside the cabin with India's truck drivers, published on the Cabin Zindagi YouTube channel.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/products",
    title: "Products for Drivers & Fleets",
    description:
      "Driver care built for life on the road — an insulated water bottle, a driver travel kit, and a modular dormitory for fleets and logistics parks.",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/for-drivers",
    title: "For Drivers",
    description:
      "A free portal for India's truck drivers, in Hindi or English — parking, dhabas, rest stops, music and more.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/stays",
    title: "Find Parking & Dhabas",
    description:
      "Safe truck parking, dhaba meals and rest stops along your route — locations, facilities and directions.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/contact",
    title: "Contact Us",
    description:
      "Partner with Cabin Zindagi, sponsor driver care, or tell us a story from the road. Reach the team at hello@cabinzindagi.com.",
    priority: 0.6,
    changeFrequency: "yearly",
  },
];

/**
 * Metadata for one of the pages above, keyed by path — keeps each page's title
 * and description in the same place the sitemap and llms.txt read them from.
 */
export function pageMetadata(path: string): Metadata {
  const page = pages.find((entry) => entry.path === path);
  if (!page) throw new Error(`No page entry in lib/site.ts for "${path}"`);
  return {
    // The home page carries the full brand title, so skip the "| Cabin Zindagi"
    // template there.
    title: path === "/" ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_IN",
      url: page.path,
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
  };
}
