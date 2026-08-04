import { z } from "zod";

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
  color: z.string().optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;