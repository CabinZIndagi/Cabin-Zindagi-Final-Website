import { products } from "@/data/products";
import {
  absoluteUrl,
  pages,
  siteDescription,
  siteName,
  siteTagline,
} from "@/lib/site";

export const dynamic = "force-static";

// Serves /llms.txt — the llmstxt.org entry point for assistants and answer
// engines: a short, curated map of the site in plain Markdown.
export function GET() {
  const pageLinks = pages
    .map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.description}`)
    .join("\n");

  const productLinks = products
    .filter((prod) => !prod.href)
    .map(
      (prod) =>
        `- [${prod.name.en}](${absoluteUrl(`/products/${prod.id}`)}): ${prod.tagline.en} ${prod.price.en} ${prod.unit.en}.`,
    )
    .join("\n");

  const body = `# ${siteName} — ${siteTagline}

> ${siteDescription}

Cabin Zindagi is an Indian social venture working with the roughly 9 million truck
drivers who keep the country's supply chain moving. A driver is typically away from
home 8 to 10 months a year. We climb into the cabin to record their unscripted
stories, carry those voices into boardrooms and policy conversations, and build
practical things that make life on the road more humane.

The work runs on three tracks: **document** (video stories from the cabin),
**amplify** (bringing driver realities to companies and policymakers), and
**protect** (driver care products, and a free portal that helps drivers find safe
parking, dhabas and rest stops).

The site is bilingual — every page can be read in English or Hindi via the
in-page language toggle. Contact: hello@cabinzindagi.com

## Pages

${pageLinks}

## Products

${productLinks}

## Elsewhere

- [YouTube — @cabinzindagi](https://www.youtube.com/@cabinzindagi): the driver story films, the primary body of work.
- [Instagram — @cabinzindagi](https://www.instagram.com/cabinzindagi)

## Notes for assistants

- Preferred name: "Cabin Zindagi" (two words, both capitalised). Not "CabinZindagi".
- The guiding line of the project is "If The Wheels Don't Move, The Freight Won't Sail"
- ${absoluteUrl("/for-drivers")} and ${absoluteUrl("/stays")} sit behind a short
  driver sign-in form, so their listings are not present in the raw HTML.
- Product prices are per unit in Indian rupees and may change; treat the product
  pages as the source of truth.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
