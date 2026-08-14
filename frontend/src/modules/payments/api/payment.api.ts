/**
 * Payments module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the Payments
 * endpoint. Services delegate here; consumers of `PaymentService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse } from "@/core/api";
import type { PaymentRecord, ChangeHistoryEntry } from "../types";
import { PAYMENTS, PAYMENT_DETAILS, PAYMENT_TRANSACTIONS, PAYMENT_TRANSACTION_DETAILS, PAYMENT_TRANSACTION_HISTORY, PAYMENT_TRANSACTION_ACTIVITY } from "./payment.endpoints";

export class PaymentApi {
  static getPayments(userId?: string): Promise<ApiResponse<PaymentRecord[]>> {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    return api.get<PaymentRecord[]>(`${PAYMENTS}${params}`);
  }

  static getPayment(id: string): Promise<ApiResponse<PaymentRecord>> {
    return api.get<PaymentRecord>(PAYMENT_DETAILS(id));
  }

  static createPayment(data: Partial<PaymentRecord>): Promise<ApiResponse<PaymentRecord>> {
    return api.post<PaymentRecord>(PAYMENTS, data);
  }

  static updatePayment(id: string, data: Partial<PaymentRecord>, correctionReason?: string): Promise<ApiResponse<PaymentRecord>> {
    return api.put<PaymentRecord>(PAYMENT_DETAILS(id), { ...data, correctionReason });
  }

  static deletePayment(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(PAYMENT_DETAILS(id));
  }

  static getTransactions(): Promise<ApiResponse<PaymentRecord[]>> {
    return api.get<PaymentRecord[]>(PAYMENT_TRANSACTIONS);
  }

  static getTransaction(id: string): Promise<ApiResponse<PaymentRecord>> {
    return api.get<PaymentRecord>(PAYMENT_TRANSACTION_DETAILS(id));
  }

  // static getTransactionHistory(id: string): Promise<ApiResponse<ChangeHistoryEntry[]> & { pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
  //   return api.get<ChangeHistoryEntry[]>(PAYMENT_TRANSACTION_HISTORY(id));
  // }


}