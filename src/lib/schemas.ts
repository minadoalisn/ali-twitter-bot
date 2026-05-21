import { z } from "zod";

export const usdtSettlementSchema = z.object({
  productId: z.string().min(1),
  amountUsd: z.coerce.number().positive(),
  txHash: z.string().min(24).max(120),
  walletAddress: z.string().min(24).max(120),
  locale: z.enum(["zh", "en"]).default("zh"),
  returnPath: z.string().min(1).max(180).optional(),
});

export const generateDesignSchema = z.object({
  seriesId: z.string().min(1),
  category: z.string().min(1),
  inspiration: z.string().min(2).max(240),
  materials: z.array(z.string()).min(1).max(8),
});
