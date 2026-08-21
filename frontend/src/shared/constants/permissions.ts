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
  USERS_TAB_PENDING: "users.tab_pending",
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

  // ── Payments ──
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_EDIT: "payments.edit",
  PAYMENTS_DELETE: "payments.delete",
  PAYMENTS_EXPORT: "payments.export",
  TRANSACTIONS_APPROVE: "transactions.approve",
  TRANSACTIONS_REJECT: "transactions.reject",

  // ── Payments UI ──
  PAYMENTS_UI_SEARCH: "payments.ui_search",
  PAYMENTS_UI_STATUS: "payments.ui_status",
  PAYMENTS_UI_DIRECTION: "payments.ui_direction",
  PAYMENTS_UI_CATEGORY: "payments.ui_category",
  PAYMENTS_COL_USER: "payments.col_user",
  PAYMENTS_COL_AMOUNT: "payments.col_amount",
  PAYMENTS_COL_DIRECTION: "payments.col_direction",
  PAYMENTS_COL_STATUS: "payments.col_status",
  PAYMENTS_COL_CATEGORY: "payments.col_category",
  PAYMENTS_COL_SOURCE: "payments.col_source",
  PAYMENTS_COL_METHOD: "payments.col_method",
  PAYMENTS_COL_DATE: "payments.col_date",
  PAYMENTS_COL_ACTIONS: "payments.col_actions",

  // ── Transactions ──
  TRANSACTIONS_VIEW: "transactions.view",
  TRANSACTIONS_CREATE: "transactions.create",
  TRANSACTIONS_EDIT: "transactions.edit",
  TRANSACTIONS_DELETE: "transactions.delete",
  TRANSACTIONS_EXPORT: "transactions.export",

  // ── Transactions UI ──
  TRANSACTIONS_UI_SEARCH: "transactions.ui_search",
  TRANSACTIONS_UI_STATUS: "transactions.ui_status",
  TRANSACTIONS_UI_DIRECTION: "transactions.ui_direction",
  TRANSACTIONS_UI_CATEGORY: "transactions.ui_category",
  TRANSACTIONS_COL_USER: "transactions.col_user",
  TRANSACTIONS_COL_AMOUNT: "transactions.col_amount",
  TRANSACTIONS_COL_DIRECTION: "transactions.col_direction",
  TRANSACTIONS_COL_STATUS: "transactions.col_status",
  TRANSACTIONS_COL_CATEGORY: "transactions.col_category",
  TRANSACTIONS_COL_SOURCE: "transactions.col_source",
  TRANSACTIONS_COL_METHOD: "transactions.col_method",
  TRANSACTIONS_COL_DATE: "transactions.col_date",
  TRANSACTIONS_COL_ACTIONS: "transactions.col_actions",

  // ── Transaction Details ──
  TRANSACTION_DETAILS_VIEW: "transaction_details.view",
  TRANSACTION_DETAILS_APPROVE: "transaction_details.approve",
  TRANSACTION_DETAILS_REJECT: "transaction_details.reject",
  TRANSACTION_DETAILS_EDIT: "transaction_details.edit",
  TRANSACTION_DETAILS_EXPORT: "transaction_details.export",

  // ── Transaction Details UI ──
  TRANSACTIONS_SEC_INFO: "transactions.sec_info",
  TRANSACTIONS_SEC_USER: "transactions.sec_user",
  TRANSACTIONS_SEC_PAYMENT: "transactions.sec_payment",
  TRANSACTIONS_SEC_ATTACHMENT: "transactions.sec_attachment",
  TRANSACTIONS_SEC_NOTES: "transactions.sec_notes",
  TRANSACTIONS_SEC_VERIFICATION: "transactions.sec_verification",
  TRANSACTIONS_SEC_LINKED: "transactions.sec_linked",
  TRANSACTIONS_SEC_TIMELINE: "transactions.sec_timeline",
  TRANSACTIONS_VIEW_AMOUNT: "transactions.view_amount",
  TRANSACTIONS_EDIT_AMOUNT: "transactions.edit_amount",

  // ── Transaction Details UI Visibility ──
  TRANSACTIONS_UI_APPROVE: "transactions.ui_approve",
  TRANSACTIONS_UI_REJECT: "transactions.ui_reject",
  TRANSACTIONS_UI_EDIT: "transactions.ui_edit",
  TRANSACTIONS_UI_VIEW_PROFILE: "transactions.ui_view_profile",
  TRANSACTIONS_UI_OPEN_ATTACHMENT: "transactions.ui_open_attachment",
  TRANSACTIONS_UI_DOWNLOAD_ATTACHMENT: "transactions.ui_download_attachment",
  TRANSACTIONS_UI_EDIT_AMOUNT: "transactions.ui_edit_amount",
} as const;

export type PermissionKey = (typeof PERM)[keyof typeof PERM];
