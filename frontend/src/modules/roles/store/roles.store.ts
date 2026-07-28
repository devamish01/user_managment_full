/**
 * roles.store.ts — adds loading/error for the standard page lifecycle.
 */
import * as React from "react";
import type { Role } from "@/lib/types";
import { RoleService } from "../services";
import type { GenericQueryParams } from "@/api";

export interface RolesStoreState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  getRoles: (params?: GenericQueryParams) => Promise<void>;
  createRole: (data: Omit<Role, "id" | "createdAt">) => Promise<void>;
  updateRole: (id: string, data: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  updateRolePermissions: (id: string, permissionIds: string[]) => Promise<void>;
}

export const useRolesStore = (): RolesStoreState => {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getRoles = React.useCallback(async (params?: GenericQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await RoleService.getRoles(params);
      if (res.success && res.data) setRoles(res.data);
      else setError(res.message || "Failed to load roles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = React.useCallback(async () => {
    try {
      const res = await RoleService.getRoles();

      if (res.success && res.data) setRoles(res.data);
    } catch { /* swallow */ }
  }, []);

  const createRole = React.useCallback(
    async (data: Omit<Role, "id" | "createdAt">) => {
      const res = await RoleService.createRole(data);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const updateRole = React.useCallback(
    async (id: string, data: Partial<Role>) => {
      const res = await RoleService.updateRole(id, data);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const updateRolePermissions = React.useCallback(
    async (id: string, permissionIds: string[]) => {
      
      const res = await RoleService.updateRolePermissions(id, permissionIds);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const deleteRole = React.useCallback(
    async (id: string) => {
      const res = await RoleService.deleteRole(id);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  return { roles, loading, error, getRoles, createRole, updateRole, deleteRole, updateRolePermissions };
};

export default useRolesStore;
