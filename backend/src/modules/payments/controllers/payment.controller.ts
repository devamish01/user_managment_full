import type { Request, Response } from "express";
import type { AuthRequest } from "@/shared/middlewares/auth.middleware.js";
import { successResponse, createdResponse } from "@/shared/response/index.js";
import { PAYMENT_MESSAGES } from "@/modules/payments/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { getPayments, getPaymentById, createPayment, updatePayment, deletePayment, approvePayment, rejectPayment, getTransactions, getTransactionById } from "@/modules/payments/index.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { createPaymentSchema, updatePaymentSchema, paymentQuerySchema, transactionIdParamSchema } from "@/modules/payments/index.js";
import type { PaymentRecord } from "@/modules/payments/index.js";

export const getPaymentsController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const result = await getPayments(req.query as any);

    return successResponse<PaymentRecord[]>({
      res,
      message: PAYMENT_MESSAGES.FETCH_SUCCESS,
      data: result.data,
      meta: {
        pagination: result.pagination,
        stats: result.stats,
      },
    });
  },
);

export const getPaymentByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const payment = await getPaymentById(req.params.id as string);

    return successResponse<PaymentRecord>({
      res,
      message: PAYMENT_MESSAGES.FETCH_ONE_SUCCESS,
      data: payment,
    });
  },
);

export const createPaymentController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const payment = await createPayment(req.body, req.user?.userId);

    return createdResponse<PaymentRecord>({
      res,
      message: PAYMENT_MESSAGES.CREATE_SUCCESS,
      data: payment,
    });
  },
);

export const updatePaymentController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const payment = await updatePayment(req.params.id as string, req.body, req.user?.userId, req.user?.role);

    return successResponse<PaymentRecord>({
      res,
      message: PAYMENT_MESSAGES.UPDATE_SUCCESS,
      data: payment,
    });
  },
);

export const deletePaymentController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    await deletePayment(req.params.id as string, req.user?.role);

    return successResponse({
      res,
      message: PAYMENT_MESSAGES.DELETE_SUCCESS,
      data: { ok: true },
    });
  },
);

export const approvePaymentController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const { verificationNotes } = req.body;
    const payment = await approvePayment(req.params.id as string, req.user?.userId || "SYSTEM", verificationNotes);

    return successResponse<PaymentRecord>({
      res,
      message: "Payment approved successfully",
      data: payment,
    });
  },
);

export const rejectPaymentController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const { verificationNotes } = req.body;
    const payment = await rejectPayment(req.params.id as string, req.user?.userId || "SYSTEM", verificationNotes);

    return successResponse<PaymentRecord>({
      res,
      message: "Payment rejected successfully",
      data: payment,
    });
  },
);

export const getTransactionsController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const result = await getTransactions(req.query as any);

    return successResponse<PaymentRecord[]>({
      res,
      message: PAYMENT_MESSAGES.FETCH_SUCCESS,
      data: result.data,
      meta: {
        pagination: result.pagination,
        stats: result.stats,
      },
    });
  },
);

export const getTransactionByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const transaction = await getTransactionById(req.params.id as string);

    return successResponse<PaymentRecord>({
      res,
      message: PAYMENT_MESSAGES.FETCH_ONE_SUCCESS,
      data: transaction,
    });
  },
);