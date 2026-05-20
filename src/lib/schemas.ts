import { z } from "zod";

export const bidSchema = z.object({
  productId: z.string().min(1),
  amount: z.number().positive(),
  nickname: z.string().min(2).max(48),
});

export const depositSchema = z.object({
  productId: z.string().min(1),
  amount: z.number().positive(),
  nickname: z.string().min(2).max(48),
});

export const bidCheckoutSchema = bidSchema.extend({
  locale: z.enum(["zh", "en"]),
  returnPath: z.string().min(1).max(180),
});

export const usdtSettlementSchema = z.object({
  productId: z.string().min(1),
  amountUsd: z.number().positive(),
  txHash: z.string().min(24).max(120),
  walletAddress: z.string().min(24).max(120),
});

export const generateDesignSchema = z.object({
  seriesId: z.string().min(1),
  category: z.string().min(1),
  inspiration: z.string().min(2).max(240),
  materials: z.array(z.string()).min(1).max(8),
});
