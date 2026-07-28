/**
 * ProtectedRoute — the single authentication gate.
 *
 * This component is the ONLY place that enforces authentication for
 * protected routes. PermissionGuard and feature routes trust that any
 * user who reaches them has already passed through here.
 *
 * Behaviour:
 *   - Session restore in progress → show boot screen (no redirect yet)
 *   - Unauthenticated after restore → redirect to /login
 *   - Authenticated → render <Outlet /> (protected children)
 *
 * The boot-screen rendering is intentional: it prevents a flash of the
 * login page on refresh when the user has a valid session that hasn't
 * been restored yet.
 */
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks";
import { authRoutesConfig } from "@/modules/auth/routes";

const BootScreen: React.FC = () => (
  <div className="relative min-h-screen w-full overflow-hidden bg-[#0e1418] text-[#f4ede0]">
    <style>{`
      @keyframes nexus-boot-ring {
        0%   { transform: scale(0.9); opacity: 0.9; }
        70%  { transform: scale(1.6); opacity: 0; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes nexus-boot-dot {
        0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
        40%           { opacity: 1;    transform: translateY(-3px); }
      }
    `}</style>
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/60">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#f4ede0] text-[#0e1418]">
          <span className="font-black leading-none tracking-tighter">N</span>
        </span>
        <span>Nexus / Operations Console</span>
      </div>
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border border-emerald-400/60"
          style={{ animation: "nexus-boot-ring 2.4s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full border border-emerald-400/40"
          style={{ animation: "nexus-boot-ring 2.4s ease-out infinite", animationDelay: "800ms" }}
        />
        <span className="relative inline-block h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.6)]" />
      </div>
      <p className="font-black uppercase tracking-[0.32em] text-[clamp(1rem,2.4vw,1.5rem)]">
        Checking authentication
      </p>
      <div className="flex items-center gap-1.5">
        {[0, 200, 400].map((delay) => (
          <span
            key={delay}
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#f4ede0]"
            style={{ animation: `nexus-boot-dot 1.4s ease-in-out infinite`, animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loadCurrentUser, loading } = useAuth();
  const [settled, setSettled] = useState(false);

  // One-shot session restore — runs only on first mount of the protected tree.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadCurrentUser();
      if (!cancelled) setSettled(true);
    })();
    return () => { cancelled = true; };
  }, [loadCurrentUser]);

  // Session restore still in flight.
  if (!settled || loading) {
    return <Outlet />;
  }

  // Not authenticated — redirect to login.
  if (!isAuthenticated) {
    return <Navigate to={authRoutesConfig.login()} replace />;
  }

  // Authenticated — render protected children.
  return <Outlet />;
};

export default ProtectedRoute;
