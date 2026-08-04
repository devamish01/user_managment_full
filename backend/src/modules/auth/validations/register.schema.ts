import { z } from "zod";
import {
  PASSWORD_REGEX,
} from "@/shared/constants/index.js";

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
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  phone: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  roleId: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked", "pending"]).optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
