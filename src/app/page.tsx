import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "顶级奢侈品级艺术珠宝",
  description: "Noirven 诺梵只发布举世无双的编号顶级奢侈品级作品：每件仅此一件，不复制、不复刻、不再生产。",
  path: "/",
});

export default function Page() {
  return <HomePage locale="zh" />;
}
