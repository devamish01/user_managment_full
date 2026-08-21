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
  PAYMENTS: "Payments",
  PAYMENTS_UI: "Payments UI",
  TRANSACTIONS: "Transactions",
  TRANSACTIONS_UI: "Transactions UI",
  TRANSACTION_DETAILS: "Transaction Details",
  TRANSACTION_DETAILS_UI: "Transaction Details UI",
} as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[keyof typeof PERMISSION_MODULES];

export const DEFAULT_PERMISSIONS = [
  // ── Sidebar Navigation (Global UI) ──
  { permissionId: "PRM_001", id: "p001", name: "View Dashboard", key: "pages.dashboard", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Dashboard tab in the sidebar" },
  { permissionId: "PRM_002", id: "p002", name: "View Users", key: "pages.users", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Users tab in the sidebar" },
  { permissionId: "PRM_003", id: "p003", name: "View Permissions", key: "pages.permissions", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Permissions tab in the sidebar" },
  { permissionId: "PRM_004", id: "p004", name: "View Role Assignment", key: "pages.assignment", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Role Assignment tab in the sidebar" },
  { permissionId: "PRM_005", id: "p005", name: "View Activity Logs", key: "pages.logs", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Activity Logs tab in the sidebar" },
  { permissionId: "PRM_006", id: "p006", name: "View Settings", key: "pages.settings", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Settings tab in the sidebar" },
  { permissionId: "PRM_007", id: "p007", name: "View Overview", key: "pages.overview", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the overview tab in the sidebar" },
  { permissionId: "PRM_008", id: "p008", name: "View Payments", key: "pages.payments", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Payments tab in the sidebar" },
  { permissionId: "PRM_009", id: "p009", name: "View Transactions", key: "pages.transactions", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show the Transactions tab in the sidebar" },
  { permissionId: "PRM_010", id: "p010", name: "View Transaction Details", key: "pages.transactions.details", module: PERMISSION_MODULES.SIDEBAR_NAVIGATION, description: "Show Transaction Details page" },

  // ── User Management ──
  { permissionId: "PRM_011", id: "p011", name: "Create User", key: "users.create", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow adding new users" },
  { permissionId: "PRM_012", id: "p012", name: "Edit User", key: "users.update", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow modifying user data" },
  { permissionId: "PRM_013", id: "p013", name: "Delete User", key: "users.delete", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow removing users" },
  { permissionId: "PRM_014", id: "p014", name: "Export User", key: "users.export", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow downloading user list" },
  { permissionId: "PRM_015", id: "p015", name: "View Full Email", key: "users.view_full_email", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow seeing unmasked email addresses" },
  { permissionId: "PRM_016", id: "p016", name: "Reset User Password", key: "users.reset_password", module: PERMISSION_MODULES.USER_MANAGEMENT, description: "Allow admin or authorized users to reset another user's password" },

  // ── User Management UI ──
  { permissionId: "PRM_017", id: "p017", name: "Column: Name", key: "users.col_name", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Name column" },
  { permissionId: "PRM_018", id: "p018", name: "Column: Email", key: "users.col_email", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Email column" },
  { permissionId: "PRM_019", id: "p019", name: "Column: Mobile", key: "users.col_mobile", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Mobile column" },
  { permissionId: "PRM_020", id: "p020", name: "Column: Status", key: "users.col_status", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Status column" },
  { permissionId: "PRM_021", id: "p021", name: "Column: Role", key: "users.col_role", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Role column" },
  { permissionId: "PRM_022", id: "p022", name: "Column: User ID", key: "users.col_id", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show User ID column" },
  { permissionId: "PRM_023", id: "p023", name: "Tab: Active Users", key: "users.tab_active", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Active tab" },
  { permissionId: "PRM_024", id: "p024", name: "Tab: Inactive Users", key: "users.tab_inactive", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Inactive tab" },
  { permissionId: "PRM_025", id: "p025", name: "Tab: Blocked Users", key: "users.tab_blocked", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Blocked tab" },
  { permissionId: "PRM_026", id: "p026", name: "Tab: Pending Users", key: "users.tab_pending", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Pending tab" },
  { permissionId: "PRM_027", id: "p027", name: "Section: User Details", key: "users.sec_details", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Details section in profile" },
  { permissionId: "PRM_028", id: "p028", name: "Section: Security", key: "users.sec_security", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Security section in profile" },
  { permissionId: "PRM_029", id: "p029", name: "Section: Payments", key: "users.sec_payments", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Payments section in user profile" },
  { permissionId: "PRM_030", id: "p030", name: "Section: Payment Stats", key: "users.sec_payment_stats", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Payment Stats section in user profile" },
  { permissionId: "PRM_031", id: "p031", name: "Section: Recent Transactions", key: "users.sec_recent_transactions", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "Show Recent Transactions section in user profile" },
  { permissionId: "PRM_032", id: "p032", name: "View Payment Amount", key: "users.view_payment_amount", module: PERMISSION_MODULES.USER_MANAGEMENT_UI, description: "View payment amounts in user profile" },

  // ── Role Assignment ──
  { permissionId: "PRM_033", id: "p033", name: "Create Role", key: "roles.create", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Create new roles" },
  { permissionId: "PRM_034", id: "p034", name: "Edit Role", key: "roles.edit", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Edit existing roles" },
  { permissionId: "PRM_035", id: "p035", name: "Delete Role", key: "roles.delete", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Delete roles" },
  { permissionId: "PRM_036", id: "p036", name: "Assign Permissions", key: "roles.assign", module: PERMISSION_MODULES.ROLE_ASSIGNMENT, description: "Toggle permissions for roles" },

  // ── Role Assignment UI ──
  { permissionId: "PRM_037", id: "p037", name: "Toggle: Card View", key: "roles.ui_card", module: PERMISSION_MODULES.ROLE_ASSIGNMENT_UI, description: "Show Card View option" },
  { permissionId: "PRM_038", id: "p038", name: "Toggle: List View", key: "roles.ui_list", module: PERMISSION_MODULES.ROLE_ASSIGNMENT_UI, description: "Show List View option" },

  // ── Permissions ──
  { permissionId: "PRM_039", id: "p039", name: "Manage Permissions", key: "permissions.manage", module: PERMISSION_MODULES.PERMISSIONS, description: "Create, edit, and delete permissions" },
  
  // ── Permissions UI ──
  { permissionId: "PRM_040", id: "p040", name: "Filter: Search Bar", key: "permissions.ui_search", module: PERMISSION_MODULES.PERMISSIONS_UI, description: "Show search filter" },
  { permissionId: "PRM_041", id: "p041", name: "Filter: Module", key: "permissions.ui_filter", module: PERMISSION_MODULES.PERMISSIONS_UI, description: "Show module dropdown filter" },

  // ── Activity Logs ──
  { permissionId: "PRM_042", id: "p042", name: "Export Logs", key: "logs.export", module: PERMISSION_MODULES.ACTIVITY_LOGS, description: "Export activity logs to CSV" },
  
  // ── Activity Logs UI ──
  { permissionId: "PRM_043", id: "p043", name: "Filter: Search Bar", key: "logs.ui_search", module: PERMISSION_MODULES.ACTIVITY_LOGS_UI, description: "Show search filter" },
  { permissionId: "PRM_044", id: "p044", name: "Filter: Type", key: "logs.ui_filter", module: PERMISSION_MODULES.ACTIVITY_LOGS_UI, description: "Show type dropdown filter" },

  // ── Settings ──
  { permissionId: "PRM_045", id: "p045", name: "Reset User Passwords", key: "settings.password", module: PERMISSION_MODULES.SETTINGS, description: "Reset passwords for other members" },
  { permissionId: "PRM_046", id: "p046", name: "Manage Integrations", key: "settings.integrations", module: PERMISSION_MODULES.SETTINGS, description: "Connect/disconnect integrations" },
  { permissionId: "PRM_047", id: "p047", name: "Danger Zone Actions", key: "settings.danger", module: PERMISSION_MODULES.SETTINGS, description: "Execute destructive actions" },

  // ── Settings UI ──
  { permissionId: "PRM_048", id: "p048", name: "Tab: Workspace", key: "settings.ui_workspace", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Workspace tab" },
  { permissionId: "PRM_049", id: "p049", name: "Tab: Security", key: "settings.ui_security", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Security tab" },
  { permissionId: "PRM_050", id: "p050", name: "Tab: Notifications", key: "settings.ui_notifications", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Notifications tab" },
  { permissionId: "PRM_051", id: "p051", name: "Tab: Integrations", key: "settings.ui_integrations", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Integrations tab" },
  { permissionId: "PRM_052", id: "p052", name: "Tab: Danger Zone", key: "settings.ui_danger", module: PERMISSION_MODULES.SETTINGS_UI, description: "Show Danger Zone tab" },

  // ── Payments ──
  { permissionId: "PRM_053", id: "p053", name: "View Payments", key: "payments.view", module: PERMISSION_MODULES.PAYMENTS, description: "View payment records" },
  { permissionId: "PRM_054", id: "p054", name: "Create Payment", key: "payments.create", module: PERMISSION_MODULES.PAYMENTS, description: "Create new payment records" },
  { permissionId: "PRM_055", id: "p055", name: "Edit Payment", key: "payments.edit", module: PERMISSION_MODULES.PAYMENTS, description: "Edit existing payment records" },
  { permissionId: "PRM_056", id: "p056", name: "Delete Payment", key: "payments.delete", module: PERMISSION_MODULES.PAYMENTS, description: "Delete payment records" },
  { permissionId: "PRM_057", id: "p057", name: "Export Payments", key: "payments.export", module: PERMISSION_MODULES.PAYMENTS, description: "Export payment records" },
  { permissionId: "PRM_058", id: "p058", name: "Approve Transaction", key: "transactions.approve", module: PERMISSION_MODULES.PAYMENTS, description: "Approve pending transactions" },
  { permissionId: "PRM_059", id: "p059", name: "Reject Transaction", key: "transactions.reject", module: PERMISSION_MODULES.PAYMENTS, description: "Reject pending transactions" },

  // ── Payments UI ──
  { permissionId: "PRM_060", id: "p060", name: "Filter: Search Bar", key: "payments.ui_search", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show search filter" },
  { permissionId: "PRM_061", id: "p061", name: "Filter: Status", key: "payments.ui_status", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show status dropdown filter" },
  { permissionId: "PRM_062", id: "p062", name: "Filter: Direction", key: "payments.ui_direction", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show direction dropdown filter" },
  { permissionId: "PRM_063", id: "p063", name: "Filter: Category", key: "payments.ui_category", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show category dropdown filter" },
  { permissionId: "PRM_064", id: "p064", name: "Column: User", key: "payments.col_user", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show User column" },
  { permissionId: "PRM_065", id: "p065", name: "Column: Amount", key: "payments.col_amount", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Amount column" },
  { permissionId: "PRM_066", id: "p066", name: "Column: Direction", key: "payments.col_direction", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Direction column" },
  { permissionId: "PRM_067", id: "p067", name: "Column: Status", key: "payments.col_status", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Status column" },
  { permissionId: "PRM_068", id: "p068", name: "Column: Category", key: "payments.col_category", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Category column" },
  { permissionId: "PRM_069", id: "p069", name: "Column: Source", key: "payments.col_source", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Source column" },
  { permissionId: "PRM_070", id: "p070", name: "Column: Method", key: "payments.col_method", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Method column" },
  { permissionId: "PRM_071", id: "p071", name: "Column: Date", key: "payments.col_date", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Date column" },
  { permissionId: "PRM_072", id: "p072", name: "Column: Actions", key: "payments.col_actions", module: PERMISSION_MODULES.PAYMENTS_UI, description: "Show Actions column" },

  // ── Transactions ──
  { permissionId: "PRM_073", id: "p073", name: "View Transactions", key: "transactions.view", module: PERMISSION_MODULES.TRANSACTIONS, description: "View transaction list" },
  { permissionId: "PRM_074", id: "p074", name: "Create Transaction", key: "transactions.create", module: PERMISSION_MODULES.TRANSACTIONS, description: "Create new transactions" },
  { permissionId: "PRM_075", id: "p075", name: "Edit Transaction", key: "transactions.edit", module: PERMISSION_MODULES.TRANSACTIONS, description: "Edit existing transactions" },
  { permissionId: "PRM_076", id: "p076", name: "Delete Transaction", key: "transactions.delete", module: PERMISSION_MODULES.TRANSACTIONS, description: "Delete transactions" },
  { permissionId: "PRM_077", id: "p077", name: "Export Transactions", key: "transactions.export", module: PERMISSION_MODULES.TRANSACTIONS, description: "Export transaction records" },

  // ── Transactions UI ──
  { permissionId: "PRM_078", id: "p078", name: "Filter: Search Bar", key: "transactions.ui_search", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show search filter" },
  { permissionId: "PRM_079", id: "p079", name: "Filter: Status", key: "transactions.ui_status", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show status dropdown filter" },
  { permissionId: "PRM_080", id: "p080", name: "Filter: Direction", key: "transactions.ui_direction", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show direction dropdown filter" },
  { permissionId: "PRM_081", id: "p081", name: "Filter: Category", key: "transactions.ui_category", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show category dropdown filter" },
  { permissionId: "PRM_082", id: "p082", name: "Column: User", key: "transactions.col_user", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show User column" },
  { permissionId: "PRM_083", id: "p083", name: "Column: Amount", key: "transactions.col_amount", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Amount column" },
  { permissionId: "PRM_084", id: "p084", name: "Column: Direction", key: "transactions.col_direction", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Direction column" },
  { permissionId: "PRM_085", id: "p085", name: "Column: Status", key: "transactions.col_status", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Status column" },
  { permissionId: "PRM_086", id: "p086", name: "Column: Category", key: "transactions.col_category", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Category column" },
  { permissionId: "PRM_087", id: "p087", name: "Column: Source", key: "transactions.col_source", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Source column" },
  { permissionId: "PRM_088", id: "p088", name: "Column: Method", key: "transactions.col_method", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Method column" },
  { permissionId: "PRM_089", id: "p089", name: "Column: Date", key: "transactions.col_date", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Date column" },
  { permissionId: "PRM_090", id: "p090", name: "Column: Actions", key: "transactions.col_actions", module: PERMISSION_MODULES.TRANSACTIONS_UI, description: "Show Actions column" },

  // ── Transaction Details ──
  { permissionId: "PRM_091", id: "p091", name: "View Transaction Details", key: "transaction_details.view", module: PERMISSION_MODULES.TRANSACTION_DETAILS, description: "View transaction details" },
  { permissionId: "PRM_092", id: "p092", name: "Approve Transaction", key: "transaction_details.approve", module: PERMISSION_MODULES.TRANSACTION_DETAILS, description: "Approve transaction" },
  { permissionId: "PRM_093", id: "p093", name: "Reject Transaction", key: "transaction_details.reject", module: PERMISSION_MODULES.TRANSACTION_DETAILS, description: "Reject transaction" },
  { permissionId: "PRM_094", id: "p094", name: "Edit Transaction", key: "transaction_details.edit", module: PERMISSION_MODULES.TRANSACTION_DETAILS, description: "Edit transaction" },
  { permissionId: "PRM_095", id: "p095", name: "Export Transaction", key: "transaction_details.export", module: PERMISSION_MODULES.TRANSACTION_DETAILS, description: "Export transaction details" },

  // ── Transaction Details UI ──
  { permissionId: "PRM_096", id: "p096", name: "Section: Transaction Info", key: "transactions.sec_info", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Transaction Information section" },
  { permissionId: "PRM_097", id: "p097", name: "Section: User Info", key: "transactions.sec_user", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show User Information section" },
  { permissionId: "PRM_098", id: "p098", name: "Section: Payment Info", key: "transactions.sec_payment", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Payment Information section" },
  { permissionId: "PRM_099", id: "p099", name: "Section: Attachment", key: "transactions.sec_attachment", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Attachment section" },
  { permissionId: "PRM_100", id: "p100", name: "Section: Notes", key: "transactions.sec_notes", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Notes section" },
  { permissionId: "PRM_101", id: "p101", name: "Section: Verification", key: "transactions.sec_verification", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Verification Information section" },
  { permissionId: "PRM_102", id: "p102", name: "Section: Linked Modules", key: "transactions.sec_linked", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Linked Modules section" },
  { permissionId: "PRM_103", id: "p103", name: "Section: Timeline", key: "transactions.sec_timeline", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Timeline/Activity section" },
  { permissionId: "PRM_104", id: "p104", name: "Section: History", key: "transactions.sec_history", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Transaction History section" },
  { permissionId: "PRM_105", id: "p105", name: "View Transaction Amount", key: "transactions.view_amount", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "View transaction amount" },
  { permissionId: "PRM_106", id: "p106", name: "Edit Transaction Amount", key: "transactions.edit_amount", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Edit transaction amount" },

  // ── Transaction Details UI Visibility ──
  { permissionId: "PRM_107", id: "p107", name: "Button: Approve", key: "transactions.ui_approve", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Approve button" },
  { permissionId: "PRM_108", id: "p108", name: "Button: Reject", key: "transactions.ui_reject", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Reject button" },
  { permissionId: "PRM_109", id: "p109", name: "Button: Edit", key: "transactions.ui_edit", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Edit button" },
  { permissionId: "PRM_110", id: "p110", name: "Button: View Profile", key: "transactions.ui_view_profile", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show View Profile button in User section" },
  { permissionId: "PRM_111", id: "p111", name: "Button: Open Attachment", key: "transactions.ui_open_attachment", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Open Attachment button" },
  { permissionId: "PRM_112", id: "p112", name: "Button: Download Attachment", key: "transactions.ui_download_attachment", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Download Attachment button" },
  { permissionId: "PRM_113", id: "p113", name: "Button: Edit Amount", key: "transactions.ui_edit_amount", module: PERMISSION_MODULES.TRANSACTION_DETAILS_UI, description: "Show Edit Amount button" },

] as const;

export type DefaultPermission = (typeof DEFAULT_PERMISSIONS)[number];