let transactionIdCounter = 0;
let counterInitialized = false;

const initializeCounter = async () => {
  if (counterInitialized) return;
  const { Payment } = await import("@/modules/payments/index.js");
  const lastPayment = await Payment.findOne({}, { transactionId: 1 }).sort({ createdAt: -1 }).lean();
  if (lastPayment?.transactionId) {
    const match = lastPayment.transactionId.match(/TXN-(\d+)/);
    if (match && match[1]) {
      transactionIdCounter = parseInt(match[1], 10);
    }
  }
  counterInitialized = true;
};

export const generateTransactionId = async () => {
  await initializeCounter();
  transactionIdCounter++;
  return `TXN-${String(transactionIdCounter).padStart(6, "0")}`;
};

export const formatPaymentAmount = (amount: number, direction: "credit" | "debit"): string => {
  const sign = direction === "credit" ? "+" : "-";
  return `${sign}₹${amount.toLocaleString("en-IN")}`;
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case "Completed":
      return "green";
    case "Pending":
      return "yellow";
    case "Rejected":
      return "red";
    case "Refunded":
      return "blue";
    default:
      return "gray";
  }
};

export const getPaymentDirectionIcon = (direction: "credit" | "debit"): string => {
  return direction === "credit" ? "arrow-up" : "arrow-down";
};