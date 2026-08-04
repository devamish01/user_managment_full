/**
 * StoreProvider — global composition layer.
 *
 * After the auth/authz split this component owns only:
 *   - composition of feature stores (users, roles, permissions)
 *   - logs, navigation
 *   - the public `StoreState` shape so existing consumers keep working
 *
 * Authentication identity (`currentUser`, session, isAuthenticated) is now
 * sourced exclusively from the auth store via `useAuth()`. Authorization
 * rules live in `core/authorization` and are never calculated here.
 */

import * as React from "react";
import type { ActivityLog } from "@/lib/types";
import { SystemService } from "@/services/system.service";
import { useAuth } from "@/modules/auth/hooks";
import { AuthService } from "@/modules/auth/services";
import { buildCurrentUserPermissions } from "@/core/authorization";
import type { GenericQueryParams } from "@/api";

import useRolesStore from "@/modules/roles/store";
import usePermissionsStore from "@/modules/permissions/store";
import useNavigationStore from "@/modules/navigation/store";
import useUsersStore from "@/modules/users/store";

import { StoreCtx } from "../context/StoreContext";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // console.count('render store provider')
  
  /* ── Feature module stores (composition) ────────────────────────── */
  const rolesStore = useRolesStore();
  const usersStore = useUsersStore();

  const permissionsStore = usePermissionsStore({
    onRolesRefresh: rolesStore.getRoles,
  });
  const [authorizationReady, setAuthorizationReady] = React.useState(false);
  /* ── Authentication identity from the auth store ──────────────── */
  const auth = useAuth();
  const currentUser = auth.currentUser
    ? buildCurrentUserPermissions({
        id: auth.currentUser.id,
        name: auth.currentUser.name,
        email: auth.currentUser.email,
        roleId: auth.currentUser.roleId,
        roles: rolesStore.roles,
        permissions: permissionsStore.permissions,
      })
    : null;
  /* ── Navigation feature store (composition) ─────────────────────── */
  const navigationStore = useNavigationStore();

  /* ── Global state that is not owned by any feature module ──────── */
  // const [logs, setLogs] = React.useState<ActivityLog[]>([]);

  // /* ── Global actions (logs) ─────────────────────────── */
  // const getLogs = React.useCallback(async (params?: GenericQueryParams) => {
  //   const res = await SystemService.getLogs(params);
  //   if (res.success && res.data) setLogs(res.data);
  // }, []);

  // const addLog = React.useCallback(async (log: Omit<ActivityLog, "id" | "timestamp" | "ip">) => {
  //   const res = await SystemService.addLog(log);
  //   if (res.success) await getLogs();
  // }, [getLogs]);


  /* ── Global bootstrap sequence (no auth here) ───────────────────── */
  const loadInitialData = React.useCallback(async () => {
    try {
      await rolesStore.getRoles();
      await permissionsStore.getPermissions();

      // await getLogs();
      await navigationStore.getNavigation();

    } catch (err) {
      console.error("Failed to load initial data", err);
    } finally {
      setAuthorizationReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /* ── Role switching delegated to auth store ────────────────────── */
  const handleRoleSwitch = React.useCallback(async (roleId: string) => {
    await auth.switchUser(roleId);
  }, [auth]);

  /* ── Derived permission helper ──────────────────────────────────── */
  const hasPermission = React.useCallback(
    (permKey: string) => {
      if (!currentUser) return false;
      return currentUser.permissions.includes(permKey);
    },
    [currentUser],
  );

  /* ── Composed value — preserves the exact public StoreState shape ── */
// console.log('currentUser',currentUser?.permissions)
  const value = React.useMemo(
    () => ({
      // Feature module state + actions
      ...rolesStore,
      ...permissionsStore,
      ...usersStore,
  
      // Global state
      // logs,
      // Navigation state + action — sourced from the navigation feature store
      // so the public StoreState shape stays backward-compatible.
      navigation: navigationStore.navigation,
      // Global actions
      // getLogs,
      // addLog,
      getNavigation: navigationStore.getNavigation,
      authorizationReady,
      // Auth / current user (sourced from auth store)
      currentRoleId: currentUser?.roleId ?? "",
      setCurrentRoleId: handleRoleSwitch,
      currentUser: currentUser ?? {
        id: "",
        name: "",
        email: "",
        roleId: "",
        role: null,
        permissions: [],
      },
      superAdminPassword: "",
      setSuperAdminPassword: (pw: string) => {
        void AuthService.setSuperAdminPassword(pw);
      },
      // Permission helpers
      hasPermission,
    }),
    [
      rolesStore,
      permissionsStore,
      usersStore,
      // logs,
      navigationStore,
      authorizationReady,
      // getLogs,
      // addLog,
      currentUser,
      handleRoleSwitch,
      hasPermission,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
};

export default StoreProvider;
