/**
 * System module endpoint registry.
 * Contains only URL definitions for cross-cutting system endpoints
 * (departments, activity logs, settings).
 */

export const DEPARTMENTS = "/departments";
export const DEPARTMENT_DETAILS = (id: string) => `/departments/${id}`;
export const LOGS = "/logs";
export const SETTINGS = "/settings";
