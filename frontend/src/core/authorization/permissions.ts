/**
 * Authorization — permission primitives.
 *
 * Pure, framework-agnostic helpers. No React, no store access, no I/O.
 * Every consumer that needs to answer "does this principal hold this
 * permission?" should go through this module so that authorization rules
 * live in exactly one place.
 */

import type { Permission } from "@/lib/types";
import { SUPER_ADMIN_ROLE_ID } from "./roles";

/** Resolve the set of permission keys for a given list of permission IDs. */
export const getPermissionKeys = (
  permissionIds: string[],
  permissions: Permission[],
): string[] => {
  const keys = new Set(
    permissions
      .filter((permission) => permissionIds.includes(permission.id))
      .map((permission) => permission.key),
  );

  return Array.from(keys);
};

/**
 * Check whether a permission key is present in a permission list.
 *
 * Super Admin wildcard: when the principal's role is the super-admin role,
 * every permission check passes regardless of the permission list contents.
 * Callers that already know the role should pass it explicitly; callers
 * that only hold a permission list can pass `null` to opt out of the
 * wildcard.
 */
export const hasPermission = (
  permissions: string[],
  permissionKey: string,
  roleId?: string | null,
): boolean => {
  if (roleId && roleId === SUPER_ADMIN_ROLE_ID) return true;
  return permissions.includes(permissionKey);
};

/** True when the principal holds every key in `keys`. */
export const hasAllPermissions = (
  permissions: string[],
  keys: string[],
  roleId?: string | null,
): boolean => {
  if (roleId && roleId === SUPER_ADMIN_ROLE_ID) return true;
  return keys.every((k) => permissions.includes(k));
};

/** True when the principal holds at least one key in `keys`. */
export const hasAnyPermission = (
  permissions: string[],
  keys: string[],
  roleId?: string | null,
): boolean => {
  if (roleId && roleId === SUPER_ADMIN_ROLE_ID) return true;
  return keys.some((k) => permissions.includes(k));
};

/** Returns only the keys the principal actually holds. */
export const filterHeldPermissions = (
  permissions: string[],
  candidates: string[],
  roleId?: string | null,
): string[] => {
  if (roleId && roleId === SUPER_ADMIN_ROLE_ID) return [...candidates];
  return candidates.filter((k) => permissions.includes(k));
};
