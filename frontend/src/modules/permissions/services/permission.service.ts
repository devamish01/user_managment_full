/**
 * PermissionService — public API for the Permissions feature.
 *
 * Public method signatures are unchanged. Internally delegates to
 * `PermissionApi` (the module-level HTTP layer) so the architecture becomes:
 *
 *   Store → PermissionService → PermissionApi → ApiClient → mockClient
 */

import { PermissionApi } from "../api";
import type { GenericQueryParams } from "@/core/api";
import type { Permission } from "@/lib/types";

export class PermissionService {
  static getPermissions(params?: GenericQueryParams) {
    return PermissionApi.getPermissions(params);
  }

  static createPermission(perm: Omit<Permission, "id">) {
    console.log("PermissionService.createPermission - sending:", perm);
    return PermissionApi.createPermission(perm);
  }

  static updatePermission(id: string, updates: Partial<Permission>) {
    return PermissionApi.updatePermission(id, updates);
  }

  static deletePermission(id: string) {
    return PermissionApi.deletePermission(id);
  }
}
