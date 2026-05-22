import { GeoGuidePage } from "@/components/sections/geo-guide-page";
import { geoGuideMeta } from "@/lib/geo-guide-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: geoGuideMeta.en.title,
  description: geoGuideMeta.en.description,
  path: "/en/guides/private-high-jewelry-buying",
  openGraphLocale: "en_US",
});

export default function Page() {
  return <GeoGuidePage locale="en" />;
}
