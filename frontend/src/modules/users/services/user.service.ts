/**
 * UserService — public API for the Users feature.
 *
 * Public method signatures are unchanged. Internally delegates to
 * `UserApi` (the module-level HTTP layer) so the architecture becomes:
 *
 *   Store → UserService → UserApi → ApiClient → mockClient
 */

import { UserApi } from "../api";
import type { UserQueryParams } from "@/core/api";
import type { User } from "@/lib/types";

export class UserService {
  static getUsers(params?: UserQueryParams) {
    return UserApi.getUsers(params);
  }

  static getUserById(id: string) {
    return UserApi.getUserById(id);
  }

  static createUser(user: Omit<User, "id" | "createdAt" | "lastActive">) {
    return UserApi.createUser(user);
  }

  static updateUser(id: string, updates: Partial<User>) {
    return UserApi.updateUser(id, updates);
  }

  static deleteUser(id: string) {
    return UserApi.deleteUser(id);
  }
}
