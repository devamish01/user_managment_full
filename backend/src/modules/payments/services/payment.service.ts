import { isValidObjectId } from "mongoose";
import { Payment } from "@/modules/payments/index.js";
import { User } from "@/modules/users/index.js";
import { PAYMENT_MESSAGES, PAYMENT_STATUS, PAYMENT_DIRECTION } from "@/modules/payments/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { PaymentQueryParams } from "@/modules/payments/index.js";
import type { CreatePaymentInput } from "@/modules/payments/index.js";
import type { UpdatePaymentInput } from "@/modules/payments/index.js";
import { getDateRangeFromPeriod } from "@/shared/utils/index.js";
import { generateTransactionId } from "@/modules/payments/utils/index.js";

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: {
    total: number;
    totalIn: number;
    totalOut: number;
    pending: number;
    completed: number;
    rejected: number;
    refunded: number;
  };
}

const toIsoString = (value: unknown) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const buildPaymentQueryById = (id: string) => {
  if (isValidObjectId(id)) {
    return { $or: [{ _id: id }, { transactionId: id }] };
  }
  // Check if it's a transactionId format (TXN-...)
  if (id.startsWith('TXN-')) {
    return { transactionId: id };
  }
  return { transactionId: id };
};

/**
 * Lightweight transform for list API - only essential fields + userId + userName
 */
const transformPaymentListItem = (payment: any, userName: string) => {
  return {
    transactionId: payment.transactionId,
    userId: payment.userId,
    userName,
    amount: payment.amount,
    direction: payment.direction,
    status: payment.status,
    category: payment.category,
    paymentSource: payment.paymentSource,
    paymentMethod: payment.paymentMethod,
    utrNumber: payment.utrNumber,
    paymentDate: payment.paymentDate instanceof Date ? payment.paymentDate.toISOString() : payment.paymentDate,
  };
};

/**
 * Detailed transform for detail API - all payment fields + userId + userName
 */
const transformPaymentDetail = (payment: any, userName: string) => {
  return {
    transactionId: payment.transactionId,
    userId: payment.userId,
    userName,
    amount: payment.amount,
    direction: payment.direction,
    status: payment.status,
    category: payment.category,
    paymentSource: payment.paymentSource,
    paymentMethod: payment.paymentMethod,
    utrNumber: payment.utrNumber,
    screenshotUrl: payment.screenshotUrl,
    notes: payment.notes,
    paymentDate: payment.paymentDate instanceof Date ? payment.paymentDate.toISOString() : payment.paymentDate,
    createdAt: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : payment.createdAt,
    updatedAt: payment.updatedAt instanceof Date ? payment.updatedAt.toISOString() : payment.updatedAt,
    createdByInfo: payment.createdByInfo,
    verifiedBy: payment.verifiedBy,
    verifiedAt: payment.verifiedAt instanceof Date ? payment.verifiedAt.toISOString() : payment.verifiedAt,
    verificationNotes: payment.verificationNotes,
    timeline: payment.timeline?.map((t: any) => ({
      label: t.label,
      timestamp: t.timestamp instanceof Date ? t.timestamp.toISOString() : t.timestamp,
      actor: t.actor,
      actorRole: t.actorRole,
      description: t.description,
      field: t.field,
      oldValue: t.oldValue,
      newValue: t.newValue,
      reason: t.reason,
      changes: t.changes?.map((c: any) => ({
        field: c.field,
        oldValue: c.oldValue,
        newValue: c.newValue,
      })) || [],
    })) || [],
    isModified: payment.isEdited,
    lastModifiedAt: payment.lastModifiedAt instanceof Date ? payment.lastModifiedAt.toISOString() : payment.lastModifiedAt,
    lastModifiedBy: payment.lastModifiedBy,
  };
};

/**
 * Resolve user names for a list of payments
 */
const resolveUserNames = async (payments: any[]) => {
  const userIds = Array.from(new Set(payments.map(p => p.userId).filter(Boolean)));
  if (!userIds.length) return {};
  
  const users = await User.find({ userId: { $in: userIds } }).select('userId firstName lastName').lean();
  return users.reduce((map: Record<string, string>, user: any) => {
    map[user.userId] = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return map;
  }, {} as Record<string, string>);
};

/**
 * Resolve single user name
 */
const resolveUserName = async (userId: string) => {
  if (!userId) return "";
  const user = await User.findOne({ userId }).select('firstName lastName').lean();
  return user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";
};

export const getPayments = async (params: PaymentQueryParams): Promise<PaginatedResult<any>> => {
  const {
    page = 1,
    limit = 20,
    search,
    sort = "createdAt",
    order = "desc",
    status,
    direction,
    category,
    paymentSource,
    paymentMethod,
    userId,
  } = params;

  const query: any = {};

  // Search
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    query.$or = [
      { utrNumber: searchRegex },
      { notes: searchRegex },
    ];
  }

  // Filters
  if (status) query.status = status;
  if (direction) query.direction = direction;
  if (category) query.category = category;
  if (paymentSource) query.paymentSource = paymentSource;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (userId) query.userId = userId;

  // Period / Date range filtering
  const startDateParam = (params as any).startDate;
  const endDateParam = (params as any).endDate;
  const periodParam = (params as any).period;
  const daysParam = Number((params as any).days) || undefined;

  let startIso: string | null = null;
  let endIso: string | null = null;

  if (startDateParam || endDateParam) {
    if (startDateParam) startIso = new Date(startDateParam).toISOString();
    if (endDateParam) {
      const d = new Date(endDateParam);
      d.setHours(23, 59, 59, 999);
      endIso = d.toISOString();
    }
  } else if (periodParam) {
    const range = getDateRangeFromPeriod(periodParam as any, daysParam);
    if (range) {
      startIso = range.startDate;
      endIso = range.endDate;
    }
  }

  if (startIso || endIso) {
    query.paymentDate = {} as any;
    if (startIso) query.paymentDate.$gte = new Date(startIso);
    if (endIso) query.paymentDate.$lte = new Date(endIso);
  }

  // Sort
  const sortOrder = order === "asc" ? 1 : -1;
  const sortObj: any = { [sort]: sortOrder };

  // Pagination
  const skip = (page - 1) * limit;

  // Execute queries
  const [payments, total] = await Promise.all([
    Payment.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
    Payment.countDocuments(query),
  ]);

  // Resolve user names
  const userNameMap = await resolveUserNames(payments);
  const transformedPayments = payments.map(payment => transformPaymentListItem(payment, userNameMap[payment.userId] || ""));

  // Stats
  const [totalCount, totalIn, totalOut, pendingCount, completedCount, rejectedCount, refundedCount] = await Promise.all([
    Payment.countDocuments(),
    Payment.aggregate([
      { $match: { direction: PAYMENT_DIRECTION.CREDIT } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      { $match: { direction: PAYMENT_DIRECTION.DEBIT } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.countDocuments({ status: PAYMENT_STATUS.PENDING }),
    Payment.countDocuments({ status: PAYMENT_STATUS.COMPLETED }),
    Payment.countDocuments({ status: PAYMENT_STATUS.REJECTED }),
    Payment.countDocuments({ status: PAYMENT_STATUS.REFUNDED }),
  ]);

  return {
    data: transformedPayments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      total: totalCount,
      totalIn: totalIn[0]?.total || 0,
      totalOut: totalOut[0]?.total || 0,
      pending: pendingCount,
      completed: completedCount,
      rejected: rejectedCount,
      refunded: refundedCount,
    },
  };
};

export const getPaymentById = async (id: string) => {
  const payment = await Payment.findOne(buildPaymentQueryById(id)).lean();
  if (!payment) {
    throw new AppError({
      message: PAYMENT_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PAYMENT_NOT_FOUND",
    });
  }

  const userName = await resolveUserName(payment.userId);
  return transformPaymentDetail(payment, userName);
};

export const createPayment = async (data: CreatePaymentInput, createdByUserId?: string) => {
  // Check if UTR number is provided and not empty
  const trimmedUtrNumber = data.utrNumber?.trim();
  if (!trimmedUtrNumber) {
    throw new AppError({
      message: PAYMENT_MESSAGES.UTR_REQUIRED,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: "UTR_REQUIRED",
    });
  }

  // Check if UTR number exists
  const existingPayment = await Payment.findOne({ utrNumber: trimmedUtrNumber });
  if (existingPayment) {
    throw new AppError({
      message: PAYMENT_MESSAGES.UTR_EXISTS,
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: "UTR_EXISTS",
    });
  }

  const newPaymentPayload = {
    transactionId: await generateTransactionId(),
    userId: data.userId,
    amount: data.amount,
    direction: data.direction,
    status: data.status,
    category: data.category,
    paymentSource: data.paymentSource,
    paymentMethod: data.paymentMethod,
    utrNumber: trimmedUtrNumber,
    screenshotUrl: data.screenshotUrl,
    notes: data.notes,
    paymentDate: new Date(data.paymentDate),
    createdByInfo: {
      id: createdByUserId || data.createdByInfo.id,
      name: data.createdByInfo.name,
      role: data.createdByInfo.role,
    },
    timeline: [
      {
        label: "Payment Created",
        timestamp: new Date(),
        actor: data.createdByInfo.name,
        actorRole: data.createdByInfo.role,
      },
    ],
  };

  const payment = await Payment.create(newPaymentPayload as any);

  const userName = await resolveUserName(payment.userId);
  return transformPaymentDetail(payment.toObject(), userName);
};

export const updatePayment = async (id: string, data: UpdatePaymentInput, updatedByUserId?: string, updatedByUserRole?: string) => {
  // Check if UTR number is being changed and if it already exists
  if (data.utrNumber) {
    const existingPayment = await Payment.findOne({
      utrNumber: data.utrNumber,
      $nor: [buildPaymentQueryById(id)],
    });
    if (existingPayment) {
      throw new AppError({
        message: PAYMENT_MESSAGES.UTR_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "UTR_EXISTS",
      });
    }
  }

  const foundPayment = await Payment.findOne(buildPaymentQueryById(id));
  if (!foundPayment) {
    throw new AppError({
      message: PAYMENT_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PAYMENT_NOT_FOUND",
    });
  }

  // Track changes for timeline
  const timelineEntries: any[] = [];
  const now = new Date();

  // Check status transition validity
  if (data.status && data.status !== foundPayment.status) {
    const validTransitions: Record<string, string[]> = {
      [PAYMENT_STATUS.PENDING]: [PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.REJECTED],
      [PAYMENT_STATUS.COMPLETED]: [PAYMENT_STATUS.REFUNDED],
      [PAYMENT_STATUS.REJECTED]: [],
      [PAYMENT_STATUS.REFUNDED]: [],
    };

    const allowed = validTransitions[foundPayment.status] || [];
    if (!allowed.includes(data.status)) {
      throw new AppError({
        message: PAYMENT_MESSAGES.INVALID_STATUS_TRANSITION,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errorCode: "INVALID_STATUS_TRANSITION",
      });
    }

    // Status change is a separate timeline entry
    timelineEntries.push({
      label: `Status Changed: ${foundPayment.status} → ${data.status}`,
      timestamp: now,
      actor: updatedByUserId || "SYSTEM",
      actorRole: updatedByUserRole || "SYSTEM",
      description: `Status changed from ${foundPayment.status} to ${data.status}`,
      changes: [
        {
          field: "status",
          oldValue: foundPayment.status,
          newValue: data.status,
        },
      ],
      reason: data.correctionReason,
    });
  }

  // Track other field changes - group them into a single "Transaction Edited" entry
  const trackableFields = [
    "amount", "direction", "category", "paymentSource", "paymentMethod",
    "utrNumber", "screenshotUrl", "notes", "paymentDate"
  ] as const;

  const fieldChanges: any[] = [];
  for (const field of trackableFields) {
    if (data[field] !== undefined && data[field] !== (foundPayment as any)[field]) {
      fieldChanges.push({
        field,
        oldValue: String((foundPayment as any)[field]),
        newValue: String(data[field]),
      });
    }
  }

  if (fieldChanges.length > 0) {
    timelineEntries.push({
      label: "Transaction Edited",
      timestamp: now,
      actor: updatedByUserId || "SYSTEM",
      actorRole: updatedByUserRole || "SYSTEM",
      description: `Updated ${fieldChanges.length} field(s)${data.correctionReason ? ` — Reason: ${data.correctionReason}` : ""}`,
      changes: fieldChanges,
      reason: data.correctionReason,
    });
  }

  // Prepare update data
  const updateData: any = { ...data };

  // Convert paymentDate if provided
  if (data.paymentDate) {
    updateData.paymentDate = new Date(data.paymentDate);
  }

  // Add timeline entries
  if (timelineEntries.length > 0) {
    updateData.timeline = [...(foundPayment.timeline || []), ...timelineEntries];
    updateData.isModified = true;
    updateData.lastModifiedAt = now;
    updateData.lastModifiedBy = updatedByUserId || "SYSTEM";
  }

  // Handle status-specific fields
  if (data.status === PAYMENT_STATUS.COMPLETED && foundPayment.status !== PAYMENT_STATUS.COMPLETED) {
    updateData.verifiedBy = updatedByUserId || "SYSTEM";
    updateData.verifiedAt = now;
    updateData.verificationNotes = data.correctionReason || "Approved";
  } else if (data.status === PAYMENT_STATUS.REJECTED && foundPayment.status !== PAYMENT_STATUS.REJECTED) {
    updateData.verifiedBy = updatedByUserId || "SYSTEM";
    updateData.verifiedAt = now;
    updateData.verificationNotes = data.correctionReason || "Rejected";
  }

  Object.assign(foundPayment, updateData);

  const updatedPayment = await foundPayment.save();

  const userName = await resolveUserName(updatedPayment.userId);
  return transformPaymentDetail(updatedPayment.toObject(), userName);
};

export const deletePayment = async (id: string, requesterRoleId?: string) => {
  const foundPayment = await Payment.findOne(buildPaymentQueryById(id));
  if (!foundPayment) {
    throw new AppError({
      message: PAYMENT_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PAYMENT_NOT_FOUND",
    });
  }

  // Prevent deletion of verified payments
  if (foundPayment.verifiedBy && foundPayment.status === PAYMENT_STATUS.COMPLETED) {
    throw new AppError({
      message: PAYMENT_MESSAGES.CANNOT_DELETE_VERIFIED,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "CANNOT_DELETE_VERIFIED",
    });
  }

  await Payment.findOneAndDelete(buildPaymentQueryById(id));

  return { ok: true };
};

export const approvePayment = async (id: string, verifiedBy: string, verificationNotes?: string) => {
  const foundPayment = await Payment.findOne(buildPaymentQueryById(id));
  if (!foundPayment) {
    throw new AppError({
      message: PAYMENT_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PAYMENT_NOT_FOUND",
    });
  }

  if (foundPayment.status !== PAYMENT_STATUS.PENDING) {
    throw new AppError({
      message: PAYMENT_MESSAGES.INVALID_STATUS_TRANSITION,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: "INVALID_STATUS_TRANSITION",
    });
  }

  const now = new Date();
  foundPayment.status = PAYMENT_STATUS.COMPLETED;
  foundPayment.verifiedBy = verifiedBy;
  foundPayment.verifiedAt = now;
  foundPayment.verificationNotes = verificationNotes || "Approved";
  foundPayment.timeline = [
    ...(foundPayment.timeline || []),
    {
      label: `Status Changed: ${PAYMENT_STATUS.PENDING} → ${PAYMENT_STATUS.COMPLETED}`,
      timestamp: now,
      actor: verifiedBy,
      actorRole: "Finance",
      description: `Status changed from ${PAYMENT_STATUS.PENDING} to ${PAYMENT_STATUS.COMPLETED}`,
      changes: [
        {
          field: "status",
          oldValue: PAYMENT_STATUS.PENDING,
          newValue: PAYMENT_STATUS.COMPLETED,
        },
      ],
      reason: verificationNotes || "",
    },
  ];
  foundPayment.isEdited = true;
  foundPayment.lastModifiedAt = now;
  foundPayment.lastModifiedBy = verifiedBy;

  const updatedPayment = await foundPayment.save();

  const userName = await resolveUserName(updatedPayment.userId);
  return transformPaymentDetail(updatedPayment.toObject(), userName);
};

export const rejectPayment = async (id: string, verifiedBy: string, verificationNotes?: string) => {
  const foundPayment = await Payment.findOne(buildPaymentQueryById(id));
  if (!foundPayment) {
    throw new AppError({
      message: PAYMENT_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PAYMENT_NOT_FOUND",
    });
  }

  if (foundPayment.status !== PAYMENT_STATUS.PENDING) {
    throw new AppError({
      message: PAYMENT_MESSAGES.INVALID_STATUS_TRANSITION,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: "INVALID_STATUS_TRANSITION",
    });
  }

  const now = new Date();
  foundPayment.status = PAYMENT_STATUS.REJECTED;
  foundPayment.verifiedBy = verifiedBy;
  foundPayment.verifiedAt = now;
  foundPayment.verificationNotes = verificationNotes || "Rejected";
  foundPayment.timeline = [
    ...(foundPayment.timeline || []),
    {
      label: `Status Changed: ${PAYMENT_STATUS.PENDING} → ${PAYMENT_STATUS.REJECTED}`,
      timestamp: now,
      actor: verifiedBy,
      actorRole: "Finance",
      description: `Status changed from ${PAYMENT_STATUS.PENDING} to ${PAYMENT_STATUS.REJECTED}`,
      changes: [
        {
          field: "status",
          oldValue: PAYMENT_STATUS.PENDING,
          newValue: PAYMENT_STATUS.REJECTED,
        },
      ],
      reason: verificationNotes || "",
    },
  ];
  foundPayment.isEdited = true;
  foundPayment.lastModifiedAt = now;
  foundPayment.lastModifiedBy = verifiedBy;

  const updatedPayment = await foundPayment.save();

  const userName = await resolveUserName(updatedPayment.userId);
  return transformPaymentDetail(updatedPayment.toObject(), userName);
};

/**
 * Get transactions - same as payments but filtered by userId
 * This endpoint is used for user-specific transaction history
 */
export const getTransactions = async (query: any) => {
  // Reuse the getPayments logic but ensure userId is used for filtering
  return getPayments(query);
};

/**
 * Get a single transaction by ID
 * Same as getPaymentById but semantically for transactions
 */
export const getTransactionById = async (id: string) => {
  return getPaymentById(id);
};