import { ProductDetail } from "@/components/sections/product-detail";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { getProduct } from "@/lib/noirven-data";
import { createMetadata } from "@/lib/seo";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return createMetadata({
    title: product ? `${product.zhTitle} ${product.serial}` : "现售孤品",
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
  searchParams?: Promise<{ payment?: string; expected?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(AUTH_COOKIE)?.value);

  return <ProductDetail slug={slug} locale="zh" paymentStatus={query?.payment} expectedAmount={query?.expected} session={session} />;
}
