import { ProductDetail } from "@/components/sections/product-detail";
import { getProduct } from "@/lib/noirven-data";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return createMetadata({
    title: product ? `${product.zhTitle} ${product.serial}` : "拍卖作品",
    description: product?.concept,
    path: `/auctions/${slug}`,
    image: product?.image,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ payment?: string; minimumBid?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  return <ProductDetail slug={slug} locale="zh" paymentStatus={query?.payment} minimumBid={query?.minimumBid} />;
}
