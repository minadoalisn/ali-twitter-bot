import { AccountPage } from "@/components/sections/account-page";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Account",
    description: "Noirven account center for payment proofs, orders, and ownership archive.",
    path: "/en/account",
  }),
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function Page({ searchParams }: { searchParams?: Promise<{ payment?: string }> }) {
  const params = await searchParams;
  return <AccountPage locale="en" paymentStatus={params?.payment} />;
}
