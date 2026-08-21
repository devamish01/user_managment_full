/**
 * permissions.store.ts — adds loading/error for the standard page lifecycle.
 */
import * as React from "react";
import type { Permission } from "@/lib/types";
import { PermissionService } from "../services";
import type { GenericQueryParams } from "@/api";
import { getErrorMessage } from "@/core/api/errorUtils";
import type { ApiResponse } from "@/core/api/types";

export interface UsePermissionsStoreOptions {
  onRolesRefresh?: () => Promise<void>;
}

export interface PermissionsStoreState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  getPermissions: (params?: GenericQueryParams) => Promise<void>;
  createPermission: (data: Omit<Permission, "id">) => Promise<ApiResponse<Permission>>;
  updatePermission: (id: string, data: Partial<Permission>) => Promise<ApiResponse<Permission>>;
  deletePermission: (id: string) => Promise<ApiResponse<{ ok: boolean }>>;
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
      setError(getErrorMessage(err));
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
      const res = await PermissionService.createPermission(data);

      if (res.success) {
        await refresh();
        return res;
      }

      throw res;
    },
    [refresh],
  );

  const updatePermission = React.useCallback(
    async (id: string, data: Partial<Permission>) => {
      const res = await PermissionService.updatePermission(id, data);

      if (res.success) {
        await refresh();
        return res;
      }

      throw res;
    },
    [refresh],
  );

  const deletePermission = React.useCallback(
    async (id: string) => {
      const res = await PermissionService.deletePermission(id);

      if (res.success) {
        await refresh();

        if (options.onRolesRefresh) {
          await options.onRolesRefresh();
        }

        return res;
      }

      throw res;
    },
    [refresh, options.onRolesRefresh],
  );
  return { permissions, loading, error, getPermissions, createPermission, updatePermission, deletePermission };
};

export default usePermissionsStore;
