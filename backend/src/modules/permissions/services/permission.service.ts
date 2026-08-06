import { Permission } from "../model/index.js";
import { Role } from "@/modules/roles/model/index.js";
import { PERMISSION_MESSAGES } from "../types/permission.type.js";
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import type { IPermissionDocument, PermissionQueryParams, PermissionListResponse, CreatePermissionInput, UpdatePermissionInput } from "../types/permission.type.js";
import { SortOrder } from "mongoose";
import { logger } from "@/shared/logger/index.js";

const transformPermission = (permission: IPermissionDocument, assignedRolesCount?: number) => ({
  id: permission.id,
  name: permission.name,
  key: permission.key,
  module: permission.module,
  description: permission.description,
  createdAt: permission.createdAt,
  updatedAt: permission.updatedAt,
  assignedRolesCount,
});

/**
 * Generate the next permission ID by finding the highest existing numeric ID.
 * This ensures unique IDs even after deletions.
 */
const generateNextPermissionId = async (): Promise<string> => {
  const permissions = await Permission.find({}, { id: 1 }).lean();

  let max = 0;

  for (const permission of permissions) {
    const match = permission.id?.match(/^p(\d+)$/);

    if (match) {
      const num = Number(match[1]);
      if (num > max) {
        max = num;
      }
    }
  }

  return `p${max + 1}`;
};

export const getPermissions = async (query: PermissionQueryParams): Promise<PermissionListResponse> => {
  const {
    search = "",
    module = "",
    page = 1,
    limit = 1000, // Return all permissions by default (no pagination needed for small dataset)
    sort = "name",
    order = "asc",
  } = query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { key: { $regex: search, $options: "i" } },
      { module: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (module) {
    filter.module = module;
  }

  const sortOrder: SortOrder = order === "desc" ? -1 : 1;
  const sortObj: Record<string, SortOrder> = { [sort]: sortOrder };

  const skip = (page - 1) * limit;

  const [permissions, total] = await Promise.all([
    Permission.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
    Permission.countDocuments(filter),
  ]);

  // Calculate assignedRolesCount for each permission
  // Roles store permission IDs (like "p1", "p2"), not permission keys
  const permissionIds = permissions.map(p => p.id);
  const rolesWithPermissions = await Role.find({ permissionIds: { $in: permissionIds } }).select("permissionIds").lean();
  
  const roleCountMap = new Map<string, number>();
  for (const role of rolesWithPermissions) {
    for (const permId of role.permissionIds) {
      roleCountMap.set(permId, (roleCountMap.get(permId) || 0) + 1);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return {
    data: permissions.map(p => transformPermission(p, roleCountMap.get(p.id) || 0)) as IPermissionDocument[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

export const getPermissionById = async (id: string): Promise<IPermissionDocument> => {
  const permission = await Permission.findOne({ id }).lean();
  if (!permission) {
    throw new AppError({
      message: PERMISSION_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PERMISSION_NOT_FOUND",
    });
  }

  // Calculate assignedRolesCount for single permission
  // Roles store permission IDs (like "p1", "p2"), not permission keys
  const count = await Role.countDocuments({ permissionIds: permission.id });
  return transformPermission(permission, count) as IPermissionDocument;
};

export const createPermission = async (input: CreatePermissionInput): Promise<IPermissionDocument> => {
  try {
    // Check for duplicate key
    const existing = await Permission.findOne({ key: input.key }).lean();
    if (existing) {
      throw new AppError({
        message: PERMISSION_MESSAGES.KEY_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "PERMISSION_KEY_EXISTS",
      });
    }

    // Generate next permission ID (ignoring any client-supplied id)
    const generatedId = await generateNextPermissionId();

    // Explicitly exclude any id from input and use generated ID
    const { id: _ignoredId, ...rest } = input as CreatePermissionInput & { id?: string };

    const permission = await Permission.create({
      ...rest,
      id: generatedId,
    });

    return transformPermission(permission.toObject()) as IPermissionDocument;
  } catch (error) {
    // Re-throw AppError as-is
    if (error instanceof AppError) {
      throw error;
    }

    // Handle Mongoose duplicate key errors
    if (error instanceof Error && "code" in error && (error as any).code === 11000) {
      const field = Object.keys((error as any).keyValue || {})[0];
      if (field === "key") {
        throw new AppError({
          message: PERMISSION_MESSAGES.KEY_EXISTS,
          statusCode: HTTP_STATUS.CONFLICT,
          errorCode: "PERMISSION_KEY_EXISTS",
        });
      }
      if (field === "id") {
        throw new AppError({
          message: "Permission ID already exists. Please try again.",
          statusCode: HTTP_STATUS.CONFLICT,
          errorCode: "PERMISSION_ID_EXISTS",
        });
      }
    }

    // Log unexpected errors
    logger.error({
      message: "Failed to create permission",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      input,
    });

    throw new AppError({
      message: "Failed to create permission. Please try again.",
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: "PERMISSION_CREATE_FAILED",
    });
  }
};

export const updatePermission = async (id: string, input: UpdatePermissionInput): Promise<IPermissionDocument> => {
  const permission = await Permission.findOne({ id });
  if (!permission) {
    throw new AppError({
      message: PERMISSION_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PERMISSION_NOT_FOUND",
    });
  }

  Object.assign(permission, input);
  await permission.save();

  return transformPermission(permission.toObject()) as IPermissionDocument;
};

export const deletePermission = async (id: string): Promise<void> => {
  const permission = await Permission.findOne({ id });
  if (!permission) {
    throw new AppError({
      message: PERMISSION_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "PERMISSION_NOT_FOUND",
    });
  }

  // Check if permission is assigned to any roles
  const assignedRolesCount = await Role.countDocuments({ permissionIds: permission.id });
  if (assignedRolesCount > 0) {
    throw new AppError({
      message: PERMISSION_MESSAGES.ASSIGNED_TO_ROLES.replace("{count}", assignedRolesCount.toString()),
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: "PERMISSION_ASSIGNED_TO_ROLES",
    });
  }

  await permission.deleteOne();
};