/**
 * Payments Store — feature-level state for the Payments module.
 *
 * Follows the same hook-based pattern used by users.store.ts /
 * roles.store.ts / permissions.store.ts.
 */

import * as React from "react";
import type { PaymentRecord, PaymentTimelineEntry } from "../types";
import { PaymentApi } from "../api";
import { getErrorMessage } from "@/core/api/errorUtils";

export interface PaymentsStoreState {
  payments: PaymentRecord[];
  loading: boolean;
  error: string | null;
  getPayments: (userId?: string) => Promise<void>;
  getPaymentsByUserId: (userId: string) => Promise<PaymentRecord[]>;
  getTransactions: () => Promise<void>;
  getPaymentById: (transactionId: string) => Promise<PaymentRecord | null>;
  createPayment: (data: Partial<PaymentRecord>) => Promise<PaymentRecord | null>;
  updatePayment: (transactionId: string, data: Partial<PaymentRecord>, correctionReason?: string) => Promise<PaymentRecord | null>;
  deletePayment: (transactionId: string) => Promise<boolean>;
  approvePayment: (transactionId: string, verifiedBy: string, verificationNotes?: string) => Promise<PaymentRecord | null>;
  rejectPayment: (transactionId: string, verifiedBy: string, verificationNotes?: string) => Promise<PaymentRecord | null>;
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
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.getTransactions();
      if (res.success && res.data) {
        setPayments(res.data);
      } else {
        console.error('Failed to load transactions:', res.message);
        setError(res.message || "Failed to load transactions");
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = React.useCallback(async (transactionId: string, data: Partial<PaymentRecord>, correctionReason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.updatePayment(transactionId, data, correctionReason);
      if (res.success && res.data) {
        setPayments((prev) => prev.map((p) => (p.transactionId === transactionId ? res.data! : p)));
        return res.data;
      } else {
        setError(res.message || "Failed to update payment");
        return null;
      }
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePayment = React.useCallback(async (transactionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.deletePayment(transactionId);
      if (res.success) {
        setPayments((prev) => prev.filter((p) => p.transactionId !== transactionId));
        return true;
      } else {
        setError(res.message || "Failed to delete payment");
        return false;
      }
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentById = React.useCallback(async (transactionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PaymentApi.getTransaction(transactionId);
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

  const approvePayment = React.useCallback(async (transactionId: string, verifiedBy: string, verificationNotes?: string) => {
    setLoading(true);
    setError(null);
    try {
      // First get the current payment to access its timeline
      const currentPayment = payments.find(p => p.transactionId === transactionId);
      const timelineEntries = [...(currentPayment?.timeline || [])] as PaymentTimelineEntry[];
      const now = new Date().toISOString();
      
      // Add timeline entry for verification approval
      timelineEntries.push({
        label: "Verification Approved",
        timestamp: now,
        actor: verifiedBy,
        actorRole: "Finance",
        description: `Verification approved${verificationNotes ? `: ${verificationNotes}` : ""}`,
      });

      const res = await PaymentApi.updatePayment(transactionId, {
        status: "Completed",
        verifiedBy,
        verifiedAt: now,
        verificationNotes,
        timeline: timelineEntries,
      });
      if (res.success && res.data) {
        setPayments((prev) => prev.map((p) => (p.transactionId === transactionId ? res.data! : p)));
        return res.data;
      } else {
        setError(res.message || "Failed to approve payment");
        return null;
      }
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [payments]);

  const rejectPayment = React.useCallback(async (transactionId: string, verifiedBy: string, verificationNotes?: string) => {
    setLoading(true);
    setError(null);
    try {
      // First get the current payment to access its timeline
      const currentPayment = payments.find(p => p.transactionId === transactionId);
      const timelineEntries = [...(currentPayment?.timeline || [])] as PaymentTimelineEntry[];
      const now = new Date().toISOString();
      
      // Add timeline entry for verification rejection
      timelineEntries.push({
        label: "Verification Rejected",
        timestamp: now,
        actor: verifiedBy,
        actorRole: "Finance",
        description: `Verification rejected${verificationNotes ? `: ${verificationNotes}` : ""}`,
      });

      const res = await PaymentApi.updatePayment(transactionId, {
        status: "Rejected",
        verifiedBy,
        verifiedAt: now,
        verificationNotes,
        timeline: timelineEntries,
      });
      if (res.success && res.data) {
        setPayments((prev) => prev.map((p) => (p.transactionId === transactionId ? res.data! : p)));
        return res.data;
      } else {
        setError(res.message || "Failed to reject payment");
        return null;
      }
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [payments]);

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

  return { 
    payments, 
    loading, 
    error, 
    getPayments, 
    getTransactions,
    getPaymentById, 
    createPayment, 
    updatePayment, 
    deletePayment, 
    approvePayment, 
    rejectPayment, 
    getPaymentsByUserId,
  };
};

export default usePaymentsStore;