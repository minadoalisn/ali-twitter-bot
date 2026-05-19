import { StoryPage } from "@/components/sections/story-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "品牌故事",
  description: "Noirven 诺梵最终品牌故事：每一次归属，都是一次拯救。",
  path: "/story",
});

export default function Page() {
  return <StoryPage locale="zh" />;
}
