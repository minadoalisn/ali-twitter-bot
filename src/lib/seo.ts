import type { Metadata } from "next";

const siteName = "Noirven 诺梵";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
const baseTitle = "Noirven 诺梵 | 七日拍卖轻奢艺术首饰";
const baseDescription =
  "Noirven 诺梵以故事系列、唯一编号和七日拍卖展示独一无二的轻奢艺术首饰。每一次归属，都是一次拯救。";

export function createMetadata({
  title,
  description,
  path = "",
  image = "/assets/noirven-series-visual.png",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
} = {}): Metadata {
  const finalTitle = title ? `${title} | ${siteName}` : baseTitle;
  const finalDescription = description ?? baseDescription;
  const normalizedPath = path || "/";
  const zhPath = normalizedPath.startsWith("/en") ? normalizedPath.replace(/^\/en/, "") || "/" : normalizedPath;
  const enPath = normalizedPath.startsWith("/en") ? normalizedPath : `/en${normalizedPath === "/" ? "" : normalizedPath}`;
  const url = `${siteUrl}${normalizedPath}`;

  return {
    title: finalTitle,
    description: finalDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: normalizedPath,
      languages: {
        "zh-CN": zhPath,
        en: enPath,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName,
      images: [{ url: image, width: 1200, height: 900, alt: finalTitle }],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [image],
    },
  };
}
