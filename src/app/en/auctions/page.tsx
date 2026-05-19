import { AuctionPage } from "@/components/sections/auction-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Seven-Day Auctions",
  description: "Noirven seven-day auctions present numbered one-of-one jewelry works still waiting to be recognized.",
  path: "/en/auctions",
});

export default function Page() {
  return <AuctionPage locale="en" />;
}
