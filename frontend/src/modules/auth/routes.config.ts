/**
 * Auth Route Helpers — standalone config to avoid circular deps.
 *
 * This file is imported by LoginForm for navigation but does NOT import
 * any pages or components, breaking the circular dependency:
 *   routes.tsx → pages → components → LoginForm → routes.config.ts ✓
 */
export const authRoutesConfig = {
  login: () => "/login",
  register: () => "/register",
};