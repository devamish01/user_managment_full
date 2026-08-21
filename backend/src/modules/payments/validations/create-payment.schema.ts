import { z } from "zod";
import {
  PAYMENT_STATUS_VALUES,
  PAYMENT_DIRECTION_VALUES,
  PAYMENT_CATEGORY_VALUES,
  PAYMENT_SOURCE_VALUES,
  PAYMENT_METHOD_VALUES,
} from "@/modules/payments/constants/payment.constants.js";

export const createPaymentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().positive("Amount must be positive"),
  direction: z.enum(PAYMENT_DIRECTION_VALUES as [string, ...string[]]),
  status: z.enum(PAYMENT_STATUS_VALUES as [string, ...string[]]).default("Pending"),
  category: z.enum(PAYMENT_CATEGORY_VALUES as [string, ...string[]]),
  paymentSource: z.enum(PAYMENT_SOURCE_VALUES as [string, ...string[]]),
  paymentMethod: z.enum(PAYMENT_METHOD_VALUES as [string, ...string[]]),
  utrNumber: z.string().trim().min(1, "UTR number is required").max(50),
  screenshotUrl: z.string().url("Invalid URL format").optional().nullable(),
  notes: z.string().optional(),
  paymentDate: z.string().datetime("Invalid date format"),
  createdByInfo: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Created by name is required"),
    role: z.string().min(1, "Created by role is required"),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;