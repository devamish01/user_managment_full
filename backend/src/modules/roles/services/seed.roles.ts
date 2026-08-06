import { Role } from "../model/index.js";
import { SUPER_ADMIN_ROLE_ID, DEFAULT_VIEWER_ROLE_ID } from "../constants/role.constants.js";

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
    permissionIds: [] as string[], // Will be populated with admin permissions
    isSystem: false,
    createdBy: "SYSTEM",
  },
  {
    roleId: "r3",
    name: "Manager",
    description: "Team lead — can view and manage users but no access to roles or system tools",
    color: "from-emerald-500 to-teal-500",
    permissionIds: [] as string[], // Will be populated with manager permissions
    isSystem: false,
    createdBy: "SYSTEM",
  },
  {
    roleId: "r4",
    name: "Default Viewer",
    description: "Read-only access to Dashboard and Users List — fallback role when other roles are deleted",
    color: "from-slate-500 to-slate-600",
    permissionIds: [] as string[], // Will be populated with minimal permissions
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
  const superAdminRole = defaultRoles.find(r => r.roleId === SUPER_ADMIN_ROLE_ID);
  if (superAdminRole) {
    superAdminRole.permissionIds = allPermissionIds;
  }

  // Assign admin permissions to Admin role
  const adminRole = defaultRoles.find(r => r.roleId === "r2");
  if (adminRole) {
    // Admin gets most permissions except system-level ones
    const adminPermissionIds = allPermissions
      .filter(p => 
        // Sidebar Navigation
        p.id.startsWith("p1") || p.id.startsWith("p2") || p.id.startsWith("p4") || 
        p.id.startsWith("p5") || p.id.startsWith("p6") || p.id.startsWith("p7") ||
        // User Management
        p.id.startsWith("p8") || p.id.startsWith("p9") || p.id.startsWith("p10") || 
        p.id.startsWith("p11") || p.id.startsWith("p30") ||
        // User Management UI
        p.id.startsWith("p19") || p.id.startsWith("p20") || p.id.startsWith("p21") || 
        p.id.startsWith("p22") || p.id.startsWith("p23") || p.id.startsWith("p24") ||
        p.id.startsWith("p25") || p.id.startsWith("p26") || p.id.startsWith("p27") || 
        p.id.startsWith("p28") || p.id.startsWith("p29") || p.id.startsWith("p30") ||
        // Role Assignment
        p.id.startsWith("p12") || p.id.startsWith("p31") || p.id.startsWith("p32") || 
        p.id.startsWith("p14") ||
        // Role Assignment UI
        p.id.startsWith("p33") || p.id.startsWith("p34") ||
        // Permissions
        p.id.startsWith("p13") ||
        // Permissions UI
        p.id.startsWith("p36") || p.id.startsWith("p37") ||
        // Activity Logs
        p.id.startsWith("p42") ||
        // Activity Logs UI
        p.id.startsWith("p43") || p.id.startsWith("p44") ||
        // Settings
        p.id.startsWith("p16") || p.id.startsWith("p17") || p.id.startsWith("p18") ||
        // Settings UI
        p.id.startsWith("p15") || p.id.startsWith("p38") || p.id.startsWith("p39") || 
        p.id.startsWith("p40") || p.id.startsWith("p41")
      )
      .map(p => p.id);
    adminRole.permissionIds = adminPermissionIds;
  }

  // Assign manager permissions to Manager role
  const managerRole = defaultRoles.find(r => r.roleId === "r3");
  if (managerRole) {
    // Manager gets user management and viewing permissions
    const managerPermissionIds = allPermissions
      .filter(p => 
        // Sidebar Navigation
        p.id.startsWith("p1") || p.id.startsWith("p2") || p.id.startsWith("p7") ||
        // User Management
        p.id.startsWith("p8") || p.id.startsWith("p9") || p.id.startsWith("p11") || 
        p.id.startsWith("p30") ||
        // User Management UI
        p.id.startsWith("p19") || p.id.startsWith("p20") || p.id.startsWith("p21") || 
        p.id.startsWith("p22") || p.id.startsWith("p23") || p.id.startsWith("p24") ||
        p.id.startsWith("p25") || p.id.startsWith("p26") || p.id.startsWith("p27") || 
        p.id.startsWith("p28") || p.id.startsWith("p29") || p.id.startsWith("p30") ||
        // Settings UI (view only)
        p.id.startsWith("p38") || p.id.startsWith("p39")
      )
      .map(p => p.id);
    managerRole.permissionIds = managerPermissionIds;
  }

  // Assign minimal permissions to Default Viewer (Dashboard view, Users list view)
  const defaultViewerRole = defaultRoles.find(r => r.roleId === DEFAULT_VIEWER_ROLE_ID);
  if (defaultViewerRole) {
    // Find permissions for basic viewing
    const viewerPermissions = allPermissions.filter(p => 
      p.id.startsWith("p1") || // View Dashboard
      p.id.startsWith("p2") || // View Users List
      p.id.startsWith("p7")    // View Settings
    );
    defaultViewerRole.permissionIds = viewerPermissions.map(p => p.id);
  }

  await Role.insertMany(defaultRoles);
  console.log(`Seeded ${defaultRoles.length} default roles`);
};