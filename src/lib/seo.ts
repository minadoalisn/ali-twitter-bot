import type { Metadata } from "next";

const zhSiteName = "Noirven 诺梵高奢";
const enSiteName = "Noirven";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";

const baseTitle = "Noirven 诺梵高奢｜顶级奢侈品级艺术珠宝";
const baseDescription =
  "Noirven 诺梵高奢只发布举世无双的编号顶级奢侈品级作品：每件仅此一件，不复制、不复刻、不再生产，付款确认后只归一位主人。";

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
  const normalizedPath = path || "/";
  const isEnglish = normalizedPath.startsWith("/en");
  const siteName = isEnglish ? enSiteName : zhSiteName;
  const finalTitle = title ? `${title} | ${siteName}` : isEnglish ? `Noirven | Unrepeatable Ultra-Luxury Art Jewelry` : baseTitle;
  const finalDescription = description ?? (isEnglish ? "Noirven presents unrepeatable ultra-luxury numbered works: one physical piece, never copied, never reissued, and registered to one collector after confirmation." : baseDescription);
  const zhPath = isEnglish ? normalizedPath.replace(/^\/en/, "") || "/" : normalizedPath;
  const enPath = isEnglish ? normalizedPath : `/en${normalizedPath === "/" ? "" : normalizedPath}`;
  const url = `${siteUrl}${normalizedPath}`;
  const finalOgLocale = openGraphLocale ?? (isEnglish ? "en_US" : "zh_CN");

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
