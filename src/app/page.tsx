import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "现售孤品·轻奢艺术珠宝",
  description: "Noirven 诺梵以故事系列、唯一编号与固定归属价呈现独一无二的轻奢艺术珠宝。",
  path: "/",
});

export default function Page() {
  return <HomePage locale="zh" />;
}
