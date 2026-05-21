import { AccountPage } from "@/components/sections/account-page";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...createMetadata({
    title: "账户",
    description: "Noirven 诺梵高奢账户中心：付款凭证、订单与归属档案管理。",
    path: "/account",
  }),
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function Page({ searchParams }: { searchParams?: Promise<{ payment?: string }> }) {
  const params = await searchParams;
  return <AccountPage locale="zh" paymentStatus={params?.payment} />;
}
