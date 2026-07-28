/**
 * Permission module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the Permission
 * endpoints. Services delegate here; consumers of `PermissionService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse, GenericQueryParams } from "@/core/api";
import type { Permission } from "@/lib/types";
import { PERMISSIONS, PERMISSION_DETAILS } from "./permission.endpoints";

export class PermissionApi {
  static getPermissions(
    params?: GenericQueryParams,
  ): Promise<ApiResponse<Permission[]>> {
    return api.get<Permission[]>(PERMISSIONS, { params });
  }

  static createPermission(
    perm: Omit<Permission, "id">,
  ): Promise<ApiResponse<Permission>> {
    return api.post<Permission>(PERMISSIONS, perm);
  }

  static updatePermission(
    id: string,
    updates: Partial<Permission>,
  ): Promise<ApiResponse<Permission>> {
    return api.patch<Permission>(PERMISSION_DETAILS(id), updates);
  }

  static deletePermission(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return api.delete<{ ok: boolean }>(PERMISSION_DETAILS(id));
  }
}
