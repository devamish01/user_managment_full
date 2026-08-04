import { mockUsers } from "@/mocks/users";
import { mockRoles } from "@/mocks/roles";
import { mockPermissions } from "@/mocks/permissions";
import { mockLogs } from "@/mocks/logs";
import { mockNavigation } from "@/mocks/navigation";

/* ==========================================================
 * In-Memory Database
 * Owns all runtime data. Initialized with seeds from mocks.
 * CRUD operations manipulate this state directly.
 *
 * Part of the core mock-backend infrastructure.
 * ========================================================== */

export const db = {
  users: [...mockUsers],
  roles: [...mockRoles],
  permissions: [...mockPermissions],
  logs: [...mockLogs],
  navigation: structuredClone(mockNavigation),
};
