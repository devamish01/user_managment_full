import { Permission } from "../model/index.js";
import { PERMISSION_MESSAGES } from "../types/permission.type.js";
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import type { IPermissionDocument, PermissionQueryParams, PermissionListResponse, CreatePermissionInput, UpdatePermissionInput } from "../types/permission.type.js";
import { SortOrder } from "mongoose";

const transformPermission = (permission: IPermissionDocument) => ({
  id: permission.id,
  name: permission.name,
  key: permission.key,
  module: permission.module,
  description: permission.description,
  createdAt: permission.createdAt,
  updatedAt: permission.updatedAt,
});

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

  const [data, total] = await Promise.all([
    Permission.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
    Permission.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(transformPermission) as IPermissionDocument[],
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
  return transformPermission(permission) as IPermissionDocument;
};

export const createPermission = async (input: CreatePermissionInput): Promise<IPermissionDocument> => {
  const existing = await Permission.findOne({ key: input.key }).lean();
  if (existing) {
    throw new AppError({
      message: PERMISSION_MESSAGES.KEY_EXISTS,
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: "PERMISSION_KEY_EXISTS",
    });
  }

  const count = await Permission.countDocuments();
  const id = `p${count + 1}`;

  const permission = await Permission.create({
    id,
    ...input,
  });

  return transformPermission(permission.toObject()) as IPermissionDocument;
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

  if (input.key && input.key !== permission.key) {
    const existing = await Permission.findOne({ key: input.key }).lean();
    if (existing) {
      throw new AppError({
        message: PERMISSION_MESSAGES.KEY_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "PERMISSION_KEY_EXISTS",
      });
    }
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

  await permission.deleteOne();
};