import { z } from "zod";
import {
  PAYMENT_STATUS_VALUES,
  PAYMENT_DIRECTION_VALUES,
  PAYMENT_CATEGORY_VALUES,
  PAYMENT_SOURCE_VALUES,
  PAYMENT_METHOD_VALUES,
} from "@/modules/payments/constants/payment.constants.js";

export const updatePaymentSchema = z.object({
  userId: z.string().optional(),
  amount: z.number().positive("Amount must be positive").optional(),
  direction: z.enum(PAYMENT_DIRECTION_VALUES as [string, ...string[]]).optional(),
  status: z.enum(PAYMENT_STATUS_VALUES as [string, ...string[]]).optional(),
  category: z.enum(PAYMENT_CATEGORY_VALUES as [string, ...string[]]).optional(),
  paymentSource: z.enum(PAYMENT_SOURCE_VALUES as [string, ...string[]]).optional(),
  paymentMethod: z.enum(PAYMENT_METHOD_VALUES as [string, ...string[]]).optional(),
  utrNumber: z.string().max(50).optional(),
  screenshotUrl: z.string().url("Invalid URL format").optional().nullable(),
  notes: z.string().optional(),
  paymentDate: z.string().datetime("Invalid date format").optional(),
  createdByInfo: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    role: z.string().optional(),
  }).optional(),
  correctionReason: z.string().optional(),
});

export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;