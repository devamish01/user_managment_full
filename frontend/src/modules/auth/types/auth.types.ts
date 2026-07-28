/**
 * Auth feature types.
 *
 * Module-local shapes that describe the authentication domain. They mirror the
 * response envelopes produced by AuthApi but live inside the module so other
 * features do not have to reach into the API layer.
 */

import type { User } from "@/lib/types";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  currentUserId: string;
  rememberMe: boolean;
  loginAt: string;
  expiresAt: string;
}

export interface AuthState {
  currentUser: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  /** Kept for UI parity; the mock backend ignores it for now. */
  rememberMe?: boolean;
}
