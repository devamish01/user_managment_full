import { Permission } from "../model/index.js";
import { DEFAULT_PERMISSIONS } from "../constants/permission.constants.js";
import { Role } from "@/modules/roles/model/index.js";
import type { IPermissionDocument } from "../types/permission.type.js";

export const seedPermissions = async (): Promise<void> => {
  const count = await Permission.countDocuments();
  if (count > 0) {
    console.log("Permissions already seeded, skipping...");
    return;
  }

  console.log("Seeding default permissions...");

  // First, get all roles to calculate assignedRolesCount
  const roles = await Role.find({}).select("permissionIds").lean();
  
  const roleCountMap = new Map<string, number>();
  for (const role of roles) {
    for (const permId of role.permissionIds) {
      roleCountMap.set(permId, (roleCountMap.get(permId) || 0) + 1);
    }
  }

  const permissions = DEFAULT_PERMISSIONS.map((perm) => ({
    id: perm.id,
    name: perm.name,
    key: perm.key,
    module: perm.module,
    description: perm.description,
    assignedRolesCount: roleCountMap.get(perm.id) || 0,
  }));

  await Permission.insertMany(permissions);
  console.log(`Seeded ${permissions.length} default permissions`);
};

export const getPermissionCount = async (): Promise<number> => {
  return Permission.countDocuments();
};