import { ProductDetail } from "@/components/ProductDetail";
import { products } from "@/data/products";

export async function generateStaticParams() {
  return products.map((prod) => ({
    id: prod.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
