import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "七日归属·轻奢艺术珠宝",
  description: "Noirven 诺梵以故事系列、唯一编号与七日归属呈现独一无二的轻奢艺术珠宝。",
  path: "/",
});

export default function Page() {
  return <HomePage locale="zh" />;
}
