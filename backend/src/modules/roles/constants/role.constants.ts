export const ROLE_MESSAGES = {
  MODULE_RUNNING: "Roles module is running",
  FETCH_SUCCESS: "Roles retrieved successfully",
  FETCH_ONE_SUCCESS: "Role retrieved successfully",
  CREATE_SUCCESS: "Role created successfully",
  UPDATE_SUCCESS: "Role updated successfully",
  DELETE_SUCCESS: "Role deleted successfully",
  NOT_FOUND: "Role not found",
  NAME_EXISTS: "A role with this name already exists",
  CANNOT_DELETE_SUPER_ADMIN: "Cannot delete the Super Admin role",
  CANNOT_MODIFY_SUPER_ADMIN: "Cannot modify the Super Admin role",
  CANNOT_DELETE_SYSTEM_ROLE: "Cannot delete system roles",
  CANNOT_MODIFY_SYSTEM_ROLE: "Cannot modify system roles",
  CANNOT_DELETE_DEFAULT_ROLE: "Cannot delete the Default Viewer role",
  CANNOT_MODIFY_DEFAULT_ROLE: "Cannot modify the Default Viewer role",
  DEFAULT_ROLE_NOT_FOUND: "Default Viewer role not found",
  USERS_REASSIGNED: "users were automatically moved to Default Viewer",
  SYSTEM_ROLE_DELETE_NOT_ALLOWED: "System roles cannot be deleted.",
} as const;

export const ROLE_ERRORS = {
  NOT_FOUND: "Role not found",
  NAME_EXISTS: "A role with this name already exists",
  CANNOT_DELETE_SUPER_ADMIN: "Cannot delete the Super Admin role",
  CANNOT_MODIFY_SUPER_ADMIN: "Cannot modify the Super Admin role",
  CANNOT_DELETE_SYSTEM_ROLE: "Cannot delete system roles",
  CANNOT_MODIFY_SYSTEM_ROLE: "Cannot modify system roles",
  CANNOT_DELETE_DEFAULT_ROLE: "Cannot delete the Default Viewer role",
  CANNOT_MODIFY_DEFAULT_ROLE: "Cannot modify the Default Viewer role",
  DEFAULT_ROLE_NOT_FOUND: "Default Viewer role not found",
  USERS_REASSIGNED: "users were automatically moved to Default Viewer",
  SYSTEM_ROLE_DELETE_NOT_ALLOWED: "System roles cannot be deleted.",
} as const;

export const SUPER_ADMIN_ROLE_ID = "r1";
export const DEFAULT_VIEWER_ROLE_ID = "r4";
export const SUPER_ADMIN_ROLE_NAME = "Super Admin";
export const SYSTEM_ROLE_IDS = ["r1", "r4"] as const;