export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
  MANAGER: "manager",
  SUPER_ADMIN: "super_admin",
} as const;

export const USER_ROLE_VALUES = Object.values(USER_ROLE);


export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  BLOCKED: "blocked",
} as const;

export const USER_STATUS_VALUES = Object.values(USER_STATUS);

export const USER_MESSAGES = {
  MODULE_RUNNING: "Users module is running",
  FETCH_SUCCESS: "Users retrieved successfully",
  FETCH_ONE_SUCCESS: "User retrieved successfully",
  CREATE_SUCCESS: "User created successfully",
  UPDATE_SUCCESS: "User updated successfully",
  DELETE_SUCCESS: "User deleted successfully",
  NOT_FOUND: "User not found",
  EMAIL_EXISTS: "A user with this email already exists",
} as const;