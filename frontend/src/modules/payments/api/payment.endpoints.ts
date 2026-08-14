/**
 * Payments module endpoint registry.
 * Contains only URL definitions — no HTTP logic, no business logic.
 */

export const PAYMENTS = "/payments";
export const PAYMENT_DETAILS = (id: string) => `/payments/${id}`;
export const PAYMENT_TRANSACTIONS = "/payments/transactions";
export const PAYMENT_TRANSACTION_DETAILS = (id: string) => `/payments/transactions/${id}`;
// export const PAYMENT_TRANSACTION_HISTORY = (id: string) => `/payments/transactions/${id}/history`;
