import type { Permission } from "@/lib/types";

export const mockPermissions: Permission[] = [
  // ── Sidebar Navigation (Global UI) ──
  { id: "p1", name: "View Dashboard", key: "pages.dashboard", module: "Sidebar Navigation", description: "Show the Dashboard tab in the sidebar", assignedRolesCount: 4 },
  { id: "p2", name: "View Users", key: "pages.users", module: "Sidebar Navigation", description: "Show the Users tab in the sidebar", assignedRolesCount: 4 },
  { id: "p4", name: "View Permissions", key: "pages.permissions", module: "Sidebar Navigation", description: "Show the Permissions tab in the sidebar", assignedRolesCount: 2 },
  { id: "p5", name: "View Role Assignment", key: "pages.assignment", module: "Sidebar Navigation", description: "Show the Role Assignment tab in the sidebar", assignedRolesCount: 2 },
  { id: "p6", name: "View Activity Logs", key: "pages.logs", module: "Sidebar Navigation", description: "Show the Activity Logs tab in the sidebar", assignedRolesCount: 2 },
  { id: "p7", name: "View Settings", key: "pages.settings", module: "Sidebar Navigation", description: "Show the Settings tab in the sidebar", assignedRolesCount: 4 },
  { id: "p45", name: "View Payments", key: "pages.payments", module: "Sidebar Navigation", description: "Show the Payments tab in the sidebar", assignedRolesCount: 4 },
  { id: "p46", name: "View Transactions", key: "pages.transactions", module: "Sidebar Navigation", description: "Show the Transactions tab in the sidebar", assignedRolesCount: 4 },

  // ── User Management ──
  { id: "p8", name: "Create User", key: "users.create", module: "User Management", description: "Allow adding new users", assignedRolesCount: 2 },
  { id: "p9", name: "Edit User", key: "users.update", module: "User Management", description: "Allow modifying user data", assignedRolesCount: 3 },
  { id: "p10", name: "Delete User", key: "users.delete", module: "User Management", description: "Allow removing users", assignedRolesCount: 2 },
  { id: "p11", name: "Export User", key: "users.export", module: "User Management", description: "Allow downloading user list", assignedRolesCount: 2 },
  { id: "p30", name: "View Full Email", key: "users.view_full_email", module: "User Management", description: "Allow seeing unmasked email addresses", assignedRolesCount: 3 },
  { id: "p68", name: "Reset User Password", key: "users.reset_password", module: "User Management", description: "Allow resetting passwords for other users", assignedRolesCount: 2 },

  // ── User Management UI ──
  { id: "p19", name: "Column: Name", key: "users.col_name", module: "User Management UI", description: "Show Name column", assignedRolesCount: 3 },
  { id: "p20", name: "Column: Email", key: "users.col_email", module: "User Management UI", description: "Show Email column", assignedRolesCount: 3 },
  { id: "p23", name: "Column: Mobile", key: "users.col_mobile", module: "User Management UI", description: "Show Mobile column", assignedRolesCount: 3 },
  { id: "p22", name: "Column: Status", key: "users.col_status", module: "User Management UI", description: "Show Status column", assignedRolesCount: 3 },
  { id: "p21", name: "Column: Role", key: "users.col_role", module: "User Management UI", description: "Show Role column", assignedRolesCount: 3 },
  { id: "p24", name: "Column: User ID", key: "users.col_id", module: "User Management UI", description: "Show User ID column", assignedRolesCount: 3 },
  { id: "p25", name: "Tab: Active Users", key: "users.tab_active", module: "User Management UI", description: "Show Active tab", assignedRolesCount: 3 },
  { id: "p26", name: "Tab: Inactive Users", key: "users.tab_inactive", module: "User Management UI", description: "Show Inactive tab", assignedRolesCount: 3 },
  { id: "p27", name: "Tab: Blocked Users", key: "users.tab_blocked", module: "User Management UI", description: "Show Blocked tab", assignedRolesCount: 3 },
  { id: "p28", name: "Tab: Pending Users", key: "users.tab_pending", module: "User Management UI", description: "Show Pending tab", assignedRolesCount: 3 },
  { id: "p29", name: "Section: User Details", key: "users.sec_details", module: "User Management UI", description: "Show Details section in profile", assignedRolesCount: 3 },
  { id: "p35", name: "Section: Security", key: "users.sec_security", module: "User Management UI", description: "Show Security section in profile", assignedRolesCount: 3 },
  { id: "p69", name: "Section: Payments", key: "users.sec_payments", module: "User Management UI", description: "Show Payments section in user profile", assignedRolesCount: 3 },
  { id: "p70", name: "Section: Payment Stats", key: "users.sec_payment_stats", module: "User Management UI", description: "Show Payment Stats section in user profile", assignedRolesCount: 3 },
  { id: "p71", name: "Section: Recent Transactions", key: "users.sec_recent_transactions", module: "User Management UI", description: "Show Recent Transactions section in user profile", assignedRolesCount: 3 },
  { id: "p72", name: "View Payment Amount", key: "users.view_payment_amount", module: "User Management UI", description: "View payment amounts in user profile", assignedRolesCount: 3 },

  // ── Role Assignment ──
  { id: "p12", name: "Create Role", key: "roles.create", module: "Role Assignment", description: "Create new roles", assignedRolesCount: 2 },
  { id: "p31", name: "Edit Role", key: "roles.edit", module: "Role Assignment", description: "Edit existing roles", assignedRolesCount: 2 },
  { id: "p32", name: "Delete Role", key: "roles.delete", module: "Role Assignment", description: "Delete roles", assignedRolesCount: 2 },
  { id: "p14", name: "Assign Permissions", key: "roles.assign", module: "Role Assignment", description: "Toggle permissions for roles", assignedRolesCount: 2 },

  // ── Role Assignment UI ──
  { id: "p33", name: "Toggle: Card View", key: "roles.ui_card", module: "Role Assignment UI", description: "Show Card View option", assignedRolesCount: 2 },
  { id: "p34", name: "Toggle: List View", key: "roles.ui_list", module: "Role Assignment UI", description: "Show List View option", assignedRolesCount: 2 },

  // ── Permissions ──
  { id: "p13", name: "Manage Permissions", key: "permissions.manage", module: "Permissions", description: "Create, edit, and delete permissions", assignedRolesCount: 2 },
  
  // ── Permissions UI ──
  { id: "p36", name: "Filter: Search Bar", key: "permissions.ui_search", module: "Permissions UI", description: "Show search filter", assignedRolesCount: 2 },
  { id: "p37", name: "Filter: Module", key: "permissions.ui_filter", module: "Permissions UI", description: "Show module dropdown filter", assignedRolesCount: 2 },

  // ── Activity Logs ──
  { id: "p42", name: "Export Logs", key: "logs.export", module: "Activity Logs", description: "Export activity logs to CSV", assignedRolesCount: 2 },
  
  // ── Activity Logs UI ──
  { id: "p43", name: "Filter: Search Bar", key: "logs.ui_search", module: "Activity Logs UI", description: "Show search filter", assignedRolesCount: 2 },
  { id: "p44", name: "Filter: Type", key: "logs.ui_filter", module: "Activity Logs UI", description: "Show type dropdown filter", assignedRolesCount: 2 },

  // ── Settings ──
  { id: "p16", name: "Reset User Passwords", key: "settings.password", module: "Settings", description: "Reset passwords for other members", assignedRolesCount: 2 },
  { id: "p17", name: "Manage Integrations", key: "settings.integrations", module: "Settings", description: "Connect/disconnect integrations", assignedRolesCount: 2 },
  { id: "p18", name: "Danger Zone Actions", key: "settings.danger", module: "Settings", description: "Execute destructive actions", assignedRolesCount: 2 },

  // ── Settings UI ──
  { id: "p15", name: "Tab: Workspace", key: "settings.ui_workspace", module: "Settings UI", description: "Show Workspace tab", assignedRolesCount: 2 },
  { id: "p38", name: "Tab: Security", key: "settings.ui_security", module: "Settings UI", description: "Show Security tab", assignedRolesCount: 3 },
  { id: "p39", name: "Tab: Notifications", key: "settings.ui_notifications", module: "Settings UI", description: "Show Notifications tab", assignedRolesCount: 3 },
  { id: "p40", name: "Tab: Integrations", key: "settings.ui_integrations", module: "Settings UI", description: "Show Integrations tab", assignedRolesCount: 2 },
  { id: "p41", name: "Tab: Danger Zone", key: "settings.ui_danger", module: "Settings UI", description: "Show Danger Zone tab", assignedRolesCount: 2 },

  // ── Payments ──
  { id: "p47", name: "View Payments", key: "payments.view", module: "Payments", description: "View payment records", assignedRolesCount: 4 },
  { id: "p48", name: "Create Payment", key: "payments.create", module: "Payments", description: "Create new payment records", assignedRolesCount: 2 },
  { id: "p49", name: "Edit Payment", key: "payments.edit", module: "Payments", description: "Edit existing payment records", assignedRolesCount: 2 },
  { id: "p50", name: "Delete Payment", key: "payments.delete", module: "Payments", description: "Delete payment records", assignedRolesCount: 2 },
  { id: "p51", name: "Export Payments", key: "payments.export", module: "Payments", description: "Export payment records", assignedRolesCount: 2 },

  // ── Payments UI ──
  { id: "p52", name: "Filter: Search Bar", key: "payments.ui_search", module: "Payments UI", description: "Show search filter", assignedRolesCount: 3 },
  { id: "p53", name: "Filter: Status", key: "payments.ui_status", module: "Payments UI", description: "Show status dropdown filter", assignedRolesCount: 3 },
  { id: "p54", name: "Filter: Direction", key: "payments.ui_direction", module: "Payments UI", description: "Show direction dropdown filter", assignedRolesCount: 3 },
  { id: "p55", name: "Filter: Category", key: "payments.ui_category", module: "Payments UI", description: "Show category dropdown filter", assignedRolesCount: 3 },
  { id: "p56", name: "Column: User", key: "payments.col_user", module: "Payments UI", description: "Show User column", assignedRolesCount: 3 },
  { id: "p57", name: "Column: Amount", key: "payments.col_amount", module: "Payments UI", description: "Show Amount column", assignedRolesCount: 3 },
  { id: "p58", name: "Column: Direction", key: "payments.col_direction", module: "Payments UI", description: "Show Direction column", assignedRolesCount: 3 },
  { id: "p59", name: "Column: Status", key: "payments.col_status", module: "Payments UI", description: "Show Status column", assignedRolesCount: 3 },
  { id: "p60", name: "Column: Category", key: "payments.col_category", module: "Payments UI", description: "Show Category column", assignedRolesCount: 3 },
  { id: "p61", name: "Column: Source", key: "payments.col_source", module: "Payments UI", description: "Show Source column", assignedRolesCount: 3 },
  { id: "p62", name: "Column: Method", key: "payments.col_method", module: "Payments UI", description: "Show Method column", assignedRolesCount: 3 },
  { id: "p63", name: "Column: Date", key: "payments.col_date", module: "Payments UI", description: "Show Date column", assignedRolesCount: 3 },
  { id: "p64", name: "Column: Actions", key: "payments.col_actions", module: "Payments UI", description: "Show Actions column", assignedRolesCount: 3 },

  // ── Transaction Details ──
  { id: "p65", name: "View Transaction Details", key: "pages.transactions.details", module: "Sidebar Navigation", description: "Show Transaction Details page", assignedRolesCount: 4 },
  { id: "p66", name: "Approve Transaction", key: "transactions.approve", module: "Payments", description: "Approve pending transactions", assignedRolesCount: 2 },
  { id: "p67", name: "Reject Transaction", key: "transactions.reject", module: "Payments", description: "Reject pending transactions", assignedRolesCount: 2 },

  // ── Transaction Details (Action Permissions) ──
  { id: "p109", name: "View Transaction Details", key: "transaction_details.view", module: "Transaction Details", description: "View transaction details", assignedRolesCount: 4 },
  { id: "p110", name: "Approve Transaction", key: "transaction_details.approve", module: "Transaction Details", description: "Approve transaction", assignedRolesCount: 2 },
  { id: "p111", name: "Reject Transaction", key: "transaction_details.reject", module: "Transaction Details", description: "Reject transaction", assignedRolesCount: 2 },
  { id: "p112", name: "Edit Transaction", key: "transaction_details.edit", module: "Transaction Details", description: "Edit transaction", assignedRolesCount: 2 },
  { id: "p113", name: "Export Transaction", key: "transaction_details.export", module: "Transaction Details", description: "Export transaction details", assignedRolesCount: 2 },

  // ── Transactions ──
  { id: "p73", name: "View Transactions", key: "transactions.view", module: "Transactions", description: "View transaction list", assignedRolesCount: 4 },
  { id: "p74", name: "Create Transaction", key: "transactions.create", module: "Transactions", description: "Create new transactions", assignedRolesCount: 2 },
  { id: "p75", name: "Edit Transaction", key: "transactions.edit", module: "Transactions", description: "Edit existing transactions", assignedRolesCount: 2 },
  { id: "p76", name: "Delete Transaction", key: "transactions.delete", module: "Transactions", description: "Delete transactions", assignedRolesCount: 2 },
  { id: "p77", name: "Export Transactions", key: "transactions.export", module: "Transactions", description: "Export transaction records", assignedRolesCount: 2 },

  // ── Transactions UI ──
  { id: "p78", name: "Filter: Search Bar", key: "transactions.ui_search", module: "Transactions UI", description: "Show search filter", assignedRolesCount: 3 },
  { id: "p79", name: "Filter: Status", key: "transactions.ui_status", module: "Transactions UI", description: "Show status dropdown filter", assignedRolesCount: 3 },
  { id: "p80", name: "Filter: Direction", key: "transactions.ui_direction", module: "Transactions UI", description: "Show direction dropdown filter", assignedRolesCount: 3 },
  { id: "p81", name: "Filter: Category", key: "transactions.ui_category", module: "Transactions UI", description: "Show category dropdown filter", assignedRolesCount: 3 },
  { id: "p82", name: "Column: User", key: "transactions.col_user", module: "Transactions UI", description: "Show User column", assignedRolesCount: 3 },
  { id: "p83", name: "Column: Amount", key: "transactions.col_amount", module: "Transactions UI", description: "Show Amount column", assignedRolesCount: 3 },
  { id: "p84", name: "Column: Direction", key: "transactions.col_direction", module: "Transactions UI", description: "Show Direction column", assignedRolesCount: 3 },
  { id: "p85", name: "Column: Status", key: "transactions.col_status", module: "Transactions UI", description: "Show Status column", assignedRolesCount: 3 },
  { id: "p86", name: "Column: Category", key: "transactions.col_category", module: "Transactions UI", description: "Show Category column", assignedRolesCount: 3 },
  { id: "p87", name: "Column: Source", key: "transactions.col_source", module: "Transactions UI", description: "Show Source column", assignedRolesCount: 3 },
  { id: "p88", name: "Column: Method", key: "transactions.col_method", module: "Transactions UI", description: "Show Method column", assignedRolesCount: 3 },
  { id: "p89", name: "Column: Date", key: "transactions.col_date", module: "Transactions UI", description: "Show Date column", assignedRolesCount: 3 },
  { id: "p90", name: "Column: Actions", key: "transactions.col_actions", module: "Transactions UI", description: "Show Actions column", assignedRolesCount: 3 },

  // ── Transaction Details UI ──
  { id: "p91", name: "Section: Transaction Info", key: "transactions.sec_info", module: "Transaction Details UI", description: "Show Transaction Information section", assignedRolesCount: 3 },
  { id: "p92", name: "Section: User Info", key: "transactions.sec_user", module: "Transaction Details UI", description: "Show User Information section", assignedRolesCount: 3 },
  { id: "p93", name: "Section: Payment Info", key: "transactions.sec_payment", module: "Transaction Details UI", description: "Show Payment Information section", assignedRolesCount: 3 },
  { id: "p94", name: "Section: Attachment", key: "transactions.sec_attachment", module: "Transaction Details UI", description: "Show Attachment section", assignedRolesCount: 3 },
  { id: "p95", name: "Section: Notes", key: "transactions.sec_notes", module: "Transaction Details UI", description: "Show Notes section", assignedRolesCount: 3 },
  { id: "p96", name: "Section: Verification", key: "transactions.sec_verification", module: "Transaction Details UI", description: "Show Verification Information section", assignedRolesCount: 3 },
  { id: "p97", name: "Section: Linked Modules", key: "transactions.sec_linked", module: "Transaction Details UI", description: "Show Linked Modules section", assignedRolesCount: 3 },
  { id: "p98", name: "Section: Timeline", key: "transactions.sec_timeline", module: "Transaction Details UI", description: "Show Timeline/Activity section", assignedRolesCount: 3 },
  // { id: "p99", name: "Section: History", key: "transactions.sec_history", module: "Transaction Details UI", description: "Show Transaction History section", assignedRolesCount: 3 },
  { id: "p100", name: "View Transaction Amount", key: "transactions.view_amount", module: "Transaction Details UI", description: "View transaction amount", assignedRolesCount: 3 },
  { id: "p101", name: "Edit Transaction Amount", key: "transactions.edit_amount", module: "Transaction Details UI", description: "Edit transaction amount", assignedRolesCount: 2 },

  // ── Transaction Details UI Visibility ──
  { id: "p102", name: "Button: Approve", key: "transactions.ui_approve", module: "Transaction Details UI", description: "Show Approve button", assignedRolesCount: 2 },
  { id: "p103", name: "Button: Reject", key: "transactions.ui_reject", module: "Transaction Details UI", description: "Show Reject button", assignedRolesCount: 2 },
  { id: "p104", name: "Button: Edit", key: "transactions.ui_edit", module: "Transaction Details UI", description: "Show Edit button", assignedRolesCount: 2 },
  { id: "p105", name: "Button: View Profile", key: "transactions.ui_view_profile", module: "Transaction Details UI", description: "Show View Profile button in User section", assignedRolesCount: 3 },
  { id: "p106", name: "Button: Open Attachment", key: "transactions.ui_open_attachment", module: "Transaction Details UI", description: "Show Open Attachment button", assignedRolesCount: 3 },
  { id: "p107", name: "Button: Download Attachment", key: "transactions.ui_download_attachment", module: "Transaction Details UI", description: "Show Download Attachment button", assignedRolesCount: 3 },
  { id: "p108", name: "Button: Edit Amount", key: "transactions.ui_edit_amount", module: "Transaction Details UI", description: "Show Edit Amount button", assignedRolesCount: 2 },
];
