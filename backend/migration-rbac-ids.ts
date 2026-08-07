/**
 * RBAC ID Migration Script
 * 
 * Migrates from old ID format (p1, p2, r1, r2, etc.) to new stable format:
 * - Permissions: p1, p2, p45 → PRM_xxxxxx (from key hash)
 * - Roles: r1 → ROL_SUPER_ADMIN (fixed), r2, r3, r4 → ROL_xxxxxx (from name hash)
 * - Updates Role.permissionIds and User.roleId references
 * 
 * Run with: npx tsx migration-rbac-ids.ts
 */

import "dotenv/config";
import { connectDB } from "./src/core/database/mongoose.js";
import { Permission } from "./src/modules/permissions/model/index.js";
import { Role } from "./src/modules/roles/model/index.js";
import { User } from "./src/modules/users/model/index.js";
import { createHash } from "crypto";

const generatePermissionId = (key: string): string => {
  const hash = createHash("sha256").update(key).digest("hex");
  return `PRM_${hash.substring(0, 6).toUpperCase()}`;
};

const generateRoleId = (name: string): string => {
  const hash = createHash("sha256").update(name).digest("hex");
  return `ROL_${hash.substring(0, 6).toUpperCase()}`;
};

async function migrate() {
  console.log("🔄 Starting RBAC ID Migration...\n");

  await connectDB();
  console.log("✅ Connected to database\n");

  // ============================================
  // STEP 1: Migrate Permissions
  // ============================================
  console.log("📋 Step 1: Migrating Permissions...");
  
  const permissions = await Permission.find({}).lean();
  console.log(`   Found ${permissions.length} permissions`);

  const permissionIdMap = new Map<string, string>(); // old id → new permissionId
  
  for (const perm of permissions) {
    const newPermissionId = generatePermissionId(perm.key);
    permissionIdMap.set(perm.id, newPermissionId);
    
    if (perm.permissionId !== newPermissionId) {
      await Permission.updateOne(
        { _id: perm._id },
        { 
          $set: { 
            permissionId: newPermissionId,
            id: newPermissionId // Keep id in sync for backward compatibility
          } 
        }
      );
      console.log(`   ✅ ${perm.id} (${perm.key}) → ${newPermissionId}`);
    } else {
      console.log(`   ⏭️  ${perm.id} (${perm.key}) already has correct permissionId`);
    }
  }

  // ============================================
  // STEP 2: Migrate Roles
  // ============================================
  console.log("\n📋 Step 2: Migrating Roles...");
  
  const roles = await Role.find({}).lean();
  console.log(`   Found ${roles.length} roles`);

  const roleIdMap = new Map<string, string>(); // old roleId → new roleId
  
  for (const role of roles) {
    let newRoleId: string;
    
    if (role.roleId === "r1" || role.name === "Super Admin") {
      newRoleId = "ROL_SUPER_ADMIN";
    } else {
      newRoleId = generateRoleId(role.name);
    }
    
    roleIdMap.set(role.roleId, newRoleId);
    
    // Map old permissionIds to new permissionIds
    const newPermissionIds = (role.permissionIds || []).map(oldPermId => 
      permissionIdMap.get(oldPermId) || oldPermId
    );
    
    if (role.roleId !== newRoleId || JSON.stringify(role.permissionIds) !== JSON.stringify(newPermissionIds) || role.isSuperAdmin !== (newRoleId === "ROL_SUPER_ADMIN")) {
      await Role.updateOne(
        { _id: role._id },
        { 
          $set: { 
            roleId: newRoleId,
            permissionIds: newPermissionIds,
            isSuperAdmin: newRoleId === "ROL_SUPER_ADMIN"
          } 
        }
      );
      console.log(`   ✅ ${role.roleId} (${role.name}) → ${newRoleId}`);
      console.log(`      permissionIds: [${role.permissionIds.join(", ")}] → [${newPermissionIds.join(", ")}]`);
    } else {
      console.log(`   ⏭️  ${role.roleId} (${role.name}) already migrated`);
    }
  }

  // ============================================
  // STEP 3: Migrate Users
  // ============================================
  console.log("\n📋 Step 3: Migrating Users...");
  
  const users = await User.find({}).lean();
  console.log(`   Found ${users.length} users`);

  for (const user of users) {
    const newRoleId = roleIdMap.get(user.roleId);
    
    if (newRoleId && user.roleId !== newRoleId) {
      await User.updateOne(
        { _id: user._id },
        { $set: { roleId: newRoleId } }
      );
      console.log(`   ✅ User ${user.username} (${user.email}): ${user.roleId} → ${newRoleId}`);
    } else if (newRoleId) {
      console.log(`   ⏭️  User ${user.username} (${user.email}) already has correct roleId`);
    } else {
      console.log(`   ⚠️  User ${user.username} (${user.email}) has unknown roleId: ${user.roleId}`);
    }
  }

  // ============================================
  // STEP 4: Verify Migration
  // ============================================
  console.log("\n📋 Step 4: Verifying Migration...");
  
  // Verify permissions
  const permCheck = await Permission.find({}).lean();
  let permOk = true;
  for (const p of permCheck) {
    const expected = generatePermissionId(p.key);
    if (p.permissionId !== expected || p.id !== expected) {
      console.log(`   ❌ Permission ${p.key}: permissionId=${p.permissionId}, id=${p.id}, expected=${expected}`);
      permOk = false;
    }
  }
  if (permOk) console.log("   ✅ All permissions have correct IDs");

  // Verify roles
  const roleCheck = await Role.find({}).lean();
  let roleOk = true;
  for (const r of roleCheck) {
    const expectedRoleId = r.name === "Super Admin" ? "ROL_SUPER_ADMIN" : generateRoleId(r.name);
    if (r.roleId !== expectedRoleId) {
      console.log(`   ❌ Role ${r.name}: roleId=${r.roleId}, expected=${expectedRoleId}`);
      roleOk = false;
    }
    if (r.isSuperAdmin !== (r.roleId === "ROL_SUPER_ADMIN")) {
      console.log(`   ❌ Role ${r.name}: isSuperAdmin=${r.isSuperAdmin}, expected=${r.roleId === "ROL_SUPER_ADMIN"}`);
      roleOk = false;
    }
    // Check permissionIds are new format
    for (const pid of r.permissionIds || []) {
      if (!pid.startsWith("PRM_")) {
        console.log(`   ❌ Role ${r.name} has old permissionId: ${pid}`);
        roleOk = false;
      }
    }
  }
  if (roleOk) console.log("   ✅ All roles have correct IDs and permissionIds");

  // Verify users
  const userCheck = await User.find({}).lean();
  let userOk = true;
  for (const u of userCheck) {
    const expectedRoleId = roleIdMap.get(u.roleId);
    if (expectedRoleId && u.roleId !== expectedRoleId) {
      console.log(`   ❌ User ${u.username}: roleId=${u.roleId}, expected=${expectedRoleId}`);
      userOk = false;
    }
  }
  if (userOk) console.log("   ✅ All users have correct roleIds");

  console.log("\n🎉 Migration Complete!");
  console.log("\n📊 Summary:");
  console.log(`   Permissions migrated: ${permissionIdMap.size}`);
  console.log(`   Roles migrated: ${roleIdMap.size}`);
  console.log(`   Users migrated: ${users.length}`);
  
  process.exit(0);
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});