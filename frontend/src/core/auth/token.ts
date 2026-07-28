/**
 * Auth token storage helpers.
 *
 * Pure localStorage wrappers — no authentication logic lives here.
 * Prepared now so the axios client and future sign-in flow can share one
 * storage contract without leaking implementation details.
 */

const TOKEN_KEY = "nexus.auth.token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable — silently ignore */
  }
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — silently ignore */
  }
};
