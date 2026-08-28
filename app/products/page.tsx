import { ProductCardsDemo } from "@/components/ProductCardsDemo";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/products");

export default function ProductsPage() {
  return <ProductCardsDemo />;
}
