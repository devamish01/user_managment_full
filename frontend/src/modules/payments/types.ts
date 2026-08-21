/**
 * Payments Module Types
 * Domain-specific types for the Payments feature.
 */

export type PaymentStatus = "Pending" | "Completed" | "Rejected" | "Refunded";
export type PaymentDirection = "credit" | "debit";
export type PaymentCategory = "Donation" | "Giveaway" | "Event" | "Charity" | "Manual" | "Refund" | "Other";
export type PaymentSource = "ADMIN_ADDED" | "USER_PAYMENT" | "GATEWAY" | "SYSTEM";
export type PaymentMethod = "PhonePe" | "Google Pay" | "UPI" | "Bank Transfer" | "Cash" | "Other";

export interface PaymentCreatedByInfo {
  id?: string;
  name: string;
  role: string;

}

export interface PaymentTimelineChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface PaymentTimelineEntry {
  label: string;
  timestamp: string;
  actor?: string;
  actorRole?: string;
  description?: string;
  // Legacy fields for backward compatibility
  field?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  // New grouped changes format
  changes?: PaymentTimelineChange[];
}



export interface PaymentRecord {
  transactionId: string;
  userId: string;
  userName: string;
  amount: number;
  direction: PaymentDirection;
  status: PaymentStatus;
  category: PaymentCategory;
  paymentSource: PaymentSource;
  paymentMethod: PaymentMethod;
  utrNumber: string;
  screenshotUrl?: string | null;
  notes: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  createdByInfo: PaymentCreatedByInfo;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  verificationNotes?: string | null;
  timeline?: PaymentTimelineEntry[];
  // Audit fields
  isModified?: boolean;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
}

export interface PaymentFormState {
  userId: string;
  amount: number;
  direction: PaymentDirection;
  status: PaymentStatus;
  category: PaymentCategory;
  paymentSource: PaymentSource;
  paymentMethod: PaymentMethod;
  utrNumber: string;
  notes: string;
  paymentDate: string;
}

export type PaymentListTab = "all" | "pending" | "completed" | "rejected" | "refunded" | "credit" | "debit";