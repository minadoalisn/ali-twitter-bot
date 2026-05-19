import { SeriesPage } from "@/components/sections/series-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Story Series",
  description: "Noirven first story series: Still Here, Unclaimed Star, Seventh Light, Justice of One.",
  path: "/en/series",
});

export default function Page() {
  return <SeriesPage locale="en" />;
}
