import { randomUUID } from "crypto";

import { User } from "@/modules/users/model/index.js";

import { createSession } from "@/modules/sessions/services/session.service.js";

import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashPassword,
} from "@/modules/auth/utils/index.js";

import { AUTH_MESSAGES , AUTH_ERRORS } from "@/modules/auth/constants/index.js";

import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";

import type { LoginInput } from "../types/login.type.js";
import { countActiveSessions, generateSessionId } from "@/modules/sessions/index.js";

export const login = async (
  data: LoginInput,
) => {
  // Find User
  const user = await User.findOne({
    email: data.email,
  }).select("+password");

  if (!user) {
    throw new AppError({
      message: AUTH_MESSAGES.INVALID_CREDENTIALS,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "INVALID_CREDENTIALS",
    });
  }

  // Compare Password
  const isPasswordValid = await comparePassword(
    data.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError({
      message: AUTH_MESSAGES.INVALID_CREDENTIALS,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "INVALID_CREDENTIALS",
    });
  }

  // User Status Check
  if (user.status === "pending") {
    throw new AppError({
      message :AUTH_ERRORS.ACCOUNT_PENDING,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "ACCOUNT_PENDING",
    });
  }

  if (user.status === "blocked") {
    throw new AppError({
      message: "Your account has been blocked.",
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "ACCOUNT_BLOCKED",
    });
  }

  if (user.status === "inactive") {
    throw new AppError({
      message: "Your account is inactive.",
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "ACCOUNT_INACTIVE",
    });
  }
const activeSessions =
 await countActiveSessions(
   user.userId
 );


if(activeSessions >= 102){

 throw new AppError({
   message:"Maximum active sessions reached.",
   statusCode:HTTP_STATUS.FORBIDDEN,
   errorCode:"SESSION_LIMIT_REACHED",
 });

}
  // Session
const sessionId = generateSessionId();
  // Tokens
  const accessToken = generateAccessToken({
    userId: user.userId,
    role: user.role,
    roleId: user.roleId,
    isSuperAdmin: user.roleId === "r1", // Will be true for Super Admin after migration
    sessionId,
  });

  const refreshToken = generateRefreshToken({
    userId: user.userId,
    sessionId,
  });

  // Hash Refresh Token
  const refreshTokenHash = await hashPassword(
    refreshToken,
  );

  // Save Session
  await createSession({
    sessionId,
    userId: user.userId,
    refreshTokenHash,
    expiresAt: getRefreshTokenExpiry(),
  });

  // Remove Password
  const userObject = user.toObject();

const { password, ...userData } = userObject;

// return {
//   tokens: {
//     accessToken,
//     refreshToken,
//   },

//   session: {
//     sessionId,
//   },

//   user: {
//     userId: user.userId,
//     username: user.username,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email,
//     role: user.role,
//     status: user.status,
//   },
// };
return {
  session: {
    accessToken,
    refreshToken,
    currentUserId: user.userId,
    rememberMe: true,
    loginAt: new Date().toISOString(),
    expiresAt: getRefreshTokenExpiry(),
  },
  user: {
    userId: userObject.userId,
    username: userObject.username,
    firstName: userObject.firstName,
    lastName: userObject.lastName,
    email: userObject.email,
    roleId: userObject.roleId,
    role: userObject.role,
    status: userObject.status,
    approvedAt: userObject.approvedAt,
    approvedBy: userObject.approvedBy,
    phone: userObject.phone,
    location: userObject.location,
    address: userObject.address,
    bio: userObject.bio,
    lastActive: userObject.lastActive,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
  },
};
};