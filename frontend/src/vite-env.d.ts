/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Selects which API client the application uses.
   * - "mock"    : in-memory mock backend (default)
   * - "backend" : real HTTP backend at VITE_API_BASE_URL
   */
  readonly VITE_API_MODE?: "mock" | "backend";
  /** Base URL for the real backend when VITE_API_MODE=backend. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
