import { AdminPage } from "@/components/sections/admin-page";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...createMetadata({
    title: "后台",
    description: "Noirven 诺梵高奢后台：故事线、生成式设计、固定归属价、USDT 审核与订单管理。",
    path: "/admin",
  }),
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Page() {
  return <AdminPage locale="zh" />;
}
