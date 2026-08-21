/**
 * LoginForm — credentials form for the mock auth surface.
 *
 * Owns only the form state and the submit flow. Composes shared primitives
 * (`SharedInput`, `SharedButton`) and delegates to `useAuth().login`,
 * never touching the API or HTTP client directly.
 *
 * Demo accounts are surfaced in two places:
 *   1. The UserSwitcher chips (autofill on click) — sourced from
 *      `core/authorization` so the credentials live with the authorization
 *      layer, not the auth module.
 *   2. A "Quick access" panel below the form with clickable chips.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Copy } from "lucide-react";
import { SharedInput, SharedButton } from "@/shared/components";
import { cn } from "@/shared/utils/cn";
import { useAuth } from "../hooks";
import { UserSwitcher } from "./UserSwitcher";
import { DEMO_ACCOUNTS, ROLE_DISPLAY } from "@/core/authorization";
import { dashboardRoutesConfig } from "@/modules/dashboard.routes";
import { authRoutesConfig } from "../routes.config";

export const LoginForm: React.FC = () => {
  const { login, loading, error, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [roleId, setRoleId] = React.useState<string>("r1");
  const [email, setEmail] = React.useState<string>("superadmin@nexus.com");
  const [password, setPassword] = React.useState<string>("superadmin");
  const [rememberMe, setRememberMe] = React.useState<boolean>(true);
  const [copied, setCopied] = React.useState<string | null>(null);

  const applySelection = React.useCallback(
    (selection: { roleId: string; email: string; password: string }) => {
      setRoleId(selection.roleId);
      setEmail(selection.email);
      setPassword(selection.password);
    },
    [],
  );

  const fillDemo = React.useCallback(
    (account: (typeof DEMO_ACCOUNTS)[number]) => {
      setRoleId(account.roleId);
      setEmail(account.email);
      setPassword(account.password);
    },
    [],
  );

  const copyCreds = React.useCallback((account: (typeof DEMO_ACCOUNTS)[number]) => {
    const text = `${account.email} / ${account.password}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(account.roleId);
          setTimeout(() => setCopied(null), 1400);
        },
        () => {
          /* clipboard unavailable — silently ignore */
        },
      );
    }
  }, []);

  // Navigate to dashboard immediately after successful login.
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(dashboardRoutesConfig.root(), { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      await login({ email: email.trim(), password, rememberMe });
      // Navigation is handled by the effect above once isAuthenticated flips.
    },
    [login, email, password, rememberMe],
  );

  const submitDisabled = loading || !email.trim() || !password;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <UserSwitcher
        selectedRoleId={roleId}
        onSelect={applySelection}
        disabled={loading}
      />

      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
            Email
          </span>
          <SharedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="superadmin@nexus.com"
            disabled={loading}
            autoComplete="email"
            className="h-11 border-[#0e1418]/15 bg-white text-[#0e1418] focus-visible:ring-[#0e1418]/30"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
            Password
          </span>
          <SharedInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="current-password"
            className="h-11 border-[#0e1418]/15 bg-white text-[#0e1418] focus-visible:ring-[#0e1418]/30"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#0e1418]/70">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 accent-[#0a7f5e]"
          />
          Keep me signed in on this device
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-600"
        >
          {error}
        </p>
      )}

      {isAuthenticated && currentUser && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Signed in as <span className="font-semibold">{currentUser.name}</span>.
        </p>
      )}

      <SharedButton
        type="submit"
        size="lg"
        disabled={submitDisabled}
        className="group w-full justify-between rounded-md bg-[#0e1418] text-[#f4ede0] hover:bg-[#0e1418]/90 disabled:opacity-50"
      >
        <span className="font-black uppercase tracking-[0.22em]">
          {loading ? "Signing in" : "Continue"}
        </span>
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        )}
      </SharedButton>

      {/* Demo accounts quick-access panel — pulled from core/authorization */}
      <div className="space-y-2 border-t border-[#0e1418]/10 pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
            Quick access
          </p>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#0e1418]/40">
            Demo credentials
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((account) => {
            const meta = ROLE_DISPLAY[account.roleId];
            const isCopied = copied === account.roleId;
            const active = email === account.email && password === account.password;
            return (
              <button
                key={account.roleId}
                type="button"
                disabled={loading}
                onClick={() => fillDemo(account)}
                onDoubleClick={() => copyCreds(account)}
                title="Click to autofill · double-click to copy"
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-md border border-[#0e1418]/15 bg-white px-3 py-2 text-left transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-[#0e1418]/40 hover:shadow-sm",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  active
                    ? "border-[#0e1418] bg-[#0e1418] text-[#f4ede0]"
                    : "text-[#0e1418]",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-6 w-1 rounded-full bg-gradient-to-b",
                      meta?.gradient,
                    )}
                  />
                  <div className="min-w-0 leading-tight">
                    <p className="text-[11px] font-black uppercase tracking-tight">
                      {meta?.label}
                    </p>
                    <p
                      className={cn(
                        "truncate font-mono text-[10px]",
                        active ? "text-[#f4ede0]/70" : "text-[#0e1418]/55",
                      )}
                    >
                      {account.email}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 transition-opacity",
                    isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                  )}
                  aria-hidden
                >
                  <Copy size={12} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#0e1418]/10 pt-5 text-xs text-[#0e1418]/70">
        <p>Don't have an account?</p>
        <button
          type="button"
          onClick={() => navigate(authRoutesConfig.register())}
          className="font-semibold uppercase tracking-[0.22em] text-[#0e1418] underline decoration-[#0e1418]/30"
        >
          Register
        </button>
      </div>
    </form>
  );
};
