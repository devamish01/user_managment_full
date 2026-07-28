/**
 * Role module endpoint registry.
 * Contains only URL definitions — no HTTP logic, no business logic.
 */

export const ROLES = "/roles";
export const ROLE_DETAILS = (id: string) => `/roles/${id}`;
