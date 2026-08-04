import { isValidObjectId } from "mongoose";
import { User } from "@/modules/users/index.js";
import { USER_MESSAGES, USER_ROLE } from "@/modules/users/index.js";
import { generateUserId } from "@/modules/users/utils/index.js";
// import { ROLE_MESSAGES, SUPER_ADMIN_ROLE_ID } from "@/modules/roles/constants/role.constants.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { UserQueryParams } from "@/modules/users/index.js";
import { getDateRangeFromPeriod } from "@/shared/utils/index.js";
import type { CreateUserInput } from "@/modules/users/index.js";
import type { UpdateUserInput } from "@/modules/users/index.js";
import { isProtectedUser, assertUserNotProtected } from "@/modules/users/utils/index.js";

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
    active: number;
    inactive: number;
    blocked: number;
    pending: number;
  };
}

const toIsoString = (value: unknown) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const buildUserQueryById = (id: string) => {
  if (isValidObjectId(id)) {
    return { $or: [{ _id: id }, { userId: id }] };
  }
  return { userId: id };
};

const buildApproverNameMap = async (users: any[]) => {
  const approverIds = Array.from(
    new Set(
      users
        .map((user) => user.approvedBy)
        .filter((id) => typeof id === "string" && id !== "SYSTEM"),
    ),
  );
  if (!approverIds.length) return {} as Record<string, string>;

  const approvers = await User.find({ userId: { $in: approverIds } }).lean();
  return approvers.reduce((map: Record<string, string>, approver: any) => {
    map[approver.userId] = `${approver.firstName ?? ""} ${approver.lastName ?? ""}`.trim();
    return map;
  }, {} as Record<string, string>);
};

const transformUser = (user: any) => {
  const name = user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  // Compute isProtected dynamically: only the original system super admin (roleId: SUPER_ADMIN_ROLE_ID, approvedBy: SYSTEM) is protected
  // const isProtected = user.roleId === SUPER_ADMIN_ROLE_ID && user.approvedBy === "SYSTEM";
 const isProtected = isProtectedUser(user);
    return {
    id: user.userId,
    userId: user.userId,
    username: user.username,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    name,
    email: user.email,
    phone: user.phone || "",
    roleId: user.roleId,
    role: user.role,
    status: user.status,
    approvedAt: user.approvedAt instanceof Date ? user.approvedAt : (user.approvedAt ? new Date(user.approvedAt) : null),
    approvedBy: user.approvedBy || null,
    approvedByName: user.approvedByName || null,
    location: user.location || "",
    address: user.address || "",
    bio: user.bio || "",
    lastActive: user.lastActive instanceof Date ? user.lastActive : (user.lastActive ? new Date(user.lastActive) : null),
    createdAt: user.createdAt instanceof Date ? user.createdAt : (user.createdAt ? new Date(user.createdAt) : new Date()),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt : (user.updatedAt ? new Date(user.updatedAt) : new Date()),
    password: user.password || undefined,
    isProtected: isProtected,
  };
};

export const getUsers = async (params: UserQueryParams): Promise<PaginatedResult<any>> => {
  const {
    page = 1,
    limit = 20,
    search,
    sort = "createdAt",
    order = "desc",
    status,
    roleId,
  } = params;

  const query: any = {};

  // Search
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { username: searchRegex },
      { userId: searchRegex },
    ];
  }

  // Filters
  if (status) query.status = status.toLowerCase();
  if (roleId) query.roleId = roleId;

  // Period / Date range filtering
  const startDateParam = (params as any).startDate;
  const endDateParam = (params as any).endDate;
  const periodParam = (params as any).period;
  const daysParam = Number((params as any).days) || undefined;

  // Custom range takes precedence when explicit start/end provided
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
    query.createdAt = {} as any;
    if (startIso) query.createdAt.$gte = new Date(startIso);
    if (endIso) query.createdAt.$lte = new Date(endIso);
  }

  // Sort
  const sortOrder = order === "asc" ? 1 : -1;
  const sortObj: any = { [sort]: sortOrder };

  // Pagination
  const skip = (page - 1) * limit;

  // Execute queries
  const [users, total] = await Promise.all([
    User.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  const approverNameMap = await buildApproverNameMap(users);
  const transformedUsers = users.map((user) =>
    transformUser({
      ...user,
      approvedByName:
        user.approvedBy && user.approvedBy !== "SYSTEM"
          ? approverNameMap[user.approvedBy] ?? null
          : null,
    }),
  );

  // Stats
  const [totalCount, activeCount, inactiveCount, blockedCount, pendingCount] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "inactive" }),
    User.countDocuments({ status: "blocked" }),
    User.countDocuments({ status: "pending" }),
  ]);

  return {
    data: transformedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
      blocked: blockedCount,
      pending: pendingCount,
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await User.findOne(buildUserQueryById(id)).lean();
  if (!user) {
    throw new AppError({
      message: USER_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "USER_NOT_FOUND",
    });
  }

  let approvedByName: string | null = null;
  if (user.approvedBy && user.approvedBy !== "SYSTEM") {
    const approver = await User.findOne({ userId: user.approvedBy }).lean();
    approvedByName = approver
      ? `${approver.firstName ?? ""} ${approver.lastName ?? ""}`.trim()
      : null;
  }

  return transformUser({ ...user, approvedByName });
};

export const createUser = async (data: CreateUserInput) => {
  // Check if email exists
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new AppError({
      message: USER_MESSAGES.EMAIL_EXISTS,
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: "EMAIL_EXISTS",
    });
  }

  const firstName = data.firstName;
  const lastName = data.lastName;
  const email = data.email ?? "";
  const username = firstName.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const newUserPayload = {
    userId: generateUserId(),
    username,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone: data.phone || "",
    location: data.location || "",
    address: data.address || "",
    bio: data.bio || "",
    roleId: data.roleId!,
    status: data.status ? data.status.toLowerCase() : "pending",
    password: (data as any).password || "",
  };

  const user = await User.create(newUserPayload as any);

  return transformUser(user.toObject());
};

export const updateUser = async (id: string, data: UpdateUserInput, approvedByUserId?: string, requesterRoleId?: string) => {
  // Check if email is being changed and if it already exists
  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
      $nor: [buildUserQueryById(id)],
    });
    if (existingUser) {
      throw new AppError({
        message: USER_MESSAGES.EMAIL_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "EMAIL_EXISTS",
      });
    }
  }

  // Check if username is being changed and if it already exists
  if (data.username) {
    const existingUser = await User.findOne({
      username: data.username.toLowerCase(),
      $nor: [buildUserQueryById(id)],
    });
    if (existingUser) {
      throw new AppError({
        message: "Username already exists.",
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "USERNAME_EXISTS",
      });
    }
  }

  const foundUser = await User.findOne(buildUserQueryById(id));
  if (!foundUser) {
    throw new AppError({
      message: USER_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "USER_NOT_FOUND",
    });
  }

  // Check if user is the protected system super admin
  // Only the original system super admin (roleId: SUPER_ADMIN_ROLE_ID, approvedBy: SYSTEM) is protected
  assertUserNotProtected(foundUser, "modify");

  // Prevent changing role/status for protected system super admin
  // if (isProtectedUser(foundUser)) {
  //   if (typeof data.status !== "undefined" || typeof data.roleId !== "undefined") {
  //     throw new AppError({
  //       message: ROLE_MESSAGES.CANNOT_MODIFY_SUPER_ADMIN,
  //       statusCode: HTTP_STATUS.FORBIDDEN,
  //       errorCode: "CANNOT_MODIFY_SUPER_ADMIN",
  //     });
  //   }
  // }

  // Track if status is changing to "active" for approval tracking
  const isStatusChangingToActive = 
    data.status && 
    data.status.toLowerCase() === "active" && 
    foundUser.status !== "active";

  // Prepare update data with proper conversions
  const updateData: any = {
    ...data,
    email: data.email?.toLowerCase(),
    username: data.username?.toLowerCase(),
  };

  // Convert status to lowercase
  if (data.status) {
    updateData.status = data.status.toLowerCase();
    
    // If status is changing to active, set approvedAt and approvedBy
    if (isStatusChangingToActive) {
      updateData.approvedAt = new Date();
      updateData.approvedBy = approvedByUserId || "SYSTEM";
    }
  }

  // Convert roleId to role (database format)
  if (data.roleId) {
    const roleMap: Record<string, string> = {
      r1: USER_ROLE.SUPER_ADMIN,
      r2: USER_ROLE.ADMIN,
      r3: USER_ROLE.MANAGER,
      r4: USER_ROLE.USER,
    };
    updateData.role = roleMap[data.roleId] || USER_ROLE.USER;
    updateData.roleId = data.roleId;
  }

  // Handle firstName and lastName if provided
  if (data.firstName) {
    updateData.firstName = data.firstName;
  }
  if (data.lastName) {
    updateData.lastName = data.lastName;
  }

  Object.assign(foundUser, updateData);

  const updatedUser = await foundUser.save();

  return transformUser(updatedUser.toObject());
};

export const deleteUser = async (id: string, requesterRoleId?: string) => {
  const foundUser = await User.findOne(buildUserQueryById(id));
  if (!foundUser) {
    throw new AppError({
      message: USER_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "USER_NOT_FOUND",
    });
  }

  // Check if user is the protected system super admin
  // Only the original system super admin (roleId: SUPER_ADMIN_ROLE_ID, approvedBy: SYSTEM) is protected
  assertUserNotProtected(foundUser, "delete");

  await User.findOneAndDelete(buildUserQueryById(id));

  return { ok: true };
};