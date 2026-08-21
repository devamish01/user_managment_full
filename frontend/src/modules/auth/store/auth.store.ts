/**
 * useAuthStore — feature store for the Auth module.
 *
 * Owns authentication state as a module-level singleton so every consumer
 * (LoginForm, AuthBootstrap, future guards) sees the same state without
 * requiring a Context provider in the React tree.
 *
 * Built on `useSyncExternalStore` — the public hook signature is identical
 * to a plain React-hook store, but the underlying state lives outside any
 * component instance.
 */

import { useCallback, useSyncExternalStore } from "react";
import { AuthService } from "../services";
import { setToken, removeToken } from "@/core/auth/token";
import { getErrorMessage } from "@/core/api/errorUtils";
import type { AuthState, LoginCredentials, RegisterCredentials } from "../types";
import type { User } from "@/lib/types";

export interface AuthStoreState extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User | null>;
  register: (credentials: RegisterCredentials) => Promise<User | null>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<User | null>;
  switchUser: (roleId: string) => Promise<User | null>;
}

/* ── module-level singleton state ─────────────────────────────── */
type Listener = () => void;
const listeners = new Set<Listener>();
const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const emit = () => listeners.forEach((l) => l());

let state: AuthState = {
  currentUser: null,
  session: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const patch = (next: Partial<AuthState>) => {
  state = { ...state, ...next };
  emit();
};

/* ── actions (stable references) ──────────────────────────────── */
const login = async (credentials: LoginCredentials): Promise<User | null> => {
  patch({ loading: true, error: null });
  try {
    const sess = await AuthService.login(credentials);
    patch({ session: sess });
    if (sess.accessToken) setToken(sess.accessToken);
    const user = await AuthService.getCurrentUser();
    patch({ currentUser: user, isAuthenticated: Boolean(user), loading: false });
    return user;
  } catch (err) {
    const message = getErrorMessage(err, "Login failed");
    patch({ error: message, loading: false });
    return null;
  }
};

const register = async (credentials: RegisterCredentials): Promise<User | null> => {
  patch({ loading: true, error: null });
  try {
    const user = await AuthService.register(credentials);
    // Registration succeeds but doesn't auto-login; user must log in separately
    patch({ loading: false });
    return user;
  } catch (err) {
    const message = getErrorMessage(err, "Registration failed");
    patch({ error: message, loading: false });
    return null;
  }
};

const logout = async (): Promise<void> => {
  patch({ loading: true });
  try {
    await AuthService.logout();
    removeToken();
    patch({ session: null, currentUser: null, isAuthenticated: false, error: null });
  } finally {
    patch({ loading: false });
  }
};

const loadCurrentUser = async (): Promise<User | null> => {
  patch({ loading: true, error: null });
  try {
    const sess = await AuthService.getSession();
    patch({ session: sess });
    const user = sess ? await AuthService.getCurrentUser() : null;
    patch({ currentUser: user, isAuthenticated: Boolean(user) });
    return user;
  } catch (err) {
    const message = getErrorMessage(err, "Failed to load session");
    patch({ error: message });
    return null;
  } finally {
    patch({ loading: false });
  }
};

export const switchUser = async (roleId: string): Promise<User | null> => {
  patch({ loading: true, error: null });
  try {
    const user = await AuthService.switchUser(roleId);
    patch({ currentUser: user, isAuthenticated: Boolean(user) });
    const sess = await AuthService.getSession();
    patch({ session: sess });
    return user;
  } catch (err) {
    const message = getErrorMessage(err, "Failed to switch user");
    patch({ error: message });
    return null;
  } finally {
    patch({ loading: false });
  }
};

/* ── public hook ──────────────────────────────────────────────── */
export const useAuthStore = (): AuthStoreState => {
  useSyncExternalStore(subscribe, () => state, () => state);
  return {
    currentUser: state.currentUser,
    session: state.session,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login: useCallback(login, []),
    register: useCallback(register, []),
    logout: useCallback(logout, []),
    loadCurrentUser: useCallback(loadCurrentUser, []),
    switchUser: useCallback(switchUser, []),
  };
};

export default useAuthStore;
