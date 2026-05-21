import type { Metadata } from "next";

const siteName = "Noirven 诺梵高奢";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";

const baseTitle = "Noirven 诺梵高奢｜现售孤品·轻奢艺术珠宝";
const baseDescription =
  "Noirven 诺梵高奢以故事系列、唯一编号与固定归属价呈现独一无二的轻奢艺术珠宝。每一次归属，都是一次收藏。";

export function createMetadata({
  title,
  description,
  path = "",
  image = "/assets/noirven-series-visual.png",
  openGraphLocale,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  openGraphLocale?: string;
} = {}): Metadata {
  const finalTitle = title ? `${title} | ${siteName}` : baseTitle;
  const finalDescription = description ?? baseDescription;
  const normalizedPath = path || "/";
  const zhPath = normalizedPath.startsWith("/en") ? normalizedPath.replace(/^\/en/, "") || "/" : normalizedPath;
  const enPath = normalizedPath.startsWith("/en") ? normalizedPath : `/en${normalizedPath === "/" ? "" : normalizedPath}`;
  const url = `${siteUrl}${normalizedPath}`;
  const finalOgLocale = openGraphLocale ?? (normalizedPath.startsWith("/en") ? "en_US" : "zh_CN");

  return {
    title: finalTitle,
    description: finalDescription,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    alternates: {
      canonical: normalizedPath,
      languages: {
        "zh-CN": zhPath,
        en: enPath,
        "x-default": zhPath,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName,
      images: [{ url: image, width: 1200, height: 630, alt: finalTitle }],
      locale: finalOgLocale,
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
