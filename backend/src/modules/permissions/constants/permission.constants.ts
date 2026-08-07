export const PERMISSION_MODULES = {
  SIDEBAR_NAVIGATION: "Sidebar Navigation",
  USER_MANAGEMENT: "User Management",
  USER_MANAGEMENT_UI: "User Management UI",
  ROLE_ASSIGNMENT: "Role Assignment",
  ROLE_ASSIGNMENT_UI: "Role Assignment UI",
  PERMISSIONS: "Permissions",
  PERMISSIONS_UI: "Permissions UI",
  ACTIVITY_LOGS: "Activity Logs",
  ACTIVITY_LOGS_UI: "Activity Logs UI",
  SETTINGS: "Settings",
  SETTINGS_UI: "Settings UI",
} as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[keyof typeof PERMISSION_MODULES];

export const DEFAULT_PERMISSIONS = [
  // ── Sidebar Navigation (Global UI) ──
  { permissionId: "PRM_1A2B3C", id: "p1", name: "View Dashboard", key: "pages.dashboard", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Dashboard tab in the sidebar" },
  { permissionId: "PRM_2B3C4D", id: "p2", name: "View Users", key: "pages.users", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Users tab in the sidebar" },
  { permissionId: "PRM_3C4D5E", id: "p4", name: "View Permissions", key: "pages.permissions", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Permissions tab in the sidebar" },
  { permissionId: "PRM_4D5E6F", id: "p5", name: "View Role Assignment", key: "pages.assignment", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Role Assignment tab in the sidebar" },
  { permissionId: "PRM_5E6F7A", id: "p6", name: "View Activity Logs", key: "pages.logs", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Activity Logs tab in the sidebar" },
  { permissionId: "PRM_6F7A8B", id: "p7", name: "View Settings", key: "pages.settings", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Settings tab in the sidebar" },

  // ── User Management ──
  { permissionId: "PRM_7A8B9C", id: "p8", name: "Create User", key: "users.create", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow adding new users" },
  { permissionId: "PRM_8B9C0D", id: "p9", name: "Edit User", key: "users.update", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow modifying user data" },
  { permissionId: "PRM_9C0D1E", id: "p10", name: "Delete User", key: "users.delete", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow removing users" },
  { permissionId: "PRM_0D1E2F", id: "p11", name: "Export User", key: "users.export", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow downloading user list" },
  { permissionId: "PRM_1E2F3A", id: "p30", name: "View Full Email", key: "users.view_full_email", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow seeing unmasked email addresses" },
  { permissionId: "PRM_2F3A4B", id: "p45", name: "Reset User Password", key: "users.reset_password", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow admin or authorized users to reset another user's password" },

  // ── User Management UI ──
  { permissionId: "PRM_3A4B5C", id: "p19", name: "Column: Name", key: "users.col_name", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Name column" },
  { permissionId: "PRM_4B5C6D", id: "p20", name: "Column: Email", key: "users.col_email", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Email column" },
  { permissionId: "PRM_5C6D7E", id: "p23", name: "Column: Mobile", key: "users.col_mobile", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Mobile column" },
  { permissionId: "PRM_6D7E8F", id: "p22", name: "Column: Status", key: "users.col_status", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Status column" },
  { permissionId: "PRM_7E8F9A", id: "p21", name: "Column: Role", key: "users.col_role", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Role column" },
  { permissionId: "PRM_8F9A0B", id: "p24", name: "Column: User ID", key: "users.col_id", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show User ID column" },
  { permissionId: "PRM_9A0B1C", id: "p25", name: "Tab: Active Users", key: "users.tab_active", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Active tab" },
  { permissionId: "PRM_0B1C2D", id: "p26", name: "Tab: Inactive Users", key: "users.tab_inactive", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Inactive tab" },
  { permissionId: "PRM_1C2D3E", id: "p27", name: "Tab: Blocked Users", key: "users.tab_blocked", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Blocked tab" },
  { permissionId: "PRM_2D3E4F", id: "p28", name: "Tab: Pending Users", key: "users.tab_pending", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Pending tab" },
  { permissionId: "PRM_3E4F5A", id: "p29", name: "Section: User Details", key: "users.sec_details", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Details section in profile" },
  { permissionId: "PRM_4F5A6B", id: "p35", name: "Section: Security", key: "users.sec_security", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Security section in profile" },

  // ── Role Assignment ──
  { permissionId: "PRM_5A6B7C", id: "p12", name: "Create Role", key: "roles.create", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Create new roles" },
  { permissionId: "PRM_6B7C8D", id: "p31", name: "Edit Role", key: "roles.edit", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Edit existing roles" },
  { permissionId: "PRM_7C8D9E", id: "p32", name: "Delete Role", key: "roles.delete", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Delete roles" },
  { permissionId: "PRM_8D9E0F", id: "p14", name: "Assign Permissions", key: "roles.assign", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Toggle permissions for roles" },

  // ── Role Assignment UI ──
  { permissionId: "PRM_9E0F1A", id: "p33", name: "Toggle: Card View", key: "roles.ui_card", module: PERMISSION_MODULES.ROLE_ASSIGNMENT_UI, description: "Show Card View option" },
  { permissionId: "PRM_0F1A2B", id: "p34", name: "Toggle: List View", key: "roles.ui_list", module: PERMISSION_MODULES.ROLE_ASSIGNMENT_UI, description: "Show List View option" },

  // ── Permissions ──
  { permissionId: "PRM_1A2B3D", id: "p13", name: "Manage Permissions", key: "permissions.manage", module: PERMISSION_MODULES.PERMISSIONS, description: "Create, edit, and delete permissions" },
  
  // ── Permissions UI ──
  { permissionId: "PRM_2B3D4E", id: "p36", name: "Filter: Search Bar", key: "permissions.ui_search", module: PERMISSION_MODULES.PERMISSIONS_UI, description: "Show search filter" },
  { permissionId: "PRM_3D4E5F", id: "p37", name: "Filter: Module", key: "permissions.ui_filter", module: PERMISSION_MODULES.PERMISSIONS_UI, description: "Show module dropdown filter" },

  // ── Activity Logs ──
  { permissionId: "PRM_4E5F6A", id: "p42", name: "Export Logs", key: "logs.export", module: PERMISSION_MODULES.ACTIVITY_LOGS, description: "Export activity logs to CSV" },
  
  // ── Activity Logs UI ──
  { permissionId: "PRM_5F6A7B", id: "p43", name: "Filter: Search Bar", key: "logs.ui_search", module: PERMISSION_MODULES.ACTIVITY_LOGS_UI, description: "Show search filter" },
  { permissionId: "PRM_6A7B8C", id: "p44", name: "Filter: Type", key: "logs.ui_filter", module: PERMISSION_MODULES.ACTIVITY_LOGS_UI, description: "Show type dropdown filter" },

  // ── Settings ──
  { permissionId: "PRM_7B8C9D", id: "p16", name: "Reset User Passwords", key: "settings.password", module: PERMISSION_MODULES.SETTINGS, description: "Reset passwords for other members" },
  { permissionId: "PRM_8C9D0E", id: "p17", name: "Manage Integrations", key: "settings.integrations", module: PERMISSION_MODULES.SETTINGS, description: "Connect/disconnect integrations" },
  { permissionId: "PRM_9D0E1F", id: "p18", name: "Danger Zone Actions", key: "settings.danger", module: PERMISSION_MODULES.SETTINGS, description: "Execute destructive actions" },

  // ── Settings UI ──
  { permissionId: "PRM_0E1F2A", id: "p15", name: "Tab: Workspace", key: "settings.ui_workspace", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Workspace tab" },
  { permissionId: "PRM_1F2A3B", id: "p38", name: "Tab: Security", key: "settings.ui_security", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Security tab" },
  { permissionId: "PRM_2A3B4C", id: "p39", name: "Tab: Notifications", key: "settings.ui_notifications", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Notifications tab" },
//   {
//   permissionId: "PRM_TEST001",
//   key: "payments.viewss",
//   name: "View Payments"
// },

] as const;

export type DefaultPermission = (typeof DEFAULT_PERMISSIONS)[number];