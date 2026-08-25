import * as React from "react";

export type ThemeMode = 
  | "light" 
  | "minimal-light" 
  | "dark" 
  | "retro" 
  | "neon" 
  | "monochrome" 
  | "glass" 
  | "terminal" 
  | "luxury";

export interface ThemeConfig {
  name: string;
  description: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  shadow: string;
  fontClass?: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: Record<ThemeMode, ThemeConfig>;
  themeButtons: { mode: ThemeMode; label: string }[];
}

export const ThemeCtx = React.createContext<ThemeContextType | null>(null);
