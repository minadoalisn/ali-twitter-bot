import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "现售孤品",
  description: "Noirven 诺梵现售孤品展示仍在等待唯一主人确认的编号高珠宝作品。",
  path: "/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  return <AuctionPage locale="zh" searchParams={searchParams ? await searchParams : {}} />;
}
