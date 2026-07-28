// Contexts
export { StoreCtx } from "./context/StoreContext";
export type { StoreState } from "./context/StoreContext";
export { ThemeCtx } from "./context/ThemeContext";
export type { Theme, ThemeContextType } from "./context/ThemeContext";

// Providers
export { StoreProvider } from "./providers/StoreProvider";
export { ThemeProvider } from "./providers/ThemeProvider";

// Hooks
export { useStore } from "./hooks/useStore";
export { useTheme } from "./hooks/useTheme";
export { useHasPermission } from "./hooks/useHasPermission";

// Constants
export { SUPER_ADMIN_ROLE_ID } from "./constants";
export const isSuperAdmin = (roleId: string) => roleId === "r1";
