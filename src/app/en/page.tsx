import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "One-of-One Light-Luxury Art Jewelry",
  description:
    "Noirven presents numbered one-of-one jewelry works at fixed ownership prices. Every belonging is a quiet rescue.",
  path: "/en",
});

export default function Page() {
  return <HomePage locale="en" />;
}
