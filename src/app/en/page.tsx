import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Seven-Day Belonging Light-Luxury Art Jewelry",
  description:
    "Noirven presents numbered one-of-one jewelry works through seven-day belonging windows. Every belonging is a quiet rescue.",
  path: "/en",
});

export default function Page() {
  return <HomePage locale="en" />;
}
