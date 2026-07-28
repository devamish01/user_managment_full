/**
 * Auth utilities — pure helpers with no side effects.
 *
 * Role metadata and demo credentials live in `core/authorization`; this file
 * only owns auth-flavoured presentation / validation helpers so the auth
 * module stays focused on authentication.
 */

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isTokenExpiringSoon = (expiresAt: string, withinMs = 5 * 60 * 1000): boolean => {
  const expiry = new Date(expiresAt).getTime();
  if (Number.isNaN(expiry)) return false;
  return expiry - Date.now() <= withinMs;
};

/** Friendly relative time, e.g. "12m ago". */
export const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};
