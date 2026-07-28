import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { ActivityLogs } from "@/pages/ActivityLogs";

/**
 * Logs Route Helpers
 */
export const logsRoutesConfig = {
  root: () => "/logs",
};

/**
 * Logs Feature Routes
 */
export const logsRoutes: RouteObject[] = [
  {
    path: "logs",
    element: <PermissionGuard permission="pages.logs" />,
    children: [{ index: true, element: <ActivityLogs /> }],
  },
];
