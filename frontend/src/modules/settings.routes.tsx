import type { RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { Settings } from "@/pages/Settings";
import { MyProfilePage } from "@/modules/auth/pages";

/**
 * Settings Route Helpers
 */
export const settingsRoutesConfig = {
  root: () => "/settings",
  profile: () => "/settings/profile",
};

/**
 * Settings Feature Routes
 */
export const settingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <PermissionGuard permission="pages.settings" />,
    children: [
      { index: true, element: <Settings /> },
      { path: "profile", element: <MyProfilePage /> },
    ],
  },
];
