import { Role } from "../model/index.js";
import { Permission } from "@/modules/permissions/model/index.js";
import { SUPER_ADMIN_ROLE_ID } from "../constants/role.constants.js";
import { createHash } from "crypto";

/**
 * Generate a stable role ID from the role name.
 * Uses first 6 characters of SHA256 hash for consistency.
 * Format: ROL_xxxxxx
 */
const generateRoleId = (name: string): string => {
  const hash = createHash("sha256").update(name).digest("hex");
  return `ROL_${hash.substring(0, 6).toUpperCase()}`;
};

const defaultRoles = [
  {
    roleId: SUPER_ADMIN_ROLE_ID, // ROL_SUPER_ADMIN (fixed)
    name: "Super Admin",
    description: "Full unrestricted access — permissions cannot be modified for this role",
    color: "from-violet-500 to-indigo-600",
    permissionIds: [] as string[], // Will be populated with all permissions
    isSystem: true,
    isSuperAdmin: true,
    createdBy: "SYSTEM",
  },
  {
    roleId: generateRoleId("Admin"),
    name: "Admin",
    description: "Manages users, roles and integrations",
    color: "from-blue-500 to-cyan-500",
    permissionIds: [] as string[],
    isSystem: false,
    isSuperAdmin: false,
    createdBy: "SYSTEM",
  },
  {
    roleId: generateRoleId("Manager"),
    name: "Manager",
    description: "Team lead — can view and manage users but no access to roles or system tools",
    color: "from-emerald-500 to-teal-500",
    permissionIds: [] as string[],
    isSystem: false,
    isSuperAdmin: false,
    createdBy: "SYSTEM",
  },
  {
    roleId: generateRoleId("Default Viewer"),
    name: "Default Viewer",
    description: "Read-only access to Dashboard and Users List — fallback role when other roles are deleted",
    color: "from-slate-500 to-slate-600",
    permissionIds: [] as string[],
    isSystem: true,
    isSuperAdmin: false,
    createdBy: "SYSTEM",
  },
];

export const seedRoles = async (): Promise<void> => {
  console.log("Seeding default roles (idempotent)...");

  // Get all permission IDs (using permissionId field)
  const allPermissions = await Permission.find({}, { permissionId: 1, key: 1 }).lean();
  const allPermissionIds = allPermissions.map((p) => p.permissionId);

  // Create a map of permission key to permissionId for easy lookup
  const permissionKeyToId = new Map<string, string>();
  for (const p of allPermissions) {
    permissionKeyToId.set(p.key, p.permissionId);
  }

  let seededCount = 0;

  for (const roleData of defaultRoles) {
    // If Super Admin, assign ALL permissions
    let permissionIds = roleData.permissionIds;
    if (roleData.isSuperAdmin) {
      permissionIds = allPermissionIds;
    } else if (roleData.name === "Admin") {
      // Admin gets most permissions except system-level ones
      const adminPermissionKeys = [
        // Sidebar Navigation
        "pages.dashboard", "pages.users", "pages.permissions", "pages.assignment", "pages.logs", "pages.settings",
        // User Management
        "users.create", "users.update", "users.delete", "users.export", "users.view_full_email",
        // User Management UI
        "users.col_name", "users.col_email", "users.col_role", "users.col_status", "users.col_mobile", "users.col_id",
        "users.tab_active", "users.tab_inactive", "users.tab_blocked", "users.tab_pending",
        "users.sec_details", "users.sec_security",
        // Role Assignment
        "roles.create", "roles.edit", "roles.delete", "roles.assign",
        // Role Assignment UI
        "roles.ui_card", "roles.ui_list",
        // Permissions
        "permissions.manage",
        // Permissions UI
        "permissions.ui_search", "permissions.ui_filter",
        // Activity Logs
        "logs.export",
        // Activity Logs UI
        "logs.ui_search", "logs.ui_filter",
        // Settings
        "settings.password", "settings.integrations", "settings.danger",
        // Settings UI
        "settings.ui_workspace", "settings.ui_security", "settings.ui_notifications", "settings.ui_integrations", "settings.ui_danger",
      ];
      permissionIds = adminPermissionKeys.map(key => permissionKeyToId.get(key)).filter(Boolean) as string[];
    } else if (roleData.name === "Manager") {
      // Manager gets user management and viewing permissions
      const managerPermissionKeys = [
        // Sidebar Navigation
        "pages.dashboard", "pages.users", "pages.settings",
        // User Management
        "users.create", "users.update", "users.export", "users.view_full_email",
        // User Management UI
        "users.col_name", "users.col_email", "users.col_role", "users.col_status", "users.col_mobile", "users.col_id",
        "users.tab_active", "users.tab_inactive", "users.tab_blocked", "users.tab_pending",
        "users.sec_details", "users.sec_security",
        // Settings UI (view only)
        "settings.ui_security", "settings.ui_notifications",
      ];
      permissionIds = managerPermissionKeys.map(key => permissionKeyToId.get(key)).filter(Boolean) as string[];
    } else if (roleData.name === "Default Viewer") {
      // Default Viewer gets minimal permissions
      const viewerPermissionKeys = [
        "pages.dashboard", "pages.users", "pages.settings",
      ];
      permissionIds = viewerPermissionKeys.map(key => permissionKeyToId.get(key)).filter(Boolean) as string[];
    }

    const result = await Role.findOneAndUpdate(
      { roleId: roleData.roleId },
      {
        $setOnInsert: {
          roleId: roleData.roleId,
          name: roleData.name,
          description: roleData.description,
          color: roleData.color,
          permissionIds,
          isSystem: roleData.isSystem,
          isSuperAdmin: roleData.isSuperAdmin,
          createdBy: roleData.createdBy,
        }
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    if (result) {
      seededCount++;
    }
  }

  console.log(`Roles seeded/updated: ${seededCount} total`);
};