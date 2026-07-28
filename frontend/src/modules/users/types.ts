/**
 * Users Module Types
 * Domain-specific types for the Users feature.
 */

import type { User } from "@/lib/types";

export type { User };

/** Form state for creating/editing a user */
export interface UserFormState {
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: User["status"];
  jobTitle?: string;
  location?: string;
  address?: string;
  bio?: string;
  departmentId?: string;
}

/** Tab/filter states for the user list */
export type UserListTab = "all" | "recent" | "active" | "inactive" | "blocked" | "staff";
