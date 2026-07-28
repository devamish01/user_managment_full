/**
 * permissions.store.ts
 *
 * Permissions feature state ownership.
 * Holds the permissions array and CRUD actions.
 *
 * Cross-module side effect:
 *   Deleting a permission used to also refresh the Roles store (because role
 *   definitions reference permission IDs). We preserve this via the optional
 *   `onRolesRefresh` callback passed in from the composition layer.
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
  getPermissions: (params?: GenericQueryParams) => Promise<void>;
  createPermission: (data: Omit<Permission, "id">) => Promise<void>;
  updatePermission: (id: string, data: Partial<Permission>) => Promise<void>;
  deletePermission: (id: string) => Promise<void>;
}

export const usePermissionsStore = (
  options: UsePermissionsStoreOptions = {},
): PermissionsStoreState => {
  const [permissions, setPermissions] = React.useState<Permission[]>([]);

  const getPermissions = React.useCallback(async (params?: GenericQueryParams) => {
    const res = await PermissionService.getPermissions(params);
    if (res.success && res.data) setPermissions(res.data);
  }, []);

  const createPermission = React.useCallback(
    async (data: Omit<Permission, "id">) => {
      const res = await PermissionService.createPermission(data);
      if (res.success) await getPermissions();
      else throw new Error(res.message);
    },
    [getPermissions],
  );

  const updatePermission = React.useCallback(
    async (id: string, data: Partial<Permission>) => {
      const res = await PermissionService.updatePermission(id, data);
      if (res.success) await getPermissions();
      else throw new Error(res.message);
    },
    [getPermissions],
  );

  const deletePermission = React.useCallback(
    async (id: string) => {
      const res = await PermissionService.deletePermission(id);
      if (res.success) {
        await getPermissions();
        if (options.onRolesRefresh) await options.onRolesRefresh();
      } else throw new Error(res.message);
    },
    [getPermissions, options.onRolesRefresh],
  );

  return { permissions, getPermissions, createPermission, updatePermission, deletePermission };
};

export default usePermissionsStore;
