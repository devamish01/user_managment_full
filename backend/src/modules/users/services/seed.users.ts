import { User } from "../model/index.js";
import { Role } from "@/modules/roles/model/index.js";
import { SUPER_ADMIN_ROLE_ID } from "@/modules/roles/constants/role.constants.js";
import { USER_ROLE, USER_STATUS } from "@/modules/users/constants/user.constants.js";

/**
 * Default Super Admin User
 * This user is created automatically when the database is empty or when the user is deleted.
 * The user is protected and cannot be deleted or modified.
 */
const defaultSuperAdmin = {
  userId: "USR-00001",
  username: "superadmin",
  firstName: "super",
  lastName: "admin",
  email: "superadmin@nexus.com",
  // Password: "superadmin123" (bcrypt hash with cost factor 10)
  password: "$2b$10$EkYMi3Ekmtsp4hVN1dZwmOnmGaXmIrPCABMY4iZ1Gt6wRPXJg.Qoy",
  roleId: SUPER_ADMIN_ROLE_ID, // ROL_SUPER_ADMIN
  role: USER_ROLE.SUPER_ADMIN,
  status: USER_STATUS.ACTIVE,
  isProtected: true,
  approvedAt: new Date("2026-08-04T10:32:01.703Z"),
  approvedBy: "SYSTEM",
  phone: "",
  location: "",
  address: "",
  bio: "",
  lastActive: null,
  // Role assignment tracking
  roleAssignedType: "SYSTEM",
  roleAssignedBy: "SYSTEM",
  roleAssignedAt: new Date("2026-08-04T10:32:01.703Z"),
};

export const seedSuperAdminUser = async (): Promise<void> => {
  console.log("Seeding default super admin user (idempotent)...");

  // First, ensure the Super Admin role exists
  const superAdminRole = await Role.findOne({ roleId: SUPER_ADMIN_ROLE_ID }).lean();
  if (!superAdminRole) {
    console.log("  ⚠️  Super Admin role not found. Please run seedRoles first.");
    return;
  }

  // Check if super admin user already exists
  const existingUser = await User.findOne({ userId: defaultSuperAdmin.userId }).lean();

  if (existingUser) {
    // User exists, verify and update if needed
    let needsUpdate = false;
    const updates: Record<string, unknown> = {};

    // Ensure critical fields are correct
    if (existingUser.email !== defaultSuperAdmin.email) {
      updates.email = defaultSuperAdmin.email;
      needsUpdate = true;
    }
    if (existingUser.username !== defaultSuperAdmin.username) {
      updates.username = defaultSuperAdmin.username;
      needsUpdate = true;
    }
    if (existingUser.roleId !== SUPER_ADMIN_ROLE_ID) {
      updates.roleId = SUPER_ADMIN_ROLE_ID;
      needsUpdate = true;
    }
    if (existingUser.role !== USER_ROLE.SUPER_ADMIN) {
      updates.role = USER_ROLE.SUPER_ADMIN;
      needsUpdate = true;
    }
    if (existingUser.status !== USER_STATUS.ACTIVE) {
      updates.status = USER_STATUS.ACTIVE;
      needsUpdate = true;
    }
    if (!existingUser.isProtected) {
      updates.isProtected = true;
      needsUpdate = true;
    }
    if (existingUser.approvedBy !== "SYSTEM") {
      updates.approvedBy = "SYSTEM";
      needsUpdate = true;
    }
    if (!existingUser.approvedAt) {
      updates.approvedAt = defaultSuperAdmin.approvedAt;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await User.updateOne(
        { userId: defaultSuperAdmin.userId },
        { $set: updates }
      );
      console.log(`  ✅ Updated existing super admin user: ${defaultSuperAdmin.email}`);
    } else {
      console.log(`  ⏭️  Super admin user already exists and is up to date: ${defaultSuperAdmin.email}`);
    }
  } else {
    // Create the super admin user
    await User.create({
      ...defaultSuperAdmin,
      createdAt: defaultSuperAdmin.approvedAt,
      updatedAt: defaultSuperAdmin.approvedAt,
    });
    console.log(`  ✅ Created default super admin user: ${defaultSuperAdmin.email}`);
  }
};

export const getSuperAdminUserCount = async (): Promise<number> => {
  return User.countDocuments({ userId: defaultSuperAdmin.userId });
};