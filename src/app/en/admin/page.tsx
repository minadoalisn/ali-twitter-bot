import { AdminPage } from "@/components/sections/admin-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin",
  description: "Noirven admin shell for storylines, generated designs, auctions, payments, and orders.",
  path: "/en/admin",
});

export default function Page() {
  return <AdminPage locale="en" />;
}
