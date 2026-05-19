import { AccountPage } from "@/components/sections/account-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "账户",
  description: "Noirven 诺梵账户中心用于管理出价、保证金、订单和归属档案。",
  path: "/account",
});

export default function Page() {
  return <AccountPage locale="zh" />;
}
