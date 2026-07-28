import { AUTH_MESSAGES } from "@/modules/auth/constants/index.js";
import type { RegisterUserInput } from "../types/register.type.js";

import { User } from "@/modules/users/model/index.js";
import { createUserPayload } from "@/modules/users/factories/user.factory.js";

import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";

import bcrypt from "bcrypt";
import { hashPassword } from "@/modules/auth/utils/hash-password.js";
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


const userPayload = createUserPayload(
  data,
  hashedPassword,
  {
    role: "user",
    status: "ACTIVE",
    approvedAt: new Date(),
    approvedBy: "SYSTEM",
    // status: "PENDING",
    // approvedAt: null,
    // approvedBy: null,
    // approvedBy: req.user.userId,
  },
);

  const user = await User.create(userPayload);

  const { password, _id, ...userData } = user.toObject();

  return userData;
};
