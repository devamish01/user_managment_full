import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).default([]),
  color: z.string().optional().default("from-slate-500 to-slate-600"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;