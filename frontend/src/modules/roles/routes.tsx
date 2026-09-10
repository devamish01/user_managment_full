import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { RoleAssignmentPage } from "@/modules/roles/pages/RoleAssignmentPage";

/**
 * Roles Route Helpers
 */
export const rolesRoutesConfig = {
  assignment: () => "/assignment",
};

/**
 * Roles Feature Routes
 */
export const rolesRoutes: RouteObject[] = [
  {
    path: "assignment",
    element: <PermissionGuard permission="pages.assignment" />,
    children: [{ index: true, element: <RoleAssignmentPage /> }],
  },
];
