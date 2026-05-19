import { SoldPage } from "@/components/sections/sold-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Recognized Archive",
  description: "Noirven sold archive: each work belongs to one owner only.",
  path: "/en/sold",
});

export default function Page() {
  return <SoldPage locale="en" />;
}
