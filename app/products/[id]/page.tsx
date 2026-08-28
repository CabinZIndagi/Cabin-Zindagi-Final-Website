import { ProductDetail } from "@/components/ProductDetail";
import { products } from "@/data/products";
import type { Metadata } from "next";
import { ogImage, siteName } from "@/lib/site";

export async function generateStaticParams() {
  // Skip cards that link elsewhere (e.g. the booking flow) — they have no
  // detail page of their own.
  return products
    .filter((prod) => !prod.href)
    .map((prod) => ({ id: prod.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((prod) => prod.id === id);
  if (!product) return {};

  const title = `${product.name.en} for Truck Drivers`;
  const description = `${product.tagline.en} ${product.price.en} ${product.unit.en} — from ${siteName}.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_IN",
      url: `/products/${product.id}`,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
