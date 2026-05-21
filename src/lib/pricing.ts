import type { Category } from "@/lib/types";

export const luxuryStartPriceRange = {
  min: 18_800,
  max: 188_000,
} as const;

const categoryBase: Record<Category, number> = {
  stud: 18_800,
  ring: 28_800,
  earring: 32_800,
  necklace: 36_800,
  bracelet: 54_800,
  brooch: 62_800,
  watch: 98_800,
};

const seriesPremium: Record<string, number> = {
  "still-here": 8_000,
  "unclaimed-star": 6_000,
  "seventh-light": 16_000,
  "justice-of-one": 18_000,
  "ash-garden": 20_000,
  "tide-return": 12_000,
  "tender-armor": 10_000,
  "moon-archive": 12_000,
};

const materialPremiums = [
  ["帕拉伊巴", 18_000],
  ["沙弗莱", 14_000],
  ["祖母绿", 14_000],
  ["坦桑石", 12_000],
  ["蓝宝石", 10_000],
  ["红宝石", 12_000],
  ["天然白钻", 14_000],
  ["彩色宝石", 9_000],
  ["欧泊", 9_000],
  ["月光石", 7_000],
  ["青金石", 6_000],
  ["孔雀石", 6_000],
  ["贝母", 5_000],
  ["黑贝母", 6_000],
  ["珍珠母贝", 5_000],
  ["陨铁", 12_000],
  ["陨石", 12_000],
  ["钯金", 10_000],
  ["钛金属", 9_000],
  ["黑陶瓷", 8_000],
  ["黑铑铂金", 8_000],
  ["铂金", 7_000],
  ["雕金", 7_000],
  ["黄金", 5_000],
  ["玫瑰金", 4_000],
  ["碳纤维", 5_000],
  ["黑玛瑙", 5_000],
  ["烟晶", 4_000],
] as const;

const craftPremiums = [
  ["隐秘式镶嵌", 14_000],
  ["景泰蓝", 12_000],
  ["错金银", 11_000],
  ["手工錾刻", 10_000],
  ["玑镂", 9_000],
  ["珐琅", 8_000],
  ["钢琴烤漆", 7_000],
  ["雪花镶", 8_000],
  ["贝母薄片镶嵌", 7_000],
  ["半透明珐琅", 7_000],
  ["钛金属阳极氧化", 7_000],
  ["陶瓷烧结", 6_000],
  ["镜面抛光", 4_000],
  ["拉丝雾面", 4_000],
  ["微密镶", 6_000],
  ["冷珐琅", 5_000],
  ["鎏金", 5_000],
  ["鎏彩", 6_000],
] as const;

function scoreTerms(values: string[], premiums: readonly (readonly [string, number])[]) {
  const line = values.join(" / ");
  return premiums.reduce((total, [term, premium]) => (line.includes(term) ? total + premium : total), 0);
}

function roundLuxuryPrice(value: number) {
  return Math.round(value / 1000) * 1000 + 800;
}

export function suggestStartPrice({
  category,
  materials,
  craft,
  seriesId,
}: {
  category: Category;
  materials: string[];
  craft: string[];
  seriesId: string;
}) {
  const raw =
    categoryBase[category] +
    (seriesPremium[seriesId] ?? 8_000) +
    scoreTerms(materials, materialPremiums) +
    scoreTerms(craft, craftPremiums);
  const rounded = roundLuxuryPrice(raw);

  return Math.max(luxuryStartPriceRange.min, Math.min(luxuryStartPriceRange.max, rounded));
}

export function luxuryPricingBasis() {
  return "顶奢定价按顶级奢侈品级高珠宝唯一件重估：综合作品品类体量、主石稀缺度、贵金属结构、复合工艺难度、系列叙事价值、唯一实体与不复制交付规则，形成该作品的专属归属价。";
}
