/**
 * Footer — lightweight, non-sticky footer of the AdminLayout.
 * Intentionally minimal; customize freely without touching layout logic.
 */

import { APP_NAME, APP_VERSION } from "@/shared/constants/app";

export const Footer = () => (
  <footer className="border-t border-border px-4 py-3 md:px-6">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 text-[11px] text-muted-foreground sm:flex-row">
      <p>© 2026 {APP_NAME} Admin Panel</p>
      <p>Version {APP_VERSION}</p>
    </div>
  </footer>
);
