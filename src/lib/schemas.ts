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

export const customerInquirySchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120).optional().or(z.literal("")),
    phone: z.string().trim().max(80).optional().or(z.literal("")),
    contactChannel: z.enum(["email", "wechat", "whatsapp", "telegram", "phone", "other"]).default("email"),
    contactHandle: z.string().trim().max(120).optional().or(z.literal("")),
    intent: z.enum(["available_work", "custom", "payment", "delivery", "press", "other"]).default("available_work"),
    productSerial: z.string().trim().max(40).optional().or(z.literal("")),
    budgetUsd: z.coerce.number().positive().max(10_000_000).optional().or(z.literal("")),
    message: z.string().trim().min(8).max(1200),
    locale: z.enum(["zh", "en"]).default("zh"),
    pagePath: z.string().trim().max(240).optional().or(z.literal("")),
    source: z.string().trim().max(80).optional().or(z.literal("")),
    company: z.string().trim().max(120).optional().or(z.literal("")),
  })
  .refine((input) => Boolean(input.email || input.phone || input.contactHandle), {
    message: "At least one contact method is required",
    path: ["contactHandle"],
  });
