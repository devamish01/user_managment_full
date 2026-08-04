import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50).optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50).optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).optional(),
  roleId: z.string().min(1, "Role ID is required").optional(),
  status: z.enum(["active", "inactive", "blocked", "pending"]).optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
  isProtected: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;