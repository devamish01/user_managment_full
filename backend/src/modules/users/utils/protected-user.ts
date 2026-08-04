/**
 * Protected User Utilities
 * 
 * Centralized logic for determining if a user is a protected system super admin.
 * A user is protected ONLY if they are the original system super admin:
 * - roleId === SUPER_ADMIN_ROLE_ID (currently "r1")
 * - approvedBy === "SYSTEM" (created by system, not by another admin)
 */

import type { IUser } from "@/modules/users/model/user.type.js";
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { SUPER_ADMIN_ROLE_ID } from "@/modules/roles/constants/role.constants.js";

/**
 * Check if a user is the protected system super admin.
 * Only the original system-created super admin (roleId: SUPER_ADMIN_ROLE_ID, approvedBy: SYSTEM) is protected.
 * Users promoted to super admin later (approvedBy: another user) are NOT protected.
 */
export const isProtectedUser = (user: IUser | null | undefined): boolean => {
  if (!user) return false;
  return user.roleId === SUPER_ADMIN_ROLE_ID && user.approvedBy === "SYSTEM";
};

/**
 * Assert that a user is not protected for a specific action.
 * Throws AppError if the user is a protected system super admin.
 * 
 * @param user - The user to check
 * @param action - The action being attempted (e.g., "modify", "delete", "change role", "change status", "reset password")
 */
export const assertUserNotProtected = (user: IUser | null | undefined, action: string): void => {
  if (isProtectedUser(user)) {
    throw new AppError({
      message: `System protected user cannot be ${action}.`,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "SYSTEM_PROTECTED_USER",
    });
  }
};