/**
 * Permission checker utility.
 * Pure function — no React, no store dependency.
 * Mirrors src/lib/permissions.ts logic for shared consumption.
 * Used by: sidebar nav, page guards, button visibility, column visibility.
 */

/** Check if a list of permission keys includes the required key */
export const hasPermission = (
  userPermissions: string[] | Set<string>,
  permissionKey: string,
): boolean => {
  if (Array.isArray(userPermissions)) return userPermissions.includes(permissionKey);
  return userPermissions.has(permissionKey);
};

/** Check if a user has ALL of the required permissions */
export const hasAllPermissions = (
  userPermissions: string[],
  requiredKeys: string[],
): boolean => requiredKeys.every((key) => userPermissions.includes(key));

/** Check if a user has ANY of the required permissions */
export const hasAnyPermission = (
  userPermissions: string[],
  requiredKeys: string[],
): boolean => requiredKeys.some((key) => userPermissions.includes(key));
