export const PAYMENT_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  REFUNDED: "Refunded",
} as const;

export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

export const PAYMENT_DIRECTION = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

export const PAYMENT_DIRECTION_VALUES = Object.values(PAYMENT_DIRECTION);

export const PAYMENT_CATEGORY = {
  DONATION: "Donation",
  GIVEAWAY: "Giveaway",
  EVENT: "Event",
  CHARITY: "Charity",
  MANUAL: "Manual",
  REFUND: "Refund",
  OTHER: "Other",
} as const;

export const PAYMENT_CATEGORY_VALUES = Object.values(PAYMENT_CATEGORY);

export const PAYMENT_SOURCE = {
  ADMIN_ADDED: "ADMIN_ADDED",
  USER_PAYMENT: "USER_PAYMENT",
  GATEWAY: "GATEWAY",
  SYSTEM: "SYSTEM",
} as const;

export const PAYMENT_SOURCE_VALUES = Object.values(PAYMENT_SOURCE);

export const PAYMENT_METHOD = {
  PHONEPE: "PhonePe",
  GOOGLE_PAY: "Google Pay",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  OTHER: "Other",
} as const;

export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHOD);

export const PAYMENT_MESSAGES = {
  MODULE_RUNNING: "Payments module is running",
  FETCH_SUCCESS: "Payments retrieved successfully",
  FETCH_ONE_SUCCESS: "Payment retrieved successfully",
  CREATE_SUCCESS: "Payment created successfully",
  UPDATE_SUCCESS: "Payment updated successfully",
  DELETE_SUCCESS: "Payment deleted successfully",
  NOT_FOUND: "Payment not found",
  UTR_EXISTS: "A payment with this UTR number already exists",
  UTR_REQUIRED: "UTR number is required",
  INVALID_STATUS_TRANSITION: "Invalid status transition",
  CANNOT_DELETE_VERIFIED: "Cannot delete a verified payment",
} as const;

