import type { Locale } from "@/lib/types";

export const locales = ["zh", "en"] as const;

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
};

export const navCopy: Record<
  Locale,
  {
    auctions: string;
    series: string;
    sold: string;
    story: string;
    account: string;
    admin: string;
  }
> = {
  zh: {
    auctions: "七日拍卖",
    series: "故事系列",
    sold: "已售档案",
    story: "品牌故事",
    account: "账户",
    admin: "后台",
  },
  en: {
    auctions: "Auctions",
    series: "Story Series",
    sold: "Archive",
    story: "Story",
    account: "Account",
    admin: "Admin",
  },
};

export const homeCopy: Record<
  Locale,
  {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    seriesTitle: string;
    seriesIntro: string;
    auctionTitle: string;
    archiveTitle: string;
  }
> = {
  zh: {
    eyebrow: "七日拍卖 / 唯一编号 / 轻奢艺术首饰",
    headline: "每一次归属，都是一次拯救。",
    subhead:
      "Noirven 诺梵相信，真正独一无二的作品，不该被流行审判。无人认领，它继续等待；有人认领，它从此只归一人。",
    primaryCta: "进入七日拍卖",
    secondaryCta: "品牌故事",
    seriesTitle: "故事系列",
    seriesIntro: "每个系列是一条故事线，每件作品是一章等待被认出的档案。",
    auctionTitle: "正在等待的作品",
    archiveTitle: "已被认出的作品",
  },
  en: {
    eyebrow: "Seven-day auctions / One serial / Light-luxury art jewelry",
    headline: "Every belonging is a quiet rescue.",
    subhead:
      "Noirven believes a one-of-one work should not be judged by trends. If unclaimed, it waits again. Once recognized, it belongs to one person only.",
    primaryCta: "Enter Auctions",
    secondaryCta: "Brand Story",
    seriesTitle: "Story Series",
    seriesIntro: "Each series is a storyline. Each piece is a numbered archive waiting to be recognized.",
    auctionTitle: "Works Still Waiting",
    archiveTitle: "Recognized Archive",
  },
};

export function withLocale(locale: Locale, path: string) {
  if (locale === "zh") return path;
  return `/en${path === "/" ? "" : path}`;
}
