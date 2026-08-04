import type { Permission } from "@/lib/types";

export const mockPermissions: Permission[] = [
  // ── Sidebar Navigation (Global UI) ──
  { id: "p1", name: "View Dashboard", key: "pages.dashboard", module: "Sidebar Navigation", description: "Show the Dashboard tab in the sidebar" },
  { id: "p2", name: "View Users", key: "pages.users", module: "Sidebar Navigation", description: "Show the Users tab in the sidebar" },
  { id: "p4", name: "View Permissions", key: "pages.permissions", module: "Sidebar Navigation", description: "Show the Permissions tab in the sidebar" },
  { id: "p5", name: "View Role Assignment", key: "pages.assignment", module: "Sidebar Navigation", description: "Show the Role Assignment tab in the sidebar" },
  { id: "p6", name: "View Activity Logs", key: "pages.logs", module: "Sidebar Navigation", description: "Show the Activity Logs tab in the sidebar" },
  { id: "p7", name: "View Settings", key: "pages.settings", module: "Sidebar Navigation", description: "Show the Settings tab in the sidebar" },

  // ── User Management ──
  { id: "p8", name: "Create User", key: "users.create", module: "User Management", description: "Allow adding new users" },
  { id: "p9", name: "Edit User", key: "users.update", module: "User Management", description: "Allow modifying user data" },
  { id: "p10", name: "Delete User", key: "users.delete", module: "User Management", description: "Allow removing users" },
  { id: "p11", name: "Export User", key: "users.export", module: "User Management", description: "Allow downloading user list" },
  { id: "p30", name: "View Full Email", key: "users.view_full_email", module: "User Management", description: "Allow seeing unmasked email addresses" },

  // ── User Management UI ──
  { id: "p19", name: "Column: Name", key: "users.col_name", module: "User Management UI", description: "Show Name column" },
  { id: "p20", name: "Column: Email", key: "users.col_email", module: "User Management UI", description: "Show Email column" },
  { id: "p23", name: "Column: Mobile", key: "users.col_mobile", module: "User Management UI", description: "Show Mobile column" },
  { id: "p22", name: "Column: Status", key: "users.col_status", module: "User Management UI", description: "Show Status column" },
  { id: "p21", name: "Column: Role", key: "users.col_role", module: "User Management UI", description: "Show Role column" },
  { id: "p24", name: "Column: User ID", key: "users.col_id", module: "User Management UI", description: "Show User ID column" },
  { id: "p25", name: "Tab: Active Users", key: "users.tab_active", module: "User Management UI", description: "Show Active tab" },
  { id: "p26", name: "Tab: Inactive Users", key: "users.tab_inactive", module: "User Management UI", description: "Show Inactive tab" },
  { id: "p27", name: "Tab: Blocked Users", key: "users.tab_blocked", module: "User Management UI", description: "Show Blocked tab" },
  { id: "p28", name: "Tab: Pending Users", key: "users.tab_pending", module: "User Management UI", description: "Show Pending tab" },
  { id: "p28", name: "Section: User Details", key: "users.sec_details", module: "User Management UI", description: "Show Details section in profile" },
  { id: "p29", name: "Section: Security", key: "users.sec_security", module: "User Management UI", description: "Show Security section in profile" },

  // ── Role Assignment ──
  { id: "p12", name: "Create Role", key: "roles.create", module: "Role Assignment", description: "Create new roles" },
  { id: "p31", name: "Edit Role", key: "roles.edit", module: "Role Assignment", description: "Edit existing roles" },
  { id: "p32", name: "Delete Role", key: "roles.delete", module: "Role Assignment", description: "Delete roles" },
  { id: "p14", name: "Assign Permissions", key: "roles.assign", module: "Role Assignment", description: "Toggle permissions for roles" },

  // ── Role Assignment UI ──
  { id: "p33", name: "Toggle: Card View", key: "roles.ui_card", module: "Role Assignment UI", description: "Show Card View option" },
  { id: "p34", name: "Toggle: List View", key: "roles.ui_list", module: "Role Assignment UI", description: "Show List View option" },

  // ── Permissions ──
  { id: "p13", name: "Manage Permissions", key: "permissions.manage", module: "Permissions", description: "Create, edit, and delete permissions" },
  
  // ── Permissions UI ──
  { id: "p36", name: "Filter: Search Bar", key: "permissions.ui_search", module: "Permissions UI", description: "Show search filter" },
  { id: "p37", name: "Filter: Module", key: "permissions.ui_filter", module: "Permissions UI", description: "Show module dropdown filter" },

  // ── Activity Logs ──
  { id: "p42", name: "Export Logs", key: "logs.export", module: "Activity Logs", description: "Export activity logs to CSV" },
  
  // ── Activity Logs UI ──
  { id: "p43", name: "Filter: Search Bar", key: "logs.ui_search", module: "Activity Logs UI", description: "Show search filter" },
  { id: "p44", name: "Filter: Type", key: "logs.ui_filter", module: "Activity Logs UI", description: "Show type dropdown filter" },

  // ── Settings ──
  { id: "p16", name: "Reset User Passwords", key: "settings.password", module: "Settings", description: "Reset passwords for other members" },
  { id: "p17", name: "Manage Integrations", key: "settings.integrations", module: "Settings", description: "Connect/disconnect integrations" },
  { id: "p18", name: "Danger Zone Actions", key: "settings.danger", module: "Settings", description: "Execute destructive actions" },

  // ── Settings UI ──
  { id: "p15", name: "Tab: Workspace", key: "settings.ui_workspace", module: "Settings UI", description: "Show Workspace tab" },
  { id: "p38", name: "Tab: Security", key: "settings.ui_security", module: "Settings UI", description: "Show Security tab" },
  { id: "p39", name: "Tab: Notifications", key: "settings.ui_notifications", module: "Settings UI", description: "Show Notifications tab" },
  { id: "p40", name: "Tab: Integrations", key: "settings.ui_integrations", module: "Settings UI", description: "Show Integrations tab" },
  { id: "p41", name: "Tab: Danger Zone", key: "settings.ui_danger", module: "Settings UI", description: "Show Danger Zone tab" },
];
