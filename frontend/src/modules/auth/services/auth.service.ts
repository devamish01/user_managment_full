/**
 * AuthService — public surface of the Auth feature module.
 *
 * All HTTP calls are delegated to `AuthApi`; this service never reaches
 * directly into the core HTTP client. The legacy service at
 * `src/services/auth.service.ts` remains untouched for backward compatibility
 * with `StoreProvider` and will be retired when the global auth state is
 * migrated to this module (Phase 7.3+).
 */

import { AuthApi } from "../api";
import type { User } from "@/lib/types";
import type { AuthSession, RegisterCredentials } from "../types";

export class AuthService {
  static async getSuperAdminPassword(): Promise<string> {
    const res = await AuthApi.getSuperAdminPassword();
    return res.data?.password || "";
  }

  static async setSuperAdminPassword(password: string): Promise<void> {
    await AuthApi.setSuperAdminPassword(password);
  }

  static async getSession(): Promise<AuthSession | null> {
    const res = await AuthApi.getSession();
    return res.success ? (res.data as AuthSession) : null;
  }

  static async getCurrentUser(): Promise<User | null> {
    const res = await AuthApi.getCurrentUser();
    return res.success ? res.data : null;
  }

  static async login(credentials: { email: string; password: string }): Promise<AuthSession> {
    const res = await AuthApi.login(credentials);
    if (!res.success || !res.data) throw new Error(res.message || "Login failed");
    return res.data.session;
  }

  static async logout(): Promise<void> {
    await AuthApi.logout();
  }

  static async register(payload: RegisterCredentials): Promise<User> {
    const res = await AuthApi.register(payload);
    if (!res.success || !res.data) throw new Error(res.message || "Registration failed");
    return res.data;
  }

  static async switchUser(roleId: string): Promise<User | null> {
    const res = await AuthApi.switchUser(roleId);
    return res.success ? res.data : null;
  }
}
