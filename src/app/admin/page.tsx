import { AdminPage } from "@/components/sections/admin-page";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { getRecentCustomerInquiries } from "@/lib/inquiries";
import { createMetadata } from "@/lib/seo";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...createMetadata({
    title: "后台",
    description: "Noirven 诺梵高奢后台：故事线、生成式设计、顶奢定价、USDT 审核与订单管理。",
    path: "/admin",
  }),
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(AUTH_COOKIE)?.value);

  if (session?.role !== "admin") {
    redirect("/admin/login?next=%2Fadmin");
  }

  const inquiryInbox = await getRecentCustomerInquiries();

  return <AdminPage locale="zh" inquiryInbox={inquiryInbox} />;
}
