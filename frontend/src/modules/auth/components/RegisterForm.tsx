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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Username
          </span>
          <SharedInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            disabled={loading}
            autoComplete="username"
            className="h-11 border-border bg-background text-foreground focus-visible:ring-primary/30"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              First name
            </span>
            <SharedInput
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              disabled={loading}
              autoComplete="given-name"
              className="h-11 border-border bg-background text-foreground focus-visible:ring-primary/30"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Last name
            </span>
            <SharedInput
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              disabled={loading}
              autoComplete="family-name"
              className="h-11 border-border bg-background text-foreground focus-visible:ring-primary/30"
            />
          </label>
        </div>

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
            autoComplete="new-password"
            className="h-11 border-border bg-background text-foreground focus-visible:ring-primary/30"
          />
          <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
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

      {success && (
        <div className="rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm text-success">
          Registration successful. <button type="button" onClick={goToLogin} className="font-semibold underline">Sign in now</button>.
        </div>
      )}

      <SharedButton
        type="submit"
        size="lg"
        disabled={submitDisabled}
        className="group w-full justify-between rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <span className="font-semibold">
          {loading ? "Registering" : "Create account"}
        </span>
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        )}
      </SharedButton>

      <div className="flex items-center justify-center border-t border-border pt-5 text-sm text-muted-foreground">
        <p>Already have an account?</p>
        <button
          type="button"
          onClick={goToLogin}
          className="ml-2 font-semibold text-primary underline decoration-primary/30 hover:text-primary/80"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
