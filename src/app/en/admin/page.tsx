import { AdminPage } from "@/components/sections/admin-page";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

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

export default function Page() {
  return <AdminPage locale="en" />;
}
