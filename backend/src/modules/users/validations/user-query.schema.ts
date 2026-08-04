import { z } from "zod";

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked", "pending"]).optional(),
  roleId: z.string().optional(),
  // Period filtering: named periods or custom days
  period: z.string().optional(),
  days: z.coerce.number().int().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // Optional grouping for metrics endpoints (day/week/month/year)
  groupBy: z.enum(["day", "week", "month", "year"]).optional(),
  sort: z.enum(["id", "name", "email", "createdAt", "lastActive"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type UserQueryParams = z.infer<typeof userQuerySchema>;