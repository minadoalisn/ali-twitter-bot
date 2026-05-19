import type { MetadataRoute } from "next";
import { products } from "@/lib/noirven-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noirven.example";
  const staticRoutes = ["", "/auctions", "/series", "/story", "/sold", "/account"];
  const localized = staticRoutes.flatMap((path) => [
    {
      url: `${baseUrl}${path || "/"}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}${path || "/"}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    },
    {
      url: `${baseUrl}/en${path}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}${path || "/"}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    },
  ]);

  const productRoutes = products.flatMap((product) => [
    {
      url: `${baseUrl}/auctions/${product.slug}`,
      lastModified: new Date(product.soldAt ?? product.endsAt),
    },
    {
      url: `${baseUrl}/en/auctions/${product.slug}`,
      lastModified: new Date(product.soldAt ?? product.endsAt),
    },
  ]);

  return [...localized, ...productRoutes];
}
