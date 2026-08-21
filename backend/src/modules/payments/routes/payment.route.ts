import { Router } from "express";
import {
  getPaymentsController,
  getPaymentByIdController,
  createPaymentController,
  updatePaymentController,
  deletePaymentController,
  approvePaymentController,
  rejectPaymentController,
  getTransactionsController,
  getTransactionByIdController,
} from "@/modules/payments/index.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { authMiddleware } from "@/shared/middlewares/index.js";
import { createPaymentSchema, updatePaymentSchema, paymentQuerySchema, transactionIdParamSchema } from "@/modules/payments/index.js";

export const paymentRoutes = Router();

// Payment routes
paymentRoutes.get(
  "/",
  authMiddleware,
  validate({ query: paymentQuerySchema }),
  getPaymentsController,
);

paymentRoutes.post(
  "/",
  authMiddleware,
  validate({ body: createPaymentSchema }),
  createPaymentController,
);

// Transaction routes - MUST come before /:id to avoid route collision
paymentRoutes.get(
  "/transactions",
  authMiddleware,
  validate({ query: paymentQuerySchema }),
  getTransactionsController,
);

paymentRoutes.get(
  "/transactions/:id",
  authMiddleware,
  validate({ params: transactionIdParamSchema }),
  getTransactionByIdController,
);

paymentRoutes.get(
  "/:id",
  authMiddleware,
  validate({ params: transactionIdParamSchema }),
  getPaymentByIdController,
);

paymentRoutes.put(
  "/:id",
  authMiddleware,
  validate({ params: transactionIdParamSchema, body: updatePaymentSchema }),
  updatePaymentController,
);

paymentRoutes.patch(
  "/:id",
  authMiddleware,
  validate({ params: transactionIdParamSchema, body: updatePaymentSchema }),
  updatePaymentController,
);

paymentRoutes.delete(
  "/:id",
  authMiddleware,
  validate({ params: transactionIdParamSchema }),
  deletePaymentController,
);

paymentRoutes.post(
  "/:id/approve",
  authMiddleware,
  validate({ params: transactionIdParamSchema }),
  approvePaymentController,
);

paymentRoutes.post(
  "/:id/reject",
  authMiddleware,
  validate({ params: transactionIdParamSchema }),
  rejectPaymentController,
);