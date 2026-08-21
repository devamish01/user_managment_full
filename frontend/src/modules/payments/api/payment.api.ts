/**
 * Payments module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the Payments
 * endpoint. Services delegate here; consumers of `PaymentService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse } from "@/core/api";
import type { PaymentRecord } from "../types";
import { PAYMENTS, PAYMENT_DETAILS, PAYMENT_TRANSACTIONS, PAYMENT_TRANSACTION_DETAILS } from "./payment.endpoints";

export class PaymentApi {
  static getPayments(userId?: string): Promise<ApiResponse<PaymentRecord[]>> {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    return api.get<PaymentRecord[]>(`${PAYMENTS}${params}`);
  }

  static getPayment(transactionId: string): Promise<ApiResponse<PaymentRecord>> {
    return api.get<PaymentRecord>(PAYMENT_DETAILS(transactionId));
  }

  static createPayment(data: Partial<PaymentRecord>): Promise<ApiResponse<PaymentRecord>> {
    return api.post<PaymentRecord>(PAYMENTS, data);
  }

  static updatePayment(transactionId: string, data: Partial<PaymentRecord>, correctionReason?: string): Promise<ApiResponse<PaymentRecord>> {
    return api.put<PaymentRecord>(PAYMENT_DETAILS(transactionId), { ...data, correctionReason });
  }

  static deletePayment(transactionId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(PAYMENT_DETAILS(transactionId));
  }

  static getTransactions(): Promise<ApiResponse<PaymentRecord[]>> {
    return api.get<PaymentRecord[]>(PAYMENT_TRANSACTIONS);
  }

  static getTransaction(transactionId: string): Promise<ApiResponse<PaymentRecord>> {
    return api.get<PaymentRecord>(PAYMENT_TRANSACTION_DETAILS(transactionId));
  }

  // static getTransactionHistory(id: string): Promise<ApiResponse<ChangeHistoryEntry[]> & { pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
  //   return api.get<ChangeHistoryEntry[]>(PAYMENT_TRANSACTION_HISTORY(id));
  // }
}