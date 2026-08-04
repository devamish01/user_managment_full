/**
 * Register feature types.
 *
 * Module-local shapes that describe the registration domain.
 */

export interface RegisterCredentials {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId?: string;
  status?: "active" | "inactive" | "blocked" | "pending";
}