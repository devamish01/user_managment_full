/**
 * Role ID constants.
 * Replaces magic strings like "r1", "r2" throughout the codebase.
 */

export const ROLE_ID = {
  SUPER_ADMIN: "r1",
  ADMIN: "r2",
  MANAGER: "r3",
  VIEWER: "r4",
} as const;

export type RoleId = (typeof ROLE_ID)[keyof typeof ROLE_ID];
