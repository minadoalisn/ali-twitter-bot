import { AccountPage } from "@/components/sections/account-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Account",
  description: "Noirven account center for bids, deposits, orders, and belonging archive.",
  path: "/en/account",
});

export default function Page() {
  return <AccountPage locale="en" />;
}
