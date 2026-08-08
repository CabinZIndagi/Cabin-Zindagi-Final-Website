import { ProductDetail } from "@/components/ProductDetail";
import { products } from "@/data/products";

export async function generateStaticParams() {
  // Skip cards that link elsewhere (e.g. the booking flow) — they have no
  // detail page of their own.
  return products
    .filter((prod) => !prod.href)
    .map((prod) => ({ id: prod.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
