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
} as const;

export const ROLE_ERRORS = {
  NOT_FOUND: "Role not found",
  NAME_EXISTS: "A role with this name already exists",
  CANNOT_DELETE_SUPER_ADMIN: "Cannot delete the Super Admin role",
  CANNOT_MODIFY_SUPER_ADMIN: "Cannot modify the Super Admin role",
  CANNOT_DELETE_SYSTEM_ROLE: "Cannot delete system roles",
  CANNOT_MODIFY_SYSTEM_ROLE: "Cannot modify system roles",
} as const;

export const SUPER_ADMIN_ROLE_ID = "r1";
export const SUPER_ADMIN_ROLE_NAME = "Super Admin";
export const SYSTEM_ROLE_IDS = ["r1", "r2", "r3", "r4"] as const;