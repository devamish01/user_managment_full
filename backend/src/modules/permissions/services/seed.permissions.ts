import { Permission } from "../model/index.js";
import { DEFAULT_PERMISSIONS } from "../constants/permission.constants.js";
import type { IPermissionDocument } from "../types/permission.type.js";

export const seedPermissions = async (): Promise<void> => {
  const count = await Permission.countDocuments();
  if (count > 0) {
    console.log("Permissions already seeded, skipping...");
    return;
  }

  console.log("Seeding default permissions...");

  const permissions = DEFAULT_PERMISSIONS.map((perm) => ({
    id: perm.id,
    name: perm.name,
    key: perm.key,
    module: perm.module,
    description: perm.description,
  }));

  await Permission.insertMany(permissions);
  console.log(`Seeded ${permissions.length} default permissions`);
};

export const getPermissionCount = async (): Promise<number> => {
  return Permission.countDocuments();
};