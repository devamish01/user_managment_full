/**
 * RoleService — public API for the Roles feature.
 *
 * Public method signatures are unchanged. Internally delegates to
 * `RoleApi` (the module-level HTTP layer) so the architecture becomes:
 *
 *   Store → RoleService → RoleApi → ApiClient → mockClient
 */

import { RoleApi } from "../api";
import type { GenericQueryParams } from "@/core/api";
import type { Role } from "@/lib/types";

export class RoleService {
  static getRoles(params?: GenericQueryParams) {
    return RoleApi.getRoles(params);
  }

  static createRole(role: Omit<Role, "id" | "createdAt">) {
    return RoleApi.createRole(role);
  }

  static updateRole(id: string, updates: Partial<Role>) {
    return RoleApi.updateRole(id, updates);
  }

  static updateRolePermissions(id: string, permissionIds: string[]) {
    return RoleApi.updateRolePermissions(id, permissionIds);
  }

  static deleteRole(id: string) {
    return RoleApi.deleteRole(id);
  }
}
