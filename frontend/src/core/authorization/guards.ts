/**
 * Authorization — route and feature guards.
 *
 * Pure functions that answer "is this principal allowed to do X?" without
 * touching React, the router, or any store. Components and route wrappers
 * call into this module so that the rules live in one place and stay
 * trivially unit-testable.
 */

import { hasPermission, hasAnyPermission } from "./permissions";
import type { RouteName } from "@/shared/constants/routes";

/** Route → permission key mapping. Mirrors the registry in routes/. */
export const ROUTE_PERMISSIONS: Record<RouteName, string | null> = {
  dashboard: "pages.dashboard",
  users: "pages.users",
  userDetails: "pages.users",
  userForm: "pages.users",
  permissions: "pages.permissions",
  assignment: "pages.assignment",
  logs: "pages.logs",
  settings: "pages.settings",
};

/** True when the principal can navigate to `routeName`. */
export const canAccessRoute = (
  routeName: RouteName,
  permissions: string[],
  roleId?: string | null,
): boolean => {
  const key = ROUTE_PERMISSIONS[routeName];
  if (!key) return true;
  return hasPermission(permissions, key, roleId);
};

/** True when the principal can access at least one of the given routes. */
export const canAccessAnyRoute = (
  routeNames: RouteName[],
  permissions: string[],
  roleId?: string | null,
): boolean => {
  const keys = routeNames
    .map((r) => ROUTE_PERMISSIONS[r])
    .filter((k): k is string => Boolean(k));
  return hasAnyPermission(permissions, keys, roleId);
};

/**
 * Higher-order helper: returns the subset of `routeNames` the principal
 * can access. Useful for building navigation menus that hide forbidden
 * entries without sprinkling permission checks through JSX.
 */
export const filterAccessibleRoutes = (
  routeNames: RouteName[],
  permissions: string[],
  roleId?: string | null,
): RouteName[] =>
  routeNames.filter((r) => canAccessRoute(r, permissions, roleId));
