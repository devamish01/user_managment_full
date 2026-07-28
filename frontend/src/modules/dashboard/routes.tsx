import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { Dashboard } from "@/pages/Dashboard";

/**
 * Dashboard Route Helpers
 */
export const dashboardRoutesConfig = {
  root: () => "/dashboard",
};

/**
 * Dashboard Feature Routes
 */
export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <PermissionGuard permission="pages.dashboard" />,
    children: [{ index: true, element: <Dashboard /> }],
  },
];
