import type { Category } from "@/lib/types";

const categoryBase: Record<Category, number> = {
  ring: 2188,
  necklace: 2388,
  earring: 2288,
  bracelet: 2688,
  watch: 4288,
  stud: 1888,
  brooch: 3188,
};

const materialScore: Record<string, number> = {
  玫瑰金: 260,
  雕金: 620,
  黄金: 320,
  铂金: 520,
  天然白钻: 560,
  彩色宝石: 460,
  青金石: 220,
  贝母: 180,
  孔雀石: 260,
};

const craftScore: Record<string, number> = {
  珐琅彩: 360,
  钢琴烤漆: 280,
  鎏金: 320,
  鎏彩: 420,
  景泰蓝: 680,
  雕金: 620,
};

const seriesScore: Record<string, number> = {
  "still-here": 180,
  "unclaimed-star": 120,
  "seventh-light": 360,
  "justice-of-one": 520,
};

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
  const materialTotal = materials.reduce((total, item) => total + (materialScore[item] ?? 120), 0);
  const craftTotal = craft.reduce((total, item) => total + (craftScore[item] ?? 160), 0);
  const raw = categoryBase[category] + materialTotal + craftTotal + (seriesScore[seriesId] ?? 0);
  const rounded = Math.round(raw / 10) * 10 + 8;
  return Math.max(1888, Math.min(5999, rounded));
}
