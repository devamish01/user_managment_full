/**
 * Users store barrel.
 * Exposes only the default so module-level `export *` from this folder
 * does not collide with the named re-export that lives in `./hooks`.
 */
export { default, useUsersStore } from "./users.store";
