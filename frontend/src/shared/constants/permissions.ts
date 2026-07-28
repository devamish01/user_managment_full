/**
 * Permission key constants.
 * Replaces magic strings like "users.create" throughout the codebase.
 * Modules and pages should reference PERM.USERS_CREATE instead of raw strings.
 */

export const PERM = {
  // ── Sidebar Navigation ──
  PAGES_DASHBOARD: "pages.dashboard",
  PAGES_USERS: "pages.users",
  PAGES_PERMISSIONS: "pages.permissions",
  PAGES_ASSIGNMENT: "pages.assignment",
  PAGES_LOGS: "pages.logs",
  PAGES_SETTINGS: "pages.settings",

  // ── User Management Actions ──
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_EXPORT: "users.export",
  USERS_VIEW_FULL_EMAIL: "users.view_full_email",

  // ── User Management UI Visibility ──
  USERS_COL_NAME: "users.col_name",
  USERS_COL_EMAIL: "users.col_email",
  USERS_COL_MOBILE: "users.col_mobile",
  USERS_COL_STATUS: "users.col_status",
  USERS_COL_ROLE: "users.col_role",
  USERS_COL_ID: "users.col_id",
  USERS_TAB_ACTIVE: "users.tab_active",
  USERS_TAB_INACTIVE: "users.tab_inactive",
  USERS_TAB_BLOCKED: "users.tab_blocked",
  USERS_SEC_DETAILS: "users.sec_details",
  USERS_SEC_SECURITY: "users.sec_security",

  // ── Role Assignment ──
  ROLES_CREATE: "roles.create",
  ROLES_EDIT: "roles.edit",
  ROLES_DELETE: "roles.delete",
  ROLES_ASSIGN: "roles.assign",
  ROLES_UI_CARD: "roles.ui_card",
  ROLES_UI_LIST: "roles.ui_list",

  // ── Permissions ──
  PERMISSIONS_MANAGE: "permissions.manage",
  PERMISSIONS_UI_SEARCH: "permissions.ui_search",
  PERMISSIONS_UI_FILTER: "permissions.ui_filter",

  // ── Activity Logs ──
  LOGS_EXPORT: "logs.export",
  LOGS_UI_SEARCH: "logs.ui_search",
  LOGS_UI_FILTER: "logs.ui_filter",

  // ── Settings ──
  SETTINGS_PASSWORD: "settings.password",
  SETTINGS_INTEGRATIONS: "settings.integrations",
  SETTINGS_DANGER: "settings.danger",
  SETTINGS_UI_WORKSPACE: "settings.ui_workspace",
  SETTINGS_UI_SECURITY: "settings.ui_security",
  SETTINGS_UI_NOTIFICATIONS: "settings.ui_notifications",
  SETTINGS_UI_INTEGRATIONS: "settings.ui_integrations",
  SETTINGS_UI_DANGER: "settings.ui_danger",
} as const;

export type PermissionKey = (typeof PERM)[keyof typeof PERM];
