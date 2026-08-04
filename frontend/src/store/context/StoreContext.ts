import * as React from "react";
import type { User, Role, Permission, ActivityLog, NavigationItem } from "@/lib/types";
import { CurrentUserPermissions } from "@/lib/permissions";
import { UserQueryParams, GenericQueryParams, Pagination } from "@/api";

export interface StoreState {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  logs: ActivityLog[];
  navigation: NavigationItem[];
  pagination: Record<string, Pagination>;
    // Authorization bootstrap status
  authorizationReady: boolean;
  // Actions
  getUsers: (params?: UserQueryParams) => Promise<void>;
  createUser: (data: any) => Promise<void>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  getRoles: (params?: GenericQueryParams) => Promise<void>;
  createRole: (data: any) => Promise<void>;
  updateRole: (id: string, data: any) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  updateRolePermissions: (id: string, perms: string[]) => Promise<void>;

  getPermissions: (params?: GenericQueryParams) => Promise<void>;
  createPermission: (data: any) => Promise<void>;
  updatePermission: (id: string, data: any) => Promise<void>;
  deletePermission: (id: string) => Promise<void>;

  getLogs: (params?: GenericQueryParams) => Promise<void>;
  addLog: (log: Omit<ActivityLog, "id" | "timestamp" | "ip">) => Promise<void>;
  
  getNavigation: () => Promise<void>;

  /* auth simulation */
  currentRoleId: string;
  setCurrentRoleId: (roleId: string) => void;
  currentUser: CurrentUserPermissions;
  superAdminPassword: string;
  setSuperAdminPassword: (pw: string) => void;

  /* permission helpers */
  hasPermission: (permKey: string) => boolean;
}

export const StoreCtx = React.createContext<StoreState | null>(null);
