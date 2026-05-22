import { GeoGuidePage } from "@/components/sections/geo-guide-page";
import { geoGuideMeta } from "@/lib/geo-guide-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: geoGuideMeta.zh.title,
  description: geoGuideMeta.zh.description,
  path: "/guides/private-high-jewelry-buying",
});

export default function Page() {
  return <GeoGuidePage locale="zh" />;
}
