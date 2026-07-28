/**
 * Backward-compatibility re-export shim.
 *
 * All authorization/resolver logic has moved to `core/authorization`.
 * This file re-exports the same symbols so that existing consumers can
 * continue importing from `@/lib/permissions` without any changes.
 *
 * New code should import from `@/core/authorization` directly.
 */
export type { CurrentUserPermissions } from "@/core/authorization";
export {
  buildCurrentUserPermissions,
  getPermissionKeys,
} from "@/core/authorization";
export {
  hasPermission as _hasPermissionAuthz,
  hasAllPermissions,
  hasAnyPermission,
  filterHeldPermissions,
} from "@/core/authorization";

// Legacy thin wrapper for callers that pass Set<string>
import { hasPermission as authzHasPermission } from "@/core/authorization";

export const hasPermission = (
  userPermissions: string[] | Set<string>,
  permissionKey: string,
): boolean => {
  const list = Array.isArray(userPermissions) ? userPermissions : Array.from(userPermissions);
  return authzHasPermission(list, permissionKey);
};
