export type Category =
  | "ring"
  | "necklace"
  | "earring"
  | "bracelet"
  | "watch"
  | "stud"
  | "brooch";

export type Locale = "zh" | "en";

export type AuctionStatus = "live" | "waiting" | "sold";

export type StorySeries = {
  id: string;
  name: string;
  zhName: string;
  theme: string;
  emotionalLine: string;
  description: string;
  categories: Category[];
  materials: string[];
  craft: string[];
  visualMemory: string[];
  ipHook: string;
};

export type Product = {
  id: string;
  slug: string;
  serial: string;
  title: string;
  zhTitle: string;
  seriesId: string;
  category: Category;
  inspiration: string;
  concept: string;
  materials: string[];
  craft: string[];
  startPrice: number;
  currentPrice: number;
  depositAmount: number;
  bidIncrement: number;
  bids: number;
  endsAt: string;
  status: AuctionStatus;
  ownerNickname?: string;
  soldAt?: string;
  image: string;
  sizing: string;
  engraving: string;
  pricingBasis: string;
};

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
};
