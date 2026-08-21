/**
 * User module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the User
 * endpoints. Services delegate here; consumers of `UserService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse, UserQueryParams } from "@/core/api";
import type { User } from "@/lib/types";
import { USERS, USER_DETAILS } from "./user.endpoints";

export class UserApi {
  static getUsers(params?: UserQueryParams): Promise<ApiResponse<User[]>> {
    return api.get<User[]>(USERS, { params });
  }

  static getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get<User>(USER_DETAILS(id));
  }

  static createUser(
    user: {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      roleId: string;
      status: string;
      phone?: string;
      location?: string;
      address?: string;
      bio?: string;
      jobTitle?: string;
    },
  ): Promise<ApiResponse<User>> {
    return api.post<User>(USERS, user);
  }

  static updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<ApiResponse<User>> {
    return api.patch<User>(USER_DETAILS(id), updates);
  }

  static deleteUser(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return api.delete<{ ok: boolean }>(USER_DETAILS(id));
  }

  static resetUserPassword(
    id: string,
    password: string,
    confirmPassword?: string,
  ): Promise<ApiResponse<{ ok: boolean }>> {
    return api.post<{ ok: boolean }>(`${USER_DETAILS(id)}/reset-password`, { password, confirmPassword });
  }
}
