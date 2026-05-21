import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "One-of-One Works",
  description: "Noirven presents numbered one-of-one high-jewelry works available at fixed ownership prices.",
  path: "/en/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  return <AuctionPage locale="en" searchParams={searchParams ? await searchParams : {}} />;
}
