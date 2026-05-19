import { AdminPage } from "@/components/sections/admin-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "后台",
  description: "Noirven 诺梵后台骨架：故事线、生成式设计、拍卖、支付与订单管理。",
  path: "/admin",
});

export default function Page() {
  return <AdminPage locale="zh" />;
}
