/**
 * UserService — public API for the Users feature.
 *
 * Public method signatures are unchanged. Internally delegates to
 * `UserApi` (the module-level HTTP layer) so the architecture becomes:
 *
 *   Store → UserService → UserApi → ApiClient → mockClient
 */

import { UserApi } from "../api";
import { AuthApi } from "@/modules/auth/api";
import type { UserQueryParams } from "@/core/api";
import type { User } from "@/lib/types";
import type { RegisterCredentials } from "@/modules/auth/types";
import type { UserFormState } from "../types";

const createRegistrationPayload = (form: UserFormState): RegisterCredentials => {
  if (!form.password) {
    throw new Error("Password is required when creating a new user.");
  }

  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  
  // Use provided username or generate from firstName
  let username = form.username?.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 30);
  if (!username) {
    username = firstName.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  }
  
  // Ensure username is at least 3 characters (backend validation requirement)
  if (username.length < 3) {
    username = `${firstName.toLowerCase()}_${Date.now()}`.slice(0, 30);
  }

  if (!firstName || !lastName || firstName.length < 2 || lastName.length < 2) {
    throw new Error("Please provide a full name with at least first and last name.");
  }

  return {
    username,
    firstName,
    lastName,
    email: form.email,
    password: form.password,
    roleId: form.roleId,
    status: form.status,
  };
};

export class UserService {
  static getUsers(params?: UserQueryParams) {
    return UserApi.getUsers(params);
  }

  static getUserById(id: string) {
    return UserApi.getUserById(id);
  }

  static createUser(form: UserFormState) {
    const payload = createRegistrationPayload(form);
    return AuthApi.register(payload);
  }

  static updateUser(id: string, updates: Partial<User>) {
    return UserApi.updateUser(id, updates);
  }

  static deleteUser(id: string) {
    return UserApi.deleteUser(id);
  }
}
