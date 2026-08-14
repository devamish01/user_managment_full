/**
 * Payments Store — feature-level state for the Payments module.
 *
 * Follows the same hook-based pattern used by users.store.ts /
 * roles.store.ts / permissions.store.ts.
 */

import * as React from "react";
import type { PaymentRecord } from "../types";
import { PaymentApi } from "../api";

export interface PaymentsStoreState {
  payments: PaymentRecord[];
  loading: boolean;
  error: string | null;
  getPayments: (userId?: string) => Promise<void>;
  getPaymentsByUserId: (userId: string) => Promise<PaymentRecord[]>;
  getPaymentById: (id: string) => Promise<PaymentRecord | null>;
  createPayment: (data: Partial<PaymentRecord>) => Promise<PaymentRecord | null>;
  updatePayment: (id: string, data: Partial<PaymentRecord>, correctionReason?: string) => Promise<PaymentRecord | null>;
  deletePayment: (id: string) => Promise<boolean>;
  approvePayment: (id: string, verifiedBy: string, verificationNotes?: string) => Promise<PaymentRecord | null>;
  rejectPayment: (id: string, verifiedBy: string, verificationNotes?: string) => Promise<PaymentRecord | null>;
  // getTransactionHistory: (id: string, params?: { page?: number; limit?: number; search?: string; filter?: string; sort?: string }) => Promise<{ data: ChangeHistoryEntry[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }>;
}

export const usePaymentsStore = (): PaymentsStoreState => {
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getPayments = React.useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.getPayments(userId);
      if (res.success && res.data) {
        setPayments(res.data);
      } else {
        console.error('Failed to load payments:', res.message);
        setError(res.message || "Failed to load payments");
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentsByUserId = React.useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.getPayments(userId);
      if (res.success && res.data) {
        return res.data;
      } else {
        console.error('Failed to load payments:', res.message);
        setError(res.message || "Failed to load payments");
        return [];
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : "Failed to load payments");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = React.useCallback(async (data: Partial<PaymentRecord>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.createPayment(data);
      if (res.success && res.data) {
        setPayments((prev) => [res.data!, ...prev]);
        return res.data;
      } else {
        setError(res.message || "Failed to create payment");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create payment");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = React.useCallback(async (id: string, data: Partial<PaymentRecord>, correctionReason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.updatePayment(id, data, correctionReason);
      if (res.success && res.data) {
        setPayments((prev) => prev.map((p) => (p.id === id ? res.data! : p)));
        return res.data;
      } else {
        setError(res.message || "Failed to update payment");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePayment = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.deletePayment(id);
      if (res.success) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
        return true;
      } else {
        setError(res.message || "Failed to delete payment");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete payment");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentById = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.getTransaction(id);
      if (res.success && res.data) {
        return res.data;
      } else {
        setError(res.message || "Failed to load transaction");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transaction");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approvePayment = React.useCallback(async (id: string, verifiedBy: string, verificationNotes?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.updatePayment(id, {
        status: "Completed",
        verifiedBy,
        verifiedAt: new Date().toISOString(),
        verificationNotes,
      });
      if (res.success && res.data) {
        setPayments((prev) => prev.map((p) => (p.id === id ? res.data! : p)));
        return res.data;
      } else {
        setError(res.message || "Failed to approve payment");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve payment");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectPayment = React.useCallback(async (id: string, verifiedBy: string, verificationNotes?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.updatePayment(id, {
        status: "Rejected",
        verifiedBy,
        verifiedAt: new Date().toISOString(),
        verificationNotes,
      });
      if (res.success && res.data) {
        setPayments((prev) => prev.map((p) => (p.id === id ? res.data! : p)));
        return res.data;
      } else {
        setError(res.message || "Failed to reject payment");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject payment");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // const getTransactionHistory = React.useCallback(async (id: string, params?: { page?: number; limit?: number; search?: string; filter?: string; sort?: string }) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await PaymentApi.getTransactionHistory(id, params);
  //     if (res.success && res.data) {
  //       return { data: res.data, pagination: res.pagination };
  //     } else {
  //       setError(res.message || "Failed to load transaction history");
  //       return { data: [], pagination: undefined };
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to load transaction history");
  //     return { data: [], pagination: undefined };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);


  // const getActivityLog = React.useCallback(async (id: string, params?: { page?: number; limit?: number; search?: string; filter?: string; sort?: string }) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await PaymentApi.getActivityLog(id, params);
  //     if (res.success && res.data) {
  //       return { data: res.data, pagination: res.pagination };
  //     } else {
  //       setError(res.message || "Failed to load activity log");
  //       return { data: [], pagination: undefined };
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to load activity log");
  //     return { data: [], pagination: undefined };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  return { payments, loading, error, getPayments, getPaymentById, createPayment, updatePayment, deletePayment, approvePayment, rejectPayment, getPaymentsByUserId };
};

export default usePaymentsStore;