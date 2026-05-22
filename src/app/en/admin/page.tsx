import { AdminPage } from "@/components/sections/admin-page";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { getCustomerServiceConfig, getRecentCustomerInquiries } from "@/lib/inquiries";
import { createMetadata } from "@/lib/seo";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Admin",
    description: "Noirven admin shell for storylines, generated designs, fixed pricing, USDT review, and orders.",
    path: "/en/admin",
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
    redirect("/en/admin/login?next=%2Fen%2Fadmin");
  }

  const inquiryInbox = await getRecentCustomerInquiries();
  const customerServiceConfig = getCustomerServiceConfig();

  return <AdminPage locale="en" inquiryInbox={inquiryInbox} customerServiceConfig={customerServiceConfig} />;
}
