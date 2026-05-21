import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "七日归属",
  description: "Noirven 诺梵七日归属展示仍在等待唯一主人确认的编号孤品。",
  path: "/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  return <AuctionPage locale="zh" searchParams={searchParams ? await searchParams : {}} />;
}
