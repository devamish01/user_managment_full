/**
 * App Router Configuration — Phase 11.4.1
 *
 * Single source of truth for all application routing.
 *
 * Tree:
 *   /                      → AppRoot (AppProviders only)
 *   ├─ login               → LoginPage  (public)
 *   └─ ""                  → ProtectedRoute (auth gate)
 *        └─ ""             → AdminLayout shell
 *             ├─ index     → /dashboard
 *             ├─ dashboard
 *             ├─ users/**
 *             ├─ roles
 *             ├─ permissions
 *             ├─ logs
 *             ├─ settings
 *             └─ *         → NotFound
 *   /403                   → Forbidden  (public)
 *   /404                   → NotFound   (public)
 */
import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  type RouteObject,
} from "react-router-dom";

import { AppProviders } from "@/shared/providers";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { NotFound } from "./pages/NotFound";
import { Forbidden } from "./pages/Forbidden";
import { ProtectedRoute } from "./guards/ProtectedRoute";

import { authRoutes } from "@/modules/auth/routes";
import { dashboardRoutes } from "@/modules/dashboard.routes";
import { usersRoutes } from "@/modules/users/routes";
import { rolesRoutes } from "@/modules/roles/routes";
import { permissionsRoutes } from "@/modules/permissions/routes";
import { logsRoutes } from "@/modules/logs.routes";
import { settingsRoutes } from "@/modules/settings.routes";
import { overviewRoutes } from "@/modules/overview.routes";

/**
 * AppRoot — providers only, no routing decisions.
 * All routing is handled by React Router nodes below.
 */
const AppRoot: React.FC = () => (
  <AppProviders>
    <Outlet />
  </AppProviders>
);

/**
 * AdminShell — wraps all protected feature routes inside the layout.
 * Only reached after ProtectedRoute has confirmed authentication.
 */
const AdminShell: React.FC = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const protectedFeatureRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...usersRoutes,
  ...rolesRoutes,
  ...permissionsRoutes,
  ...logsRoutes,
  ...settingsRoutes,
  ...overviewRoutes,
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    children: [
      // Public auth routes (no authentication required)
      ...authRoutes,

      // Protected application routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminShell />,
            children: [
              // Root → redirect to dashboard
              { index: true, element: <Navigate to="/dashboard" replace /> },
              ...protectedFeatureRoutes,
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },
    ],
  },
  // Standalone error pages (public, outside AppProviders)
  { path: "/403", element: <Forbidden /> },
  { path: "/404", element: <NotFound /> },
]);

export default router;
