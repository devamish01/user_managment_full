import { z } from "zod";

export const createPermissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    key: z.string().min(1, "Key is required").max(100, "Key too long").regex(/^[a-z.]+$/, "Key must be lowercase with dots only"),
    module: z.string().min(1, "Module is required").max(50, "Module too long"),
    description: z.string().max(500, "Description too long").optional(),
  }),
});

export const updatePermissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
    key: z.string().min(1, "Key is required").max(100, "Key too long").regex(/^[a-z.]+$/, "Key must be lowercase with dots only").optional(),
    module: z.string().min(1, "Module is required").max(50, "Module too long").optional(),
    description: z.string().max(500, "Description too long").optional(),
  }),
});

export const permissionIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Permission ID is required"),
  }),
});

export const permissionQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    module: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }).optional(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>["body"];
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>["body"];
export type PermissionQueryParams = z.infer<typeof permissionQuerySchema>["query"];