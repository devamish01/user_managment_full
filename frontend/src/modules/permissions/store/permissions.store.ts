/**
 * permissions.store.ts — adds loading/error for the standard page lifecycle.
 */
import * as React from "react";
import type { Permission } from "@/lib/types";
import { PermissionService } from "../services";
import type { GenericQueryParams } from "@/api";

export interface UsePermissionsStoreOptions {
  onRolesRefresh?: () => Promise<void>;
}

export interface PermissionsStoreState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  getPermissions: (params?: GenericQueryParams) => Promise<void>;
  createPermission: (data: Omit<Permission, "id">) => Promise<void>;
  updatePermission: (id: string, data: Partial<Permission>) => Promise<void>;
  deletePermission: (id: string) => Promise<void>;
}

export const usePermissionsStore = (
  options: UsePermissionsStoreOptions = {},
): PermissionsStoreState => {
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getPermissions = React.useCallback(async (params?: GenericQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PermissionService.getPermissions(params);
      if (res.success && res.data) setPermissions(res.data);
      else setError(res.message || "Failed to load permissions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load permissions");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = React.useCallback(async () => {
    try {
      const res = await PermissionService.getPermissions();
      if (res.success && res.data) setPermissions(res.data);
    } catch { /* swallow */ }
  }, []);

  const createPermission = React.useCallback(
    async (data: Omit<Permission, "id">) => {
      console.log("permissions.store createPermission - data:", data);
      const res = await PermissionService.createPermission(data);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const updatePermission = React.useCallback(
    async (id: string, data: Partial<Permission>) => {
      const res = await PermissionService.updatePermission(id, data);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const deletePermission = React.useCallback(
    async (id: string) => {
      const res = await PermissionService.deletePermission(id);
      if (res.success) {
        await refresh();
        if (options.onRolesRefresh) await options.onRolesRefresh();
      } else throw new Error(res.message);
    },
    [refresh, options.onRolesRefresh],
  );

  return { permissions, loading, error, getPermissions, createPermission, updatePermission, deletePermission };
};

export default usePermissionsStore;
