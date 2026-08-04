/**
 * Backward-compatibility endpoint registry.
 *
 * Endpoints now physically live inside each feature module's `api/*.endpoints.ts`
 * file. This file simply re-exports them and re-assembles the legacy `API`
 * object literal so that any existing `import { API } from "@/api"` consumer
 * keeps working unchanged.
 *
 * New code should import endpoints from the owning module directly:
 *
 *   import { USERS, USER_DETAILS } from "@/modules/users/api";
 */

import { USERS, USER_DETAILS } from "@/modules/users/api";
import { ROLES, ROLE_DETAILS } from "@/modules/roles/api";
import { PERMISSIONS, PERMISSION_DETAILS } from "@/modules/permissions/api";
import {
  LOGIN,
  LOGOUT,
  SESSION,
  CURRENT_USER,
  SWITCH_USER,
  SUPER_ADMIN_PASSWORD,
  REGISTER,
} from "@/modules/auth/api";
import { NAVIGATION } from "@/modules/navigation/api";
import { LOGS, SETTINGS } from "@/modules/system/api";

// Re-export every endpoint as a named export so deep imports also keep working.
export {
  LOGIN,
  LOGOUT,
  SESSION,
  CURRENT_USER,
  SWITCH_USER,
  SUPER_ADMIN_PASSWORD,
  REGISTER,
  USERS,
  USER_DETAILS,
  ROLES,
  ROLE_DETAILS,
  PERMISSIONS,
  PERMISSION_DETAILS,

  LOGS,
  SETTINGS,
  NAVIGATION,
};

export const API = {
  /* ── Auth / Session ── */
  LOGIN,
  LOGOUT,
  SESSION,
  CURRENT_USER,
  SWITCH_USER,
  SUPER_ADMIN_PASSWORD,
  REGISTER,

  /* ── Users ── */
  USERS,
  USER_DETAILS,

  /* ── Roles ── */
  ROLES,
  ROLE_DETAILS,

  /* ── Permissions ── */
  PERMISSIONS,
  PERMISSION_DETAILS,


  /* ── Activity Logs ── */
  LOGS,

  /* ── Settings ── */
  SETTINGS,

  /* ── Navigation ── */
  NAVIGATION,
} as const;

export type ApiEndpoint = string;
