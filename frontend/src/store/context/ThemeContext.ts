import * as React from "react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

export const ThemeCtx = React.createContext<ThemeContextType | null>(null);
