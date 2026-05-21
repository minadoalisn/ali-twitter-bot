import { ProductDetail } from "@/components/sections/product-detail";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { localizedProductConcept } from "@/lib/localized-content";
import { getProduct } from "@/lib/noirven-data";
import { createMetadata } from "@/lib/seo";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return createMetadata({
    title: product ? `${product.title} ${product.serial}` : "Ultra-Luxury Work",
    description: product ? localizedProductConcept(product, "en") : undefined,
    path: `/en/auctions/${slug}`,
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

  return <ProductDetail slug={slug} locale="en" paymentStatus={query?.payment} expectedAmount={query?.expected} session={session} />;
}
