import { ProductDetail } from "@/components/sections/product-detail";
import { getProduct } from "@/lib/noirven-data";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return createMetadata({
    title: product ? `${product.title} ${product.serial}` : "Auction Work",
    description: product?.concept,
    path: `/en/auctions/${slug}`,
    image: product?.image,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} locale="en" />;
}
