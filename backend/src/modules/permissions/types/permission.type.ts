import { Document } from "mongoose";

export interface IPermission {
  id: string;
  name: string;
  key: string;
  module: string;
  description: string;
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
  key?: string;
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
  FETCH_SUCCESS: "Permissions retrieved successfully",
  FETCH_ONE_SUCCESS: "Permission retrieved successfully",
  CREATE_SUCCESS: "Permission created successfully",
  UPDATE_SUCCESS: "Permission updated successfully",
  DELETE_SUCCESS: "Permission deleted successfully",
  NOT_FOUND: "Permission not found",
  KEY_EXISTS: "A permission with this key already exists",
  INVALID_ID: "Invalid permission ID",
} as const;