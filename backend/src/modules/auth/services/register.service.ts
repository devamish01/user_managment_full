import { AUTH_MESSAGES } from "@/modules/auth/constants/index.js";
import type { RegisterUserInput } from "../types/register.type.js";

import { User } from "@/modules/users/model/index.js";
import { Role } from "@/modules/roles/model/index.js";
import { createUserPayload } from "@/modules/users/factories/user.factory.js";
import { USER_ROLE } from "@/modules/users/constants/user.constants.js";
import { SUPER_ADMIN_ROLE_ID, DEFAULT_VIEWER_ROLE_ID } from "@/modules/roles/constants/role.constants.js";

import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";

import bcrypt from "bcrypt";
import { hashPassword } from "@/modules/auth/utils/hash-password.js";
import { generateUserId } from "@/modules/users/utils/user-id.generator.js";

export const register = async (data: RegisterUserInput, createdBy?: string) => {
  // Check if this is the first user registration (no users exist)
  const userCount = await User.countDocuments();
  const isFirstUser = userCount === 0;

  // If first user, force Super Admin role and active status
  if (isFirstUser) {
    // Ensure roles exist
    const superAdminRole = await Role.findOne({ roleId: SUPER_ADMIN_ROLE_ID });
    const defaultViewerRole = await Role.findOne({ roleId: DEFAULT_VIEWER_ROLE_ID });
    
    if (!superAdminRole || !defaultViewerRole) {
      throw new AppError({
        message: "System roles not initialized. Please contact administrator.",
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode: "SYSTEM_ROLES_NOT_INITIALIZED",
      });
    }
  }

  const existingUser = await User.findOne({
    $or: [
      {
        email: data.email,
      },
      {
        username: data.username,
      },
    ],
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new AppError({
        message: "Email already exists.",
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "EMAIL_ALREADY_EXISTS",
      });
    }

    if (existingUser.username === data.username) {
      throw new AppError({
        message: "Username already exists.",
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "USERNAME_ALREADY_EXISTS",
      });
    }
  }

  const hashedPassword = await hashPassword(data.password);

  const normalizeStatus = (status?: string) => {
    if (!status) return "pending";
    switch (status.toLowerCase()) {
      case "active":
        return "active";
      case "inactive":
        return "inactive";
      case "blocked":
        return "blocked";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  };

const getRoleFromRoleId = (roleId: string) => {
  switch (roleId) {
    case "r1":
      return USER_ROLE.SUPER_ADMIN;
    case "r2":
      return USER_ROLE.ADMIN;
    case "r3":
      return USER_ROLE.MANAGER;
    default:
      return USER_ROLE.USER;
  }
};

  // If first user, force Super Admin role and active status
const roleId = isFirstUser
  ? SUPER_ADMIN_ROLE_ID
  : (data.roleId || DEFAULT_VIEWER_ROLE_ID);  
  const userId = await generateUserId();
const normalizedStatus = isFirstUser
  ? "active"
  : createdBy
    ? normalizeStatus(data.status)
    : "pending";
  // const isApproved = normalizedStatus !== "pending";
  
  // Determine approvedBy:
  // - If first user (system seed): "SYSTEM"
  // - If createdBy provided (superadmin creating): createdBy (superadmin's userId)
  // - If public registration (no createdBy): "SYSTEM"
const approvedBy = createdBy ?? "SYSTEM";
  
const approvedAt =
  normalizedStatus === "pending"
    ? null
    : new Date();
  const userPayload = createUserPayload(
    data,
    hashedPassword,
    userId,
    {
      role: getRoleFromRoleId(roleId),
      roleId,
      status: normalizedStatus,
      approvedAt,
      approvedBy,
      isProtected: isFirstUser, // First user (Super Admin) is protected
    },
  );

  const user = await User.create(userPayload);

  const { password, _id, ...userData } = user.toObject();

  return {
    userId: userData.userId,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    roleId: userData.roleId,
    role: userData.role,
    status: userData.status,
    approvedAt: userData.approvedAt,
    approvedBy: userData.approvedBy,
    phone: userData.phone,
    location: userData.location,
    address: userData.address,
    bio: userData.bio,
    lastActive: userData.lastActive,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
};
