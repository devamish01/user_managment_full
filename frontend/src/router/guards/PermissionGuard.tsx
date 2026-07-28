/**
 * PermissionGuard — authorization only.
 *
 * By the time any request reaches this guard, ProtectedRoute has already
 * confirmed that the user is authenticated. This guard only checks whether
 * the authenticated principal holds the required permission key.
 *
 * Behaviour:
 *   - authorizationReady === false → render <Outlet /> so the page's own
 *     skeleton takes over (StoreProvider.hasPermission returns true during
 *     bootstrap to avoid spurious /403 flashes on refresh).
 *   - authorizationReady === true + holds permission  → render <Outlet />
 *   - authorizationReady === true + lacks  permission → <Navigate to="/403" replace />
 *
 * This guard NEVER handles authentication, and NEVER renders a generic
 * loading spinner — feature pages own their own skeletons.
 */
import type { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/store";

export interface PermissionGuardProps {
  /** Permission key required to access the wrapped route (e.g. "pages.users"). */
  permission: string;
  /** Optional fallback path. Defaults to the existing /403 Forbidden page. */
  fallback?: string;
}

export const PermissionGuard: FC<PermissionGuardProps> = ({
  permission,
  fallback = "/403",
}): ReactElement | null => {
  // const hasPermission = useHasPermission();
  const { hasPermission, authorizationReady } = useStore();

if (!authorizationReady) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  );
}
if (!hasPermission(permission)) {
  return <Navigate to={fallback} replace />;
}

return <Outlet />;
};

export default PermissionGuard;
