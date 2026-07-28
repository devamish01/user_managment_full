/**
 * useAuth — public hook alias for the Auth feature store.
 *
 * Re-exports the implementation from `../store/auth.store` so consumers
 * import from `@/modules/auth` (or `@/modules/auth/hooks`) without having to
 * know where the state actually lives.
 *
 * NOTE: the `AuthState` interface (the state shape) lives in `../types` to
 * avoid a duplicate-export collision when the module barrel re-exports both
 * `hooks` and `types`.
 */
export { useAuthStore as useAuth } from "../store/auth.store";
export type { AuthStoreState } from "../store/auth.store";
export { default } from "../store/auth.store";
