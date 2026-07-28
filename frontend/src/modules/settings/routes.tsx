import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { Settings } from "@/pages/Settings";

export const settingsRoutesConfig = {
  root: () => "/settings",
};

/**
 * Settings Feature Routes
 */
export const settingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <PermissionGuard permission="pages.settings" />,
    children: [{ index: true, element: <Settings /> }],
  },
];
