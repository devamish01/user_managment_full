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
import { cn } from "@/utils/cn";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <UserSwitcher
        selectedRoleId={roleId}
        onSelect={applySelection}
        disabled={loading}
      />

      <div className="space-y-5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Email
          </span>
          <SharedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            autoComplete="email"
            className="h-11 border-border bg-background text-foreground focus-visible:ring-primary/30"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Password
          </span>
          <SharedInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="current-password"
            className="h-11 border-border bg-background text-foreground focus-visible:ring-primary/30"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Keep me signed in on this device
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {isAuthenticated && currentUser && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm text-success"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          Signed in as <span className="font-semibold">{currentUser.name}</span>.
        </p>
      )}

      <SharedButton
        type="submit"
        size="lg"
        disabled={submitDisabled}
        className="group w-full justify-between rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <span className="font-semibold">
          {loading ? "Signing in" : "Continue"}
        </span>
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        )}
      </SharedButton>

      {/* Demo accounts quick-access panel — pulled from core/authorization */}
      <div className="space-y-3 border-t border-border pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick access
          </p>
          <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
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
                  "group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-foreground",
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
                    <p className="text-xs font-semibold uppercase tracking-tight">
                      {meta?.label}
                    </p>
                    <p
                      className={cn(
                        "truncate font-mono text-[10px]",
                        active ? "text-primary-foreground/70" : "text-muted-foreground",
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

      <div className="flex items-center justify-center border-t border-border pt-5 text-sm text-muted-foreground">
        <p>Don't have an account?</p>
        <button
          type="button"
          onClick={() => navigate(authRoutesConfig.register())}
          className="ml-2 font-semibold text-primary underline decoration-primary/30 hover:text-primary/80"
        >
          Register
        </button>
      </div>
    </form>
  );
};
