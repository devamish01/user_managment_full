import { AUTH_MESSAGES } from "@/modules/auth/constants/index.js";
import type { RegisterUserInput } from "../types/register.type.js";

import { User } from "@/modules/users/model/index.js";
import { createUserPayload } from "@/modules/users/factories/user.factory.js";
import { USER_ROLE } from "@/modules/users/constants/user.constants.js";

import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";

import bcrypt from "bcrypt";
import { hashPassword } from "@/modules/auth/utils/hash-password.js";
import { generateUserId } from "@/modules/users/utils/user-id.generator.js";
// export const registerUserService = async () => {

// };
// Lekin abhi isme logic nahi likhenge kyunki:

// User model abhi nahi bana hai
// Database connection abhi nahi hai
// Password hashing setup abhi nahi hai
// iska kaam hai register ke business logic ko handle karna.

export const register = async (data: RegisterUserInput) => {
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

 if(existingUser.email === data.email){
   throw new AppError({
    message:"Email already exists.",
    statusCode:HTTP_STATUS.CONFLICT,
    errorCode:"EMAIL_ALREADY_EXISTS",
   });
 }

 if(existingUser.username === data.username){
   throw new AppError({
    message:"Username already exists.",
    statusCode:HTTP_STATUS.CONFLICT,
    errorCode:"USERNAME_ALREADY_EXISTS",
   });
 }

}

const hashedPassword = await hashPassword(data.password);//

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

const roleId = data.roleId || "r4";
const userId = await generateUserId();
const normalizedStatus = normalizeStatus(data.status);
const userPayload = createUserPayload(
  data,
  hashedPassword,
  userId,
  {
    role: getRoleFromRoleId(roleId),
    roleId,
    status: normalizedStatus,
    approvedAt: normalizedStatus === "pending" ? null : new Date(),
    approvedBy: normalizedStatus === "pending" ? null : "SYSTEM",
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
