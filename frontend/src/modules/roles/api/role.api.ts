/**
 * Role module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the Role
 * endpoints. Services delegate here; consumers of `RoleService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse, GenericQueryParams } from "@/core/api";
import type { Role } from "@/lib/types";
import { ROLES, ROLE_DETAILS } from "./role.endpoints";

export class RoleApi {
  static getRoles(params?: GenericQueryParams): Promise<ApiResponse<Role[]>> {
    return api.get<Role[]>(ROLES, { params });
  }

  static createRole(role: Omit<Role, "id" | "createdAt">): Promise<ApiResponse<Role>> {
    return api.post<Role>(ROLES, role);
  }

  static updateRole(id: string, updates: Partial<Role>): Promise<ApiResponse<Role>> {
    return api.patch<Role>(ROLE_DETAILS(id), updates);
  }

  static updateRolePermissions(
    id: string,
    permissionIds: string[],
  ): Promise<ApiResponse<Role>> {
    return api.patch<Role>(ROLE_DETAILS(id), { permissionIds });
  }

  static deleteRole(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return api.delete<{ ok: boolean }>(ROLE_DETAILS(id));
  }
}
