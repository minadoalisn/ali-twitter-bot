import { SeriesPage } from "@/components/sections/series-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "故事系列",
  description: "Noirven 诺梵首批故事系列：Still Here、Awaiting Star、Seventh Light、Justice of One。",
  path: "/series",
});

export default function Page() {
  return <SeriesPage locale="zh" />;
}
