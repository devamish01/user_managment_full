export interface IRole {
  roleId: string;
  name: string;
  description: string;
  permissionIds: string[];
  color: string;
  isSystem: boolean;
  isSuperAdmin: boolean;
  createdBy: string; // User ID who created this role
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  permissionIds: string[];
  color: string;
  isSystem?: boolean;
  isSuperAdmin?: boolean;
  createdBy?: string; // Will be set from authenticated user
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissionIds?: string[];
  color?: string;
  isSystem?: boolean;
  isSuperAdmin?: boolean;
}

export interface RoleQueryInput {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedRolesResponse {
  roles: IRole[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}