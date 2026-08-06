import { Document } from "mongoose";

export interface IPermission {
  id: string;
  name: string;
  key: string;
  module: string;
  description: string;
  assignedRolesCount?: number;
}

export interface IPermissionDocument extends IPermission, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePermissionInput {
  name: string;
  key: string;
  module: string;
  description?: string;
}

export interface UpdatePermissionInput {
  name?: string;
  module?: string;
  description?: string;
}

export interface PermissionQueryParams {
  search?: string;
  module?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PermissionListResponse {
  data: IPermissionDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const PERMISSION_MESSAGES = {
  FETCH_SUCCESS: "Permissions fetched successfully",
  FETCH_ONE_SUCCESS: "Permission fetched successfully",
  CREATE_SUCCESS: "Permission created successfully",
  UPDATE_SUCCESS: "Permission updated successfully",
  DELETE_SUCCESS: "Permission deleted successfully",
  NOT_FOUND: "Permission not found",
  KEY_EXISTS: "Permission key already exists",
  ASSIGNED_TO_ROLES: "Permission is assigned to {count} roles. Remove it from all roles before deleting.",
} as const;