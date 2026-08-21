import { z } from "zod";
import {
  PAYMENT_STATUS_VALUES,
  PAYMENT_DIRECTION_VALUES,
  PAYMENT_CATEGORY_VALUES,
  PAYMENT_SOURCE_VALUES,
  PAYMENT_METHOD_VALUES,
} from "@/modules/payments/constants/payment.constants.js";

export const paymentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sort: z.string().default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(PAYMENT_STATUS_VALUES as [string, ...string[]]).optional(),
  direction: z.enum(PAYMENT_DIRECTION_VALUES as [string, ...string[]]).optional(),
  category: z.enum(PAYMENT_CATEGORY_VALUES as [string, ...string[]]).optional(),
  paymentSource: z.enum(PAYMENT_SOURCE_VALUES as [string, ...string[]]).optional(),
  paymentMethod: z.enum(PAYMENT_METHOD_VALUES as [string, ...string[]]).optional(),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(["today", "week", "month", "quarter", "year"]).optional(),
  days: z.coerce.number().int().positive().optional(),
});

export type PaymentQueryParams = z.infer<typeof paymentQuerySchema>;