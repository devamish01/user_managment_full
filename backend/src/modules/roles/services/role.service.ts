import { Role } from "../model/index.js";
import { User } from "@/modules/users/model/index.js";
import { Permission } from "@/modules/permissions/model/index.js";
import { ROLE_MESSAGES, SUPER_ADMIN_ROLE_ID, DEFAULT_VIEWER_ROLE_ID } from "../constants/role.constants.js";
import { USER_ROLE } from "@/modules/users/constants/user.constants.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { IRole, CreateRoleInput, UpdateRoleInput, RoleQueryInput, PaginatedRolesResponse } from "../types/role.type.js";
import { createHash } from "crypto";

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Generate a stable role ID from the role name.
 * Uses first 6 characters of SHA256 hash for consistency.
 * Format: ROL_xxxxxx
 */
const generateRoleId = (name: string): string => {
  const hash = createHash("sha256").update(name).digest("hex");
  return `ROL_${hash.substring(0, 6).toUpperCase()}`;
};

// Helper function to update assignedRolesCount for permissions
export const updatePermissionAssignedRolesCount = async (permissionIds: string[]): Promise<void> => {
  if (!permissionIds.length) return;
  
  const rolesWithPermissions = await Role.find({ permissionIds: { $in: permissionIds } }).select("permissionIds").lean();
  
  const roleCountMap = new Map<string, number>();
  for (const role of rolesWithPermissions) {
    for (const permId of role.permissionIds) {
      roleCountMap.set(permId, (roleCountMap.get(permId) || 0) + 1);
    }
  }

  // Update each permission's assignedRolesCount using permissionId
  const updates = permissionIds.map(permId => 
    Permission.updateOne(
      { permissionId: permId },
      { $set: { assignedRolesCount: roleCountMap.get(permId) || 0 } }
    )
  );
  
  await Promise.all(updates);
};

export const getRoles = async (params: RoleQueryInput): Promise<PaginatedResult<IRole>> => {
  const {
    page = 1,
    limit = 20,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const query: any = {};

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sort
  const sortOrderNum = sortOrder === "asc" ? 1 : -1;
  const sortObj: any = { [sortBy]: sortOrderNum };

  // Pagination
  const skip = (page - 1) * limit;

  // Execute queries
  const [roles, total] = await Promise.all([
    Role.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
    Role.countDocuments(query),
  ]);

  return {
    data: roles as unknown as IRole[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createRole = async (data: CreateRoleInput, createdBy: string): Promise<IRole> => {
  // Check if role name already exists
  const existingRole = await Role.findOne({ name: data.name });
  if (existingRole) {
    throw new AppError({
      message: ROLE_MESSAGES.NAME_EXISTS,
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: "ROLE_NAME_EXISTS",
    });
  }

  // Generate roleId
  let roleId: string;
  let isSuperAdmin = data.isSuperAdmin || false;
  
  if (isSuperAdmin) {
    // Super Admin gets fixed roleId
    roleId = SUPER_ADMIN_ROLE_ID; // ROL_SUPER_ADMIN
    
    // Check if Super Admin already exists
    const existingSuperAdmin = await Role.findOne({ roleId: SUPER_ADMIN_ROLE_ID });
    if (existingSuperAdmin) {
      throw new AppError({
        message: "Super Admin role already exists. Only one Super Admin role is allowed.",
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "SUPER_ADMIN_EXISTS",
      });
    }
  } else {
    roleId = generateRoleId(data.name);
    
    // Check for duplicate roleId (extremely unlikely but possible)
    const existingId = await Role.findOne({ roleId });
    if (existingId) {
      throw new AppError({
        message: "Role ID collision. Please try a different name.",
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "ROLE_ID_EXISTS",
      });
    }
  }

  // If Super Admin, automatically assign ALL permissions
  let permissionIds = data.permissionIds || [];
  if (isSuperAdmin) {
    const allPermissions = await Permission.find({}, { permissionId: 1 }).lean();
    permissionIds = allPermissions.map(p => p.permissionId);
  }

  const role = await Role.create({
    ...data,
    roleId,
    isSuperAdmin,
    permissionIds,
    createdBy,
  });

  // Update assignedRolesCount for permissions assigned to this role
  if (permissionIds.length > 0) {
    await updatePermissionAssignedRolesCount(permissionIds);
  }

  return role.toObject() as unknown as IRole;
};

export const updateRole = async (id: string, data: UpdateRoleInput): Promise<IRole> => {
  // Find role by roleId or permissionId (for backward compat)
  const currentRole = await Role.findOne({ $or: [{ roleId: id }, { roleId: id }] }).lean();
  if (!currentRole) {
    throw new AppError({
      message: ROLE_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "ROLE_NOT_FOUND",
    });
  }

  // Prevent modification of Super Admin role
  if (currentRole.isSuperAdmin) {
    throw new AppError({
      message: ROLE_MESSAGES.CANNOT_MODIFY_SUPER_ADMIN,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "CANNOT_MODIFY_SUPER_ADMIN",
    });
  }

  // Check if name already exists (if name is being updated)
  if (data.name) {
    const existingRole = await Role.findOne({ name: data.name, roleId: { $ne: currentRole.roleId } });
    if (existingRole) {
      throw new AppError({
        message: ROLE_MESSAGES.NAME_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "ROLE_NAME_EXISTS",
      });
    }
  }

  // Prevent changing isSuperAdmin flag
  if (data.isSuperAdmin !== undefined && data.isSuperAdmin !== currentRole.isSuperAdmin) {
    throw new AppError({
      message: "Cannot change Super Admin status of an existing role.",
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "CANNOT_CHANGE_SUPER_ADMIN",
    });
  }

  const oldPermissionIds = currentRole.permissionIds || [];
  let newPermissionIds = data.permissionIds || oldPermissionIds;

  // If this role is Super Admin (shouldn't happen due to check above), ensure all permissions
  if (currentRole.isSuperAdmin) {
    const allPermissions = await Permission.find({}, { permissionId: 1 }).lean();
    newPermissionIds = allPermissions.map(p => p.permissionId);
  }

  const role = await Role.findOneAndUpdate(
    { roleId: currentRole.roleId },
    { $set: { ...data, permissionIds: newPermissionIds } },
    { returnDocument: "after", runValidators: true },
  ).lean();

  if (!role) {
    throw new AppError({
      message: ROLE_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "ROLE_NOT_FOUND",
    });
  }

  // Update assignedRolesCount for permissions that were added or removed
  const allAffectedPermissionIds = [...new Set([...oldPermissionIds, ...newPermissionIds])];
  if (allAffectedPermissionIds.length > 0) {
    await updatePermissionAssignedRolesCount(allAffectedPermissionIds);
  }

  return role as unknown as IRole;
};

export const deleteRole = async (id: string): Promise<{ reassignedCount: number }> => {
  // Find the role first
  const role = await Role.findOne({ $or: [{ roleId: id }, { roleId: id }] }).lean();
  
  if (!role) {
    throw new AppError({
      message: ROLE_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "ROLE_NOT_FOUND",
    });
  }

  // Rule 1: Protect system roles (createdBy === "SYSTEM")
  if (role.createdBy === "SYSTEM") {
    throw new AppError({
      message: ROLE_MESSAGES.SYSTEM_ROLE_DELETE_NOT_ALLOWED,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "SYSTEM_ROLE_DELETE_NOT_ALLOWED",
    });
  }

  // Rule 2: Protect Super Admin role
  if (role.isSuperAdmin) {
    throw new AppError({
      message: ROLE_MESSAGES.CANNOT_MODIFY_SUPER_ADMIN,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "CANNOT_MODIFY_SUPER_ADMIN",
    });
  }

  // Get permission IDs from the role before deleting
  const deletedPermissionIds = role.permissionIds || [];

  // Rule 3: Move users to Default Viewer role before delete
  const updateResult = await User.updateMany(
    { roleId: role.roleId },
    { 
      $set: { 
        roleId: DEFAULT_VIEWER_ROLE_ID,
        role: USER_ROLE.USER,
      } 
    }
  );

  // Rule 5: Delete the role
  const deleteResult = await Role.deleteOne({ roleId: role.roleId });
  
  if (deleteResult.deletedCount === 0) {
    throw new AppError({
      message: ROLE_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "ROLE_NOT_FOUND",
    });
  }

  // Update assignedRolesCount for permissions that were assigned to the deleted role
  if (deletedPermissionIds.length > 0) {
    await updatePermissionAssignedRolesCount(deletedPermissionIds);
  }

  return { reassignedCount: updateResult.modifiedCount };
};
