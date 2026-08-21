import { Payment } from "@/modules/payments/index.js";
import { PAYMENT_STATUS, PAYMENT_DIRECTION, PAYMENT_CATEGORY, PAYMENT_SOURCE, PAYMENT_METHOD } from "@/modules/payments/index.js";
import { generateTransactionId } from "@/modules/payments/utils/index.js";

const seedPayments = async () => {
  const existingCount = await Payment.countDocuments();
  if (existingCount > 0) {
    console.log("Payments already seeded, skipping...");
    return;
  }

  const payments = [
    {
      transactionId: await generateTransactionId(),
      userId: "USR-00002",
      amount: 5000,
      direction: PAYMENT_DIRECTION.CREDIT,
      status: PAYMENT_STATUS.COMPLETED,
      category: PAYMENT_CATEGORY.DONATION,
      paymentSource: PAYMENT_SOURCE.ADMIN_ADDED,
      paymentMethod: PAYMENT_METHOD.UPI,
      utrNumber: "UTR2024081512345",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=60",
      notes: "Monthly recurring donation towards the education fund.",
      paymentDate: new Date("2024-08-15T09:00:00Z"),
      createdByInfo: { name: "Rohit Verma", role: "Admin" },
      verifiedBy: "Priya Nair",
      verifiedAt: new Date("2024-08-15T11:10:00Z"),
      verificationNotes: "UTR matched bank statement. Screenshot verified.",
      timeline: [
        { label: "Payment Created", timestamp: new Date("2024-08-15T09:32:00Z"), actor: "Rohit Verma", actorRole: "Admin" },
        { label: "Edited", timestamp: new Date("2024-08-15T09:45:00Z"), actor: "Rohit Verma", actorRole: "Admin", description: "Updated UTR number" },
        { label: "Pending Verification", timestamp: new Date("2024-08-15T09:45:00Z") },
        { label: "Verification Completed", timestamp: new Date("2024-08-15T11:10:00Z"), actor: "Priya Nair", actorRole: "Finance" },
        { label: "Approved", timestamp: new Date("2024-08-15T11:10:00Z"), actor: "Priya Nair", actorRole: "Finance" },
      ],
    },
    {
      transactionId: await generateTransactionId(),
      userId: "USR-00004",
      amount: 2500,
      direction: PAYMENT_DIRECTION.CREDIT,
      status: PAYMENT_STATUS.PENDING,
      category: PAYMENT_CATEGORY.GIVEAWAY,
      paymentSource: PAYMENT_SOURCE.GATEWAY,
      paymentMethod: PAYMENT_METHOD.PHONEPE,
      utrNumber: "UTR2024081609876",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=60",
      notes: "Giveaway entry fee for summer contest.",
      paymentDate: new Date("2024-08-16T14:00:00Z"),
      createdByInfo: { name: "Rohit Verma", role: "Admin" },
      timeline: [
        { label: "Payment Created", timestamp: new Date("2024-08-16T14:20:00Z"), actor: "Rohit Verma", actorRole: "Admin" },
        { label: "Pending Verification", timestamp: new Date("2024-08-16T14:20:00Z") },
      ],
    },
    {
      transactionId: await generateTransactionId(),
      userId: "USR-00001",
      amount: 10000,
      direction: PAYMENT_DIRECTION.DEBIT,
      status: PAYMENT_STATUS.COMPLETED,
      category: PAYMENT_CATEGORY.EVENT,
      paymentSource: PAYMENT_SOURCE.ADMIN_ADDED,
      paymentMethod: PAYMENT_METHOD.BANK_TRANSFER,
      utrNumber: "UTR2024081745678",
      screenshotUrl: null,
      notes: "Event venue payment for annual conference.",
      paymentDate: new Date("2024-08-17T09:00:00Z"),
      createdByInfo: { name: "Manager User", role: "Manager" },
      verifiedBy: "Priya Nair",
      verifiedAt: new Date("2024-08-17T10:30:00Z"),
      verificationNotes: "Invoice verified. Payment released.",
      timeline: [
        { label: "Payment Created", timestamp: new Date("2024-08-17T09:15:00Z"), actor: "Manager User", actorRole: "Manager" },
        { label: "Pending Verification", timestamp: new Date("2024-08-17T09:15:00Z") },
        { label: "Verification Completed", timestamp: new Date("2024-08-17T10:30:00Z"), actor: "Priya Nair", actorRole: "Finance" },
        { label: "Approved", timestamp: new Date("2024-08-17T10:30:00Z"), actor: "Priya Nair", actorRole: "Finance" },
      ],
    },
  ];

  await Payment.insertMany(payments);
  console.log(`Seeded ${payments.length} payments`);
};

export { seedPayments };