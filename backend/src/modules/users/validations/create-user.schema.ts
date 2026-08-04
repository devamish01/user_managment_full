import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).optional(),
  roleId: z.string().min(1, "Role ID is required"),
  status: z.enum(["active", "inactive", "blocked", "pending"]).default("pending"),
  location: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;