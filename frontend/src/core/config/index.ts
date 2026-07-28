/**
 * Core configuration.
 *
 * Reads environment variables (via Vite's import.meta.env) and exposes a
 * single typed `config` object consumed by the rest of the core layer.
 *
 * Defaults guarantee the app runs out of the box in mock mode even when no
 * .env file is present.
 */

export type ApiMode = "mock" | "backend";

const readEnv = (key: keyof ImportMetaEnv): string | undefined => {
  // Guard against environments where import.meta.env is not yet populated
  // (e.g. during SSR or test runners) — fall back to undefined.
  try {
    const env = (import.meta as ImportMeta).env;
    const value = env?.[key];
    return typeof value === "string" ? value : undefined;
  } catch {
    return undefined;
  }
};

const rawMode = (readEnv("VITE_API_MODE") || "mock").toLowerCase();
const apiMode: ApiMode = rawMode === "backend" ? "backend" : "mock";
const apiBaseUrl = readEnv("VITE_API_BASE_URL") || "";

export const config = {
  apiMode,
  apiBaseUrl,
} as const;

export type Config = typeof config;
