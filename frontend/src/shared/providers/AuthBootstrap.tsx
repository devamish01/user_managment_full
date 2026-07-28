/**
 * AuthBootstrap — session restore initializer.
 *
 * Phase 11.4.1: routing decisions (authenticated → AdminLayout,
 * unauthenticated → LoginPage) have been moved to React Router:
 *   - ProtectedRoute handles auth gating and the boot screen
 *   - /login is a public React Router route (modules/auth/routes.tsx)
 *
 * AuthBootstrap now only initializes the auth store on mount and
 * passes children through. It contains NO routing logic.
 *
 * Kept as a named export for backward compat with AppProviders.
 */

import React, { useEffect } from "react";
import { useAuth } from "@/modules/auth/hooks";

export interface AuthBootstrapProps {
  children: React.ReactNode;
}

export const AuthBootstrap: React.FC<AuthBootstrapProps> = ({ children }) => {
  const { loadCurrentUser } = useAuth();

  // Initialize the auth store once. ProtectedRoute is responsible for
  // waiting for this to complete before rendering protected content.
  useEffect(() => {
    loadCurrentUser();
    // loadCurrentUser is stable (useCallback with no deps) — safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Just render children — no auth-based routing decisions here.
  return <>{children}</>;
};

export default AuthBootstrap;
