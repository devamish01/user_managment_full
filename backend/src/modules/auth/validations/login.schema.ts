import { toLowerCase, z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export type LoginSchema = z.infer<typeof loginSchema>;
// Purpose

// Request validate karega.
// Invalid email/password service tak jayega hi nahi.
