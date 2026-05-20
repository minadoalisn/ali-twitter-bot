import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "七日拍卖",
  description: "Noirven 诺梵七日拍卖展示仍在等待被认出的唯一编号作品。",
  path: "/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  return <AuctionPage locale="zh" searchParams={searchParams ? await searchParams : {}} />;
}
