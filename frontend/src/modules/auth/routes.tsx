/**
 * Auth Module Routes — Phase 11.4.1
 *
 * Owns all authentication-related URLs.
 * The auth module is the single source of truth for /login.
 */
import type { RouteObject } from "react-router-dom";
import { LoginPage, RegisterPage } from "./pages";

/** Auth Route Helpers */
export const authRoutesConfig = {
  login: () => "/login",
  register: () => "/register",
};

/** Auth Feature Routes — public, no ProtectedRoute wrapper */
export const authRoutes: RouteObject[] = [
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
];
