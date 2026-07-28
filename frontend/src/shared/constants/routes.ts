/**
 * Route name constants.
 * Replaces magic strings like "dashboard", "users", "settings".
 * Used by the router, sidebar nav, and permission guards.
 */

export const ROUTE = {
  DASHBOARD: "dashboard",
  USERS: "users",
  USER_DETAILS: "userDetails",
  USER_FORM: "userForm",
  PERMISSIONS: "permissions",
  ASSIGNMENT: "assignment",
  LOGS: "logs",
  SETTINGS: "settings",
} as const;

export type RouteName = (typeof ROUTE)[keyof typeof ROUTE];
