/**
 * App root.
 *
 * Phase 8 architecture:
 *
 *   App
 *     ↓
 *   react-router-dom RouterProvider   (src/router)
 *     ↓
 *   Catch-all route → Shell
 *     ↓
 *   AppProviders → AuthBootstrap → RouteView (existing rendering engine)
 *
 * React Router is the application entry point. The custom RouterProvider
 * (in src/store/providers/RouterProvider) lives *inside* AppProviders and
 * owns the route state + URL sync. RouteView continues to render pages.
 */

import { RouterProvider } from "react-router-dom";
import { router } from "@/router";

export default function App() {
  return <RouterProvider router={router} />;
}
