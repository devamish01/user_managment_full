/**
 * Users Module Types
 * Domain-specific types for the Users feature.
 */

import type { User } from "@/lib/types";

export type { User };

/** Form state for creating/editing a user */
export interface UserFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  status: User["status"];
  password?: string;
  username?: string;
  jobTitle?: string;
  location?: string;
  address?: string;
  bio?: string;
  isProtected?: boolean;
}

/** Tab/filter states for the user list */
export type UserListTab = "all" | "recent" | "active" | "inactive" | "blocked" | "pending" | "staff";
