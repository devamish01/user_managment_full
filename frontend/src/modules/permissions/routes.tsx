import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { PermissionsPage } from "@/modules/permissions/pages/PermissionsPage";

/**
 * Permissions Route Helpers
 */
export const permissionsRoutesConfig = {
  root: () => "/permissions",
};

/**
 * Permissions Feature Routes
 */
export const permissionsRoutes: RouteObject[] = [
  {
    path: "permissions",
    element: <PermissionGuard permission="pages.permissions" />,
    children: [{ index: true, element: <PermissionsPage /> }],
  },
];
