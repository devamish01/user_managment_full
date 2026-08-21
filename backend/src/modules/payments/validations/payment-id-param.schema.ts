import { z } from "zod";

export const transactionIdParamSchema = z.object({
  id: z.string().min(1, "Transaction ID is required"),
});

export type TransactionIdParam = z.infer<typeof transactionIdParamSchema>;