export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
  MANAGER: "manager",
  SUPER_ADMIN: "super_admin",
} as const;

export const USER_ROLE_VALUES = Object.values(USER_ROLE);


export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  BLOCKED: "BLOCKED",
} as const;

export const USER_STATUS_VALUES = Object.values(USER_STATUS);