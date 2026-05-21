import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "顶奢作品",
  description: "Noirven 诺梵顶奢作品：举世无双、仅此一件、不复制不复刻的编号顶级奢侈品级高珠宝作品。",
  path: "/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  return <AuctionPage locale="zh" searchParams={searchParams ? await searchParams : {}} />;
}
