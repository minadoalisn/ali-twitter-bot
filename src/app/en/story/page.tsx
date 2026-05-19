import { StoryPage } from "@/components/sections/story-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Brand Story",
  description: "Noirven brand story: every belonging is a quiet rescue.",
  path: "/en/story",
});

export default function Page() {
  return <StoryPage locale="en" />;
}
