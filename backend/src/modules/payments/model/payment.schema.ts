import { Schema, Types } from "mongoose";
import {
  PAYMENT_STATUS_VALUES,
  PAYMENT_DIRECTION_VALUES,
  PAYMENT_CATEGORY_VALUES,
  PAYMENT_SOURCE_VALUES,
  PAYMENT_METHOD_VALUES,
  PAYMENT_STATUS,
} from "@/modules/payments/constants/payment.constants.js";

export interface IPaymentTimelineChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface IPaymentTimelineEntry {
  label: string;
  timestamp: Date;
  actor?: string;
  actorRole?: string;
  description?: string;
  // Legacy fields for backward compatibility
  field?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  // New grouped changes format
  changes?: IPaymentTimelineChange[];
}

export interface IPaymentCreatedByInfo {
  id?: string;
  name: string;
  role: string;
}

export interface IPayment {
  transactionId: string;
  userId: string;
  amount: number;
  direction: typeof PAYMENT_DIRECTION_VALUES[number];
  status: typeof PAYMENT_STATUS_VALUES[number];
  category: typeof PAYMENT_CATEGORY_VALUES[number];
  paymentSource: typeof PAYMENT_SOURCE_VALUES[number];
  paymentMethod: typeof PAYMENT_METHOD_VALUES[number];
  utrNumber: string;
  screenshotUrl?: string | null;
  notes: string;
  paymentDate: Date;
  createdByInfo: IPaymentCreatedByInfo;
  verifiedBy?: string | null;
  verifiedAt?: Date | null;
  verificationNotes?: string | null;
  timeline?: IPaymentTimelineEntry[];
  isEdited?: boolean;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const paymentSchema = new Schema<IPayment>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    direction: {
      type: String,
      required: true,
      enum: PAYMENT_DIRECTION_VALUES,
    },
    status: {
      type: String,
      required: true,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUS.PENDING,
    },
    category: {
      type: String,
      required: true,
      enum: PAYMENT_CATEGORY_VALUES,
    },
    paymentSource: {
      type: String,
      required: true,
      enum: PAYMENT_SOURCE_VALUES,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: PAYMENT_METHOD_VALUES,
    },
    utrNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    screenshotUrl: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    createdByInfo: {
      id: { type: String, default: "" },
      name: { type: String, required: true },
      role: { type: String, required: true },
    },
    verifiedBy: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verificationNotes: {
      type: String,
      default: null,
    },
    timeline: [
      {
        label: { type: String, required: true },
        timestamp: { type: Date, required: true },
        actor: { type: String, default: "" },
        actorRole: { type: String, default: "" },
        description: { type: String, default: "" },
        field: { type: String, default: "" },
        oldValue: { type: String, default: "" },
        newValue: { type: String, default: "" },
        reason: { type: String, default: "" },
        changes: [
          {
            field: { type: String, required: true },
            oldValue: { type: String, required: true },
            newValue: { type: String, required: true },
          },
        ],
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    lastModifiedAt: {
      type: Date,
      default: null,
    },
    lastModifiedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for common queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ direction: 1, createdAt: -1 });
paymentSchema.index({ category: 1, createdAt: -1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ utrNumber: 1 }, { unique: true });