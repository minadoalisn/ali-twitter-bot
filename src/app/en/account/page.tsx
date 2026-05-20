import { AccountPage } from "@/components/sections/account-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Account",
  description: "Noirven account center for bids, deposits, orders, and belonging archive.",
  path: "/en/account",
});

export default async function Page({ searchParams }: { searchParams?: Promise<{ payment?: string }> }) {
  const params = await searchParams;
  return <AccountPage locale="en" paymentStatus={params?.payment} />;
}
