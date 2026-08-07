import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { Overview } from "@/pages/Overview";

/**
 * Settings Route Helpers
 */
export const overviewRoutesConfig = {
  root: () => "/overview",
};

/**
 * Settings Feature Routes
 */
export const overviewRoutes: RouteObject[] = [
  {
    path: "overview",
    element: <PermissionGuard permission="pages.overview" />,
    children: [{ index: true, element: <Overview /> }],
  },
];
