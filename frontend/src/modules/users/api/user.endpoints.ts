/**
 * User module endpoint registry.
 * Contains only URL definitions — no HTTP logic, no business logic.
 */

export const USERS = "/users";
export const USER_DETAILS = (id: string) => `/users/${id}`;
