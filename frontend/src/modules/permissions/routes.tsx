import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { Permissions } from "@/modules/permissions/components/Permissions";

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
    children: [{ index: true, element: <Permissions /> }],
  },
];
