/**
 * Authorization — identity resolver.
 *
 * Builds a `CurrentUserPermissions` object from a role ID + the full
 * roles/permissions catalog. Super Admin receives a wildcard (all
 * permissions); every other role receives only the keys that belong to its
 * `permissionIds`.
 *
 * This logic lives in `core/authorization` because it answers the question
 * "what is this principal allowed to do?" — an authorization concern, not
 * an authentication one.
 */

import type { Permission, Role } from "@/lib/types";
import { SUPER_ADMIN_ROLE_ID } from "./roles";
import { getPermissionKeys } from "./permissions";

export interface CurrentUserPermissions {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: Role | null;
  permissions: string[];
}

export const buildCurrentUserPermissions = ({
  id,
  name,
  email,
  roleId,
  roles,
  permissions,
}: {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roles: Role[];
  permissions: Permission[];
}): CurrentUserPermissions => {
  const role = roles.find((r) => r.id === roleId) || null;

  // Super Admin wildcard
  if (roleId === SUPER_ADMIN_ROLE_ID) {
    return {
      id,
      name,
      email,
      roleId,
      role,
      permissions: permissions.map((p) => p.key),
    };
  }

  // Standard role — only the keys tied to its permissionIds
  const keys = role ? getPermissionKeys(role.permissionIds, permissions) : [];

  return {
    id,
    name,
    email,
    roleId,
    role,
    permissions: keys,
  };
};
