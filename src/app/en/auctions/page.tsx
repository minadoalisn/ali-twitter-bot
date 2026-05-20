import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Seven-Day Auctions",
  description: "Noirven seven-day auctions present numbered one-of-one jewelry works still waiting to be recognized.",
  path: "/en/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  return <AuctionPage locale="en" searchParams={searchParams ? await searchParams : {}} />;
}
