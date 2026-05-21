import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Unrepeatable Ultra-Luxury Art Jewelry",
  description:
    "Noirven presents unrepeatable ultra-luxury numbered works: one physical piece, never copied, never reissued, and registered to one collector after confirmation.",
  path: "/en",
});

export default function Page() {
  return <HomePage locale="en" />;
}
