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
    custom: string;
  }
> = {
  zh: {
    custom: "定制",
    auctions: "顶奢作品",
    series: "故事系列",
    sold: "已售档案",
    story: "品牌故事",
    account: "账户",
    admin: "后台",
  },
  en: {
    custom: "Custom",
    auctions: "Ultra-Luxury",
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
    eyebrow: "举世无双 / 仅此一件 / 不复制不复刻",
    headline: "每一次归属，都是一次拯救。",
    subhead: "每件 Noirven 只存在一个实体：一个编号、一条故事、一组材质记忆。不复制，不复刻，不再生产；付款确认后，从此只归一人。",
    primaryCta: "查看顶奢作品",
    secondaryCta: "品牌故事",
    seriesTitle: "故事系列",
    seriesIntro: "每个系列可以延展成故事宇宙，但每一件作品都只制作一次，不会再有第二件。",
    auctionTitle: "举世无双的顶奢作品",
    archiveTitle: "已被认出的作品",
  },
  en: {
    eyebrow: "Unrepeatable / One Physical Piece / Never Reproduced",
    headline: "Every belonging is a quiet rescue.",
    subhead:
      "Every Noirven work exists as one physical piece: one serial, one story, one material memory. Never copied, never reissued; after confirmation, it belongs to one collector only.",
    primaryCta: "Shop Ultra-Luxury",
    secondaryCta: "Brand Story",
    seriesTitle: "Story Series",
    seriesIntro: "Each series can expand into a story universe, but every finished work is made once and never repeated.",
    auctionTitle: "Unrepeatable Ultra-Luxury Works",
    archiveTitle: "Recognized Archive",
  },
};

export function withLocale(locale: Locale, path: string) {
  if (locale === "zh") return path;
  return `/en${path === "/" ? "" : path}`;
}
