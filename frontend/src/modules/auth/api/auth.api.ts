/**
 * Auth module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the Auth
 * endpoints. `AuthService` delegates here and continues to perform the
 * same response-unwrapping (e.g. returning `res.data?.password || ""`).
 */

import { api } from "@/core/api";
import type { ApiResponse } from "@/core/api";
import type { User } from "@/lib/types";
import type { Session } from "@/services/auth.service";
import {
  LOGIN,
  LOGOUT,
  SESSION,
  CURRENT_USER,
  SWITCH_USER,
  SUPER_ADMIN_PASSWORD,
} from "./auth.endpoints";

export class AuthApi {
  static getSuperAdminPassword(): Promise<ApiResponse<{ password: string }>> {
    return api.get<{ password: string }>(SUPER_ADMIN_PASSWORD);
  }

  static setSuperAdminPassword(password: string): Promise<ApiResponse<unknown>> {
    return api.put(SUPER_ADMIN_PASSWORD, { password });
  }

  static getSession(): Promise<ApiResponse<Session>> {
    return api.get<Session>(SESSION);
  }

  static getCurrentUser(): Promise<ApiResponse<User | null>> {
    return api.get<User | null>(CURRENT_USER);
  }

  static login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ session: Session; user: User }>> {
    return api.post<{ session: Session; user: User }>(LOGIN, credentials);
  }

  static logout(): Promise<ApiResponse<unknown>> {
    return api.post(LOGOUT);
  }

  static switchUser(roleId: string): Promise<ApiResponse<User>> {
    return api.post<User>(SWITCH_USER, { roleId });
  }
}
