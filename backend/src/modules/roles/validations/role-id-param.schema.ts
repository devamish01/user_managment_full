import { z } from "zod";

export const roleIdParamSchema = z.object({
  id: z.string().min(1, "Role ID is required"),
});

export type RoleIdParam = z.infer<typeof roleIdParamSchema>;