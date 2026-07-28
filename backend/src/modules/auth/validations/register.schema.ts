import { z } from "zod";
import {
  PASSWORD_REGEX,
} from "@/shared/constants/index.js";
//User se kya input lena hai

export const registerSchema = z.object({

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers and underscore.",
    ),


  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),


  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name cannot exceed 50 characters."),


  email: z
    .string(),
    // .trim()
    // .toLowerCase()
    // .email("Invalid email address."),


  password: z
    .string()
    // .min(8, "Password must be at least 8 characters.")
    // .max(20, "Password cannot exceed 20 characters.")
    // .regex(
    //   PASSWORD_REGEX,
    //   "Password must contain uppercase, lowercase, number and special character.",
    // ),

});


export type RegisterSchema = z.infer<typeof registerSchema>;