import { Role } from "../model/index.js";
import { SUPER_ADMIN_ROLE_ID } from "../constants/role.constants.js";

const defaultRoles = [
  {
    roleId: "r1",
    name: "Super Admin",
    description: "Full unrestricted access — permissions cannot be modified for this role",
    color: "from-violet-500 to-indigo-600",
    permissionIds: [] as string[], // Will be populated with all permissions
    isSystem: true,
    createdBy: "SYSTEM",
  },
  {
    roleId: "r2",
    name: "Admin",
    description: "Manages users, roles and integrations",
    color: "from-blue-500 to-cyan-500",
    permissionIds: [] as string[],
    isSystem: true,
    createdBy: "SYSTEM",
  },
  {
    roleId: "r3",
    name: "Manager",
    description: "Team lead — can view and manage users but no access to roles or system tools",
    color: "from-emerald-500 to-teal-500",
    permissionIds: [] as string[],
    isSystem: true,
    createdBy: "SYSTEM",
  },
  {
    roleId: "r4",
    name: "Viewer",
    description: "Read-only access to Dashboard and Users List",
    color: "from-slate-500 to-slate-600",
    permissionIds: [] as string[],
    isSystem: true,
    createdBy: "SYSTEM",
  },
];

export const seedRoles = async (): Promise<void> => {
  // Check if Super Admin role already exists
  const existingSuperAdmin = await Role.findOne({ roleId: SUPER_ADMIN_ROLE_ID });
  if (existingSuperAdmin) {
    console.log("Roles already seeded, skipping...");
    return;
  }

  console.log("Seeding default roles...");

  // Get all permission IDs to assign to Super Admin
  const Permission = (await import("@/modules/permissions/model/index.js")).Permission;
  const allPermissions = await Permission.find({}, "id").lean();
  const allPermissionIds = allPermissions.map((p) => p.id);

  // Assign all permissions to Super Admin
  const superAdminRole = defaultRoles[0];
  if (superAdminRole) {
    superAdminRole.permissionIds = allPermissionIds;
  }

  await Role.insertMany(defaultRoles);
  console.log(`Seeded ${defaultRoles.length} default roles`);
};