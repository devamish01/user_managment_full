/**
 * Permission module endpoint registry.
 * Contains only URL definitions — no HTTP logic, no business logic.
 */

export const PERMISSIONS = "/permissions";
export const PERMISSION_DETAILS = (id: string) => `/permissions/${id}`;
