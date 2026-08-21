import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { SharedInput, SharedButton } from "@/shared/components";
import { useAuth } from "../hooks";
import { authRoutesConfig } from "../routes.config";
import type { RegisterCredentials } from "../types";

export const RegisterForm: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSuccess(false);

      // Client-side validation
      if (password.length < 8) {
        // We can't set error directly since it comes from store, but we can show inline
        return;
      }

      const payload: RegisterCredentials = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      };

      const user = await register(payload);
      if (user) {
        setSuccess(true);
      }
    },
    [register, username, firstName, lastName, email, password],
  );

  const goToLogin = React.useCallback(() => {
    navigate(authRoutesConfig.login());
  }, [navigate]);

  const submitDisabled =
    loading || !username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
            Username
          </span>
          <SharedInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            disabled={loading}
            autoComplete="username"
            className="h-11 border-[#0e1418]/15 bg-white text-[#0e1418] focus-visible:ring-[#0e1418]/30"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
              First name
            </span>
            <SharedInput
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              disabled={loading}
              autoComplete="given-name"
              className="h-11 border-[#0e1418]/15 bg-white text-[#0e1418] focus-visible:ring-[#0e1418]/30"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
              Last name
            </span>
            <SharedInput
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              disabled={loading}
              autoComplete="family-name"
              className="h-11 border-[#0e1418]/15 bg-white text-[#0e1418] focus-visible:ring-[#0e1418]/30"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
            Email
          </span>
          <SharedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
            autoComplete="new-password"
            className="h-11 border-[#0e1418]/15 bg-white text-[#0e1418] focus-visible:ring-[#0e1418]/30"
          />
          <p className="text-[10px] text-[#0e1418]/50">Must be at least 8 characters</p>
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

      {success && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700">
          Registration successful. <button type="button" onClick={goToLogin} className="font-semibold underline">Sign in now</button>.
        </div>
      )}

      <SharedButton
        type="submit"
        size="lg"
        disabled={submitDisabled}
        className="group w-full justify-between rounded-md bg-[#0e1418] text-[#f4ede0] hover:bg-[#0e1418]/90 disabled:opacity-50"
      >
        <span className="font-black uppercase tracking-[0.22em]">
          {loading ? "Registering" : "Create account"}
        </span>
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        )}
      </SharedButton>

      <div className="flex items-center justify-between border-t border-[#0e1418]/10 pt-5 text-xs text-[#0e1418]/70">
        <p>Already have an account?</p>
        <button
          type="button"
          onClick={goToLogin}
          className="font-semibold uppercase tracking-[0.22em] text-[#0e1418] underline decoration-[#0e1418]/30"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
