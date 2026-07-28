/**
 * Authorization barrel.
 *
 * Single import surface for everything authorization-related. Authentication
 * concerns (login, logout, session restore, token storage) live in
 * `modules/auth` and never re-export through here.
 */
export * from "./permissions";
export * from "./roles";
export * from "./guards";
export * from "./resolver";
