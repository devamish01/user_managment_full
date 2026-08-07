import { Permission } from "../model/index.js";
import { DEFAULT_PERMISSIONS } from "../constants/permission.constants.js";
import { Role } from "@/modules/roles/model/index.js";
import type { IPermissionDocument } from "../types/permission.type.js";

export const seedPermissions = async (): Promise<void> => {
  console.log("Seeding default permissions (idempotent)...");

  // First, get all roles to calculate assignedRolesCount
  const roles = await Role.find({}).select("permissionIds").lean();
  
  const roleCountMap = new Map<string, number>();
  for (const role of roles) {
    for (const permId of role.permissionIds) {
      roleCountMap.set(permId, (roleCountMap.get(permId) || 0) + 1);
    }
  }

  let createdCount = 0;
  let updatedCount = 0;
  let migratedCount = 0;

  for (const perm of DEFAULT_PERMISSIONS) {
    const newPermissionId = perm.permissionId;
    
    // Step 1: Check if a permission exists with the same key but different permissionId
    // This handles migration from old IDs (p1, p2, etc.) to new PRM_ IDs
    const existingByKey = await Permission.findOne({ key: perm.key }).lean();
    
    if (existingByKey && existingByKey.permissionId !== newPermissionId) {
      // Migration needed: update the permissionId to the new stable value
      await Permission.updateOne(
        { key: perm.key },
        { 
          $set: { 
            permissionId: newPermissionId,
            id: newPermissionId, // Keep id in sync
          } 
        }
      );
      migratedCount++;
      console.log(`  Migrated: ${perm.key} from ${existingByKey.permissionId} to ${newPermissionId}`);
    }

    // Step 2: Now upsert by permissionId (the stable identifier)
    const result = await Permission.findOneAndUpdate(
      { permissionId: newPermissionId },
      {
        $set: {
          permissionId: newPermissionId,
          id: newPermissionId, // Keep id in sync for backward compatibility
          name: perm.name,
          key: perm.key,
          module: perm.module,
          description: perm.description,
          // assignedRolesCount is recalculated on each seed run
          assignedRolesCount: roleCountMap.get(newPermissionId) || 0,
        }
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    if (result) {
      // Check if this was a new insert or an update
      const existing = await Permission.findOne({ permissionId: newPermissionId }).lean();
      if (existing && existing.permissionId === newPermissionId) {
        // Document existed before this operation (or was just migrated)
        if (!existingByKey || existingByKey.permissionId === newPermissionId) {
          updatedCount++;
        }
      } else {
        createdCount++;
      }
    }
  }

  console.log(`Permissions: ${createdCount} created, ${updatedCount} updated, ${migratedCount} migrated, ${createdCount + updatedCount + migratedCount} total`);
};

export const getPermissionCount = async (): Promise<number> => {
  return Permission.countDocuments();
};