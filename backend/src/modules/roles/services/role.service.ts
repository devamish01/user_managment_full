import { Role } from "../model/index.js";
import { ROLE_MESSAGES, SUPER_ADMIN_ROLE_ID } from "../constants/role.constants.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { IRole, CreateRoleInput, UpdateRoleInput, RoleQueryInput, PaginatedRolesResponse } from "../types/role.type.js";

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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
  const roleCount = await Role.countDocuments();
  const roleId = `r${roleCount + 1}`;

  const role = await Role.create({
    ...data,
    roleId,
    createdBy,
  });

  return role.toObject() as unknown as IRole;
};

export const updateRole = async (id: string, data: UpdateRoleInput): Promise<IRole> => {
  // Prevent modification of Super Admin role only
  if (id === SUPER_ADMIN_ROLE_ID) {
    throw new AppError({
      message: ROLE_MESSAGES.CANNOT_MODIFY_SUPER_ADMIN,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "CANNOT_MODIFY_SUPER_ADMIN",
    });
  }

  // Check if name already exists (if name is being updated)
  if (data.name) {
    const existingRole = await Role.findOne({ name: data.name, roleId: { $ne: id } });
    if (existingRole) {
      throw new AppError({
        message: ROLE_MESSAGES.NAME_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "ROLE_NAME_EXISTS",
      });
    }
  }

  const role = await Role.findOneAndUpdate(
    { roleId: id },
    { $set: data },
    { new: true, runValidators: true },
  ).lean();

  if (!role) {
    throw new AppError({
      message: ROLE_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "ROLE_NOT_FOUND",
    });
  }

  return role as unknown as IRole;
};

export const deleteRole = async (id: string): Promise<void> => {
  // Prevent deletion of Super Admin role only
  if (id === SUPER_ADMIN_ROLE_ID) {
    throw new AppError({
      message: ROLE_MESSAGES.CANNOT_DELETE_SUPER_ADMIN,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "CANNOT_DELETE_SUPER_ADMIN",
    });
  }

  const result = await Role.deleteOne({ roleId: id });
  if (result.deletedCount === 0) {
    throw new AppError({
      message: ROLE_MESSAGES.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "ROLE_NOT_FOUND",
    });
  }
};
