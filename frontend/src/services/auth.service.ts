/**
 * AuthService — public API for the Auth feature.
 *
 * Public method signatures and response-unwrapping behaviour are unchanged.
 * Internally delegates to `AuthApi` (the module-level HTTP layer) so the
 * architecture becomes:
 *
 *   Store → AuthService → AuthApi → ApiClient → mockClient
 */

import { AuthApi } from "@/modules/auth/api";
import type { User } from "@/lib/types";

export interface Session {
  accessToken: string;
  refreshToken: string;
  currentUserId: string;
  rememberMe: boolean;
  loginAt: string;
  expiresAt: string;
}

export class AuthService {
  static async getSuperAdminPassword(): Promise<string> {
    const res = await AuthApi.getSuperAdminPassword();
    return res.data?.password || "";
  }

  static async setSuperAdminPassword(password: string): Promise<void> {
    await AuthApi.setSuperAdminPassword(password);
  }

  static async getSession(): Promise<Session> {
    const res = await AuthApi.getSession();
    return res.data as Session;
  }

  /* Dynamically load the logged in user details from users.ts using session.currentUserId */
  static async getCurrentUser(): Promise<User | null> {
    const res = await AuthApi.getCurrentUser();
    return res.success ? res.data : null;
  }

  static async login(credentials: { email: string; password: string }): Promise<Session> {
    const res = await AuthApi.login(credentials);
    if (!res.success || !res.data) throw new Error(res.message);
    return res.data.session;
  }

  static async logout(): Promise<void> {
    await AuthApi.logout();
  }

  /* Simulated role switching - finds the first user belonging to the selected roleId and logs them in */
  static async switchUser(roleId: string): Promise<User | null> {
    const res = await AuthApi.switchUser(roleId);
    return res.success ? res.data : null;
  }
}
